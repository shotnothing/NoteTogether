<template>
    <div>
      <v-divider></v-divider>
        <div class="bg-white d-flex">
            <div class="text-center flex-fixed-width-item">
                <a v-on:click="upvote()">
                    <span v-if="this.voteStatus=='upvote'" class="text-secondary">⬆</span>
                    <span v-else class="text-dark">⬆</span>
                </a>
                <br>
                {{ votes }}
                <br>
                <a v-on:click="downvote()">
                    <span v-if="this.voteStatus=='downvote'" class="text-secondary">⬇</span>
                    <span v-else class="text-dark">⬇</span>
                </a>
            </div>
            <div class="text-wrap">
                <div class="font-weight-light small">reviewed {{ this.timeDiff }} by {{ review.userId.username }} </div>
                <div class="text-dark">{{ review.content }}</div>
            </div>
        </div>
        
    </div>
</template>
<script>
import swal from "sweetalert";

export default {
    name: "ReviewList",
    props: ["review", "user"],
    data() {
        return {
            timeDiff: "invalid",
            voteStatus: "no vote",
            votes: 0,
        }
    },
    methods: {
        getTimeDiff() {
            let timeDiffRaw = (new Date()) - (new Date(this.review.dateCreated));
            let days = Math.floor(timeDiffRaw / (1000 * 60 * 60 * 24));
            let hours = Math.floor(timeDiffRaw / (1000 * 60 * 60));
            let minutes = Math.floor(timeDiffRaw / (1000 * 60));
            let seconds = Math.floor(timeDiffRaw / 1000);
            if (days > 0) {
                this.timeDiff = String(days) + (days == 1 ? " day ago" : " days ago");
            } else if (hours > 0) {
                this.timeDiff = String(hours) + (hours == 1 ? " hour ago" : " hours ago");
            } else if (minutes > 0) {
                this.timeDiff = String(minutes) + (minutes == 1 ? " minute ago" : " minutes ago");
            } else {
                this.timeDiff = String(seconds) + (seconds == 1 ? " second ago" : " seconds ago");
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
                    "/review/vote", {
                        action: this.voteStatus,
                        reviewId: this.review._id,
                    }, { headers: { 'Authorization': token } }
                );
            } catch (err) {
                switch (err.request.status) {
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
                    "/review/vote", {
                        action: this.voteStatus,
                        reviewId: this.review._id,
                    }, { headers: { 'Authorization': token } }
                );
            } catch (err) {
                switch (err.request.status) {
                    case 401:
                        swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
                        break;
                    default:
                        swal("Error", 'Uhh, error {{err.request.status}}', "error");
                        console.log(err.request);
                }
            }
        }
    },
    async created() {
        this.voteStatus = this.review.voteStatus;
        this.votes = this.review.votes;
        await this.getTimeDiff();
    }
};
</script>