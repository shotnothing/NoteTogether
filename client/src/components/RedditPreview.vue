<template>
  <div class="m-2 bg-white d-flex">
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
      <button class="lead"><a v-bind:href="'/discover/'+note._id" class="text-dark">{{ note.title }}</a></button>
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
      numOfVotes: 0,
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
        this.$forceUpdate();
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
        this.$forceUpdate();
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
  }
};
</script>