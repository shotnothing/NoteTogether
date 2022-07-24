<template>
  <div class="m-2 bg-white d-flex border border-secondary">
    <div class="text-center flex-fixed-width-item pt-2">
      <a v-on:click="upvote()">
        <span v-if="this.voteStatus=='upvote'" class="text-secondary">⬆</span>
        <span v-else class="text-dark">⬆</span>
      </a>
      <br>
      {{ this.votes }}
      <br>
      <a v-on:click="downvote()">
        <span v-if="this.voteStatus=='downvote'" class="text-secondary">⬇</span>
        <span v-else class="text-dark">⬇</span>
      </a>
    </div>
    <div class="text-truncate py-2">
      <button class="lead">
        <a v-bind:href="'/discover/'+note._id" class="text-dark">{{ note.title }}</a>
        <span v-if="this.isLocked && this.tier!='free'" class="ml-2">🔒</span>
        <a v-else class="ml-2" v-on:click="favourite()">
          <span v-if="this.isFavourited" class="color-gold font-weight-light">★</span>
          <span v-else class="text-dark font-weight-light">☆</span>
        </a>
      </button>
      <div class="font-weight-light small">submitted {{ this.timeDiff }} by {{ note.username }}</div>
      <div v-if="this.isLocked && this.tier!='free'">
        <a class="small" v-bind:href="'/purchase/'+note._id">
          <span class="color-dark">unlock</span>
        </a>
      </div>
      <div v-else>
        <a class="small" v-bind:href="'/discover/'+note._id">
          <span class="color-dark">view</span>
        </a>
        <span></span>
        <a class="small ml-2" v-bind:href="'/edit/'+note._id">
          <span class="color-dark">fork</span>
        </a>
      </div>
    </div>


    <div class="ml-auto p-2 w-25">

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
        >
        <div class="ml-auto w-75">
          <span v-if="note.tier=='gold'" class="color-gold">
            Gold 
          </span>
          <span v-else-if="note.tier=='silver'" class="color-silver">
            Silver 
          </span>
          <span v-else-if="note.tier=='bronze'" class="color-bronze">
            Bronze 
          </span>
          <span v-else>
            Free 
          </span>
          Tier
        </div>
        </span>
      </template>
      <span>
      Based on upvotes and number of users that favourited this note.
      <br>Favourite Count: {{this.note.favourites}}
      <br>Vote Balance: {{this.note.votes}}
      <br>Metric (like a score): {{this.note.metric}}
      </span>
    </v-tooltip>

      <div class="ml-auto w-75 font-weight-light">
        Cost to Unlock: {{ note.price }}
      </div>
    </div>

  </div>
</template>

<script>
import swal from "sweetalert";

export default {
  name: "NotePreview",
  props: ["note", "user"],
  data() {
    return {
      timeDiff: "invalid",
      voteStatus: "no vote",
      isLocked: false,
      isFavourited: false,
      votes: 0,
      tier: "",
      price: 0,
    }
  },
  watch: {
    note: function(src, dst) {
      this.voteStatus = this.note.voteStatus;
      this.isLocked = this.note.isLocked;
      this.isFavourited = this.note.isFavourited;
      this.votes = this.note.votes;
      this.tier = this.note.tier;
      this.price = this.note.price;
      this.getTimeDiff();
    }
  },
  methods: {
    getTimeDiff() {
      let timeDiffRaw = (new Date()) - (new Date(this.note.dateLastUpdated));
      let days = Math.floor(timeDiffRaw / (1000*60*60*24));
      let hours = Math.floor(timeDiffRaw / (1000*60*60));
      let minutes = Math.floor(timeDiffRaw / (1000*60));
      let seconds = Math.floor(timeDiffRaw / 1000);
      if (days > 0) {
        this.timeDiff = String(days) + (days==1 ? " day ago" : " days ago");
      } else if (hours > 0) {
        this.timeDiff = String(hours) + (hours==1 ? " hour ago" : " hours ago");
      } else if (minutes > 0) {
        this.timeDiff = String(minutes) + (minutes==1 ? " minute ago" : " minutes ago");
      } else {
        this.timeDiff = String(seconds) + (seconds==1 ? " second ago" : " seconds ago");
      }
    },
    async upvote() {
      try {
        let token = localStorage.getItem("jwt");
        if (this.voteStatus == "upvote") {
          this.voteStatus = "clear";
          this.votes = this.votes - 1;
        } else if (this.voteStatus == "downvote") {
          this.voteStatus = "upvote";
          this.votes = this.votes + 2;
        } else {
          this.voteStatus = "upvote";
          this.votes = this.votes + 1;
        }
        let response = await this.$http.post(
          "/note/vote",
          {
            action: this.voteStatus,
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
            console.log(err.request);
        }  
      }
    },
    async downvote() {
      try {
        let token = localStorage.getItem("jwt");
        if (this.voteStatus == "downvote") {
          this.voteStatus = "clear";
          this.votes = this.votes + 1;
        } else if (this.voteStatus == "upvote") {
          this.voteStatus = "downvote";
          this.votes = this.votes - 2;
        } else {
          this.voteStatus = "downvote";
          this.votes = this.votes - 1;
        }
        let response = await this.$http.post(
          "/note/vote",
          {
            action: this.voteStatus,
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
            console.log(err.request);
        }  
      }
    },
    async favourite() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/favourite",
          {
            action: "toggle",
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
        this.isFavourited = response.data.status == "favourited";
        console.log(this.isFavourited)
        console.log(this.note.isFavourited)
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
            console.log(err.request);
        }  
      }
    },
  },
  async created() {
    this.voteStatus = this.note.voteStatus;
    this.isLocked = this.note.isLocked;
    this.isFavourited = this.note.isFavourited;
    this.votes = this.note.votes;
    this.tier = this.note.tier;
    this.price = this.note.price;
    this.getTimeDiff();
  }
};
</script>