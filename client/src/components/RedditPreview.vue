<template>
  <div class="m-2 bg-white d-flex border border-secondary">
    <div class="text-center flex-fixed-width-item pt-2">
      <a v-on:click="upvote()">
        <span v-if="voteStatus=='upvote'" class="text-secondary">⬆</span>
        <span v-else class="text-dark">⬆</span>
      </a>
      <br>
      {{ note.votes }}
      <br>
      <a v-on:click="downvote()">
        <span v-if="voteStatus=='downvote'" class="text-secondary">⬇</span>
        <span v-else class="text-dark">⬇</span>
      </a>
    </div>
    <div class="text-truncate py-2">
      <button class="lead">
        <a v-bind:href="'/discover/'+note._id" class="text-dark">{{ note.title }}</a>
        <span v-if="note.isLocked && note.tier!='free'" class="ml-2">🔒</span>
        <a v-else class="ml-2" v-on:click="favourite()">
          <span v-if="isFavourited" class="color-gold font-weight-light">★</span>
          <span v-else class="text-dark font-weight-light">☆</span>
        </a>
      </button>
      <div class="font-weight-light small">submitted {{ this.timeDiff }} by {{ note.userId.username }}</div>
      <div v-if="note.isLocked && note.tier!='free'">
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
      voteStatus: "clear",
      isLocked: false,
      isFavourited: false,
      votes: 0,
      tier: "",
      price: 0,
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
    async getTier() {
      // depreciated
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/getTier",
          { noteId: this.note._id },
          { headers: { 'Authorization': token } }
        );
        this.tier = response.data.tier;
        this.price = response.data.price;
      } catch (err) {
        swal("Error", err.response, "error");
      }
    },
    async checkVoted() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/checkVoted",
          {
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
        if (response.data.res == "no vote") {
          this.voteStatus = "clear";
        } else {
          this.voteStatus = response.data.res;
        }
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
    async checkPurchased() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/checkPurchased",
          {
            noteId: this.note._id
          },
          { headers: { 'Authorization': token } }
        );
        if (response.data.purchased) {
          this.isLocked = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async checkLocked() {
      // depreciated
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          {
            noteId: this.note._id
          },
          { headers: { 'Authorization': token } }
        );
      } catch (err) {
        switch (err.request.status) {
          case 402:
            this.isLocked = true;
            break;
          default:
            return;
        }
      }
    },
    async checkFavourited() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/checkFavourited",
          {
            noteId: this.note._id
          },
          { headers: { 'Authorization': token } }
        );
        if (response.data.favourited) {
          this.isFavourited = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getVotes() {
      // depreciated
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/getVotes",
          {
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
        this.votes = response.data.votes;
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
        }  
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
        note.title = "poo"
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
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
        // await this.getVotes();
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
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
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
        }  
      }
    },
  },
  async created() {
    await this.getTimeDiff();
    await this.checkVoted();
    // await this.checkLocked();
    await this.checkFavourited();
    await this.getVotes();
    //await this.getTier();
  }
};
</script>