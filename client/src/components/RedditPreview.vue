<template>
  <div class="m-2 bg-white d-flex">
    <div class="text-center flex-fixed-width-item pt-2">
      <a v-on:click="upvote()">
        <span v-if="voteStatus=='upvote'" class="text-secondary">⬆</span>
        <span v-else class="text-dark">⬆</span>
      </a>
      <br>
      {{ votes }}
      <br>
      <a v-on:click="downvote()">
        <span v-if="voteStatus=='downvote'" class="text-secondary">⬇</span>
        <span v-else class="text-dark">⬇</span>
      </a>
    </div>
    <div class="text-truncate py-2">
      <button class="lead">
        <a v-bind:href="'/discover/'+note._id" class="text-dark">{{ note.title }}</a>
        <span v-if="isLocked" class="ml-2">🔒</span>
        <a v-else class="ml-2" v-on:click="favourite()">
          <span v-if="isFavourited" class="text-secondary">★</span>
          <span v-else class="text-dark">☆</span>
        </a>
      </button>
      <div class="font-weight-light small">{{ note.userId.username }}</div>
      <div class="font-weight-light small">{{ this.timeDiff }}</div>
    </div>
    <div class="ml-auto p-2">
      <div v-if="note.votes>100" class="color-gold">
        Gold Tier  
      </div>
      <div v-else-if="note.votes>50" class="color-silver">
        Silver Tier
      </div>
      <div v-else-if="note.votes>20" class="color-bronze">
        Bronze Tier
      </div>
      <div v-else>
        Free Tier
      </div>
      <br>
    </div>
  </div>
</template>

<script>
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
        } else {
          this.voteStatus = "upvote";
        }
        let response = await this.$http.post(
          "/note/vote",
          {
            action: this.voteStatus,
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
        await this.getVotes();
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
    async downvote() {
      try {
        let token = localStorage.getItem("jwt");
        if (this.voteStatus == "downvote") {
          this.voteStatus = "clear";
        } else {
          this.voteStatus = "downvote";
        }
        let response = await this.$http.post(
          "/note/vote",
          {
            action: this.voteStatus,
            noteId: this.note._id,
          },
          { headers: { 'Authorization': token } }
        );
        await this.getVotes();
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
        this.$forceUpdate();
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
    await this.checkLocked();
    await this.checkFavourited();
    await this.getVotes();
  }
};
</script>