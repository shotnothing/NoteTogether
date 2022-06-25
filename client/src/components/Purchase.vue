<template>
  <div class="container">
    <div class="d-flex">
      <div class="flex-fill">
        <RedditPreview v-for="note in notes" :note="note" :key="note"></RedditPreview>
        <h3>Preview:</h3>
        <div class="m-2 p-2 bg-white border border-secondary" v-html="preview"></div>
      </div>
      <div class="m-2">
        <CreditBalance :user="user"></CreditBalance>
        <div class="w-100">Create notes or write reviews to earn credits!</div>
      </div>
    </div>
    <button
      class="float-right btn btn-secondary btn-block w-25 m-2"
      type="button"
      v-on:click="purchaseNote()"
    >
      Purchase
    </button>
  </div>
</template>

<script>
import CreditBalance from "@/components/CreditBalance";
import RedditPreview from "@/components/RedditPreview";
import { marked } from 'marked';

export default {
  name: "Purchase",
  props: ["user"],
  data() {
    return {
      tier: "",
      price: 0,
      data: {},
      notes: [],
      preview: "",
    }
  },
  components: {
    CreditBalance,
    RedditPreview
  },
  methods: {
    async getTier() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/getTier",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.tier = response.data.tier;
        this.price = response.data.price;
      } catch (err) {
        swal("Error", err.response, "error");
      }
    },
    async viewNote(){
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        // swal("Success", "Note has already been purchased or is free", "success");
        this.$router.push("/discover/"+this.$route.params.noteId);
      } catch (err) {
        switch (err.response.status) {
          case 402:
            this.preview = marked(err.response.data.preview);
            this.notes = [{
              title: err.response.data.title,
              userId: {
                username: err.response.data.username,
              },
              dateLastUpdated: err.response.data.dateLastUpdated,
              votes: err.response.data.votes,
              _id: this.$route.params.noteId
            }];
            break;
          default:
            swal("Error", err.response, "error");
        }
        swal("Error", err, "error");
      }
    },
    async purchaseNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde.content);
        let response = await this.$http.post(
          "/note/purchase",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        swal("Success", "Purchase Successful", "success");
        let favouriteResponse = await this.$http.post(
          "/note/favourite",
          { noteId: this.$route.params.noteId, action: "favourite" },
          { headers: { 'Authorization': token } }
        );
        this.$router.push("/study/"+this.$route.params.noteId);
        console.log(response);
        console.log(favouriteResponse);
      } catch (err) {
        switch(err.request.status) {
          case 405:
            swal("Error", "Not enough credits to purchase this", "error");
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    }
  },
  async created() {
    await this.getTier();
    await this.viewNote();
  }
};
</script>