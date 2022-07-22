<template>
  <div class="container">

    <h3 class="ml-2">View Mode</h3>
    <div class="d-flex">
      <div class="flex-fill">
        <RedditPreview :user="user" v-for="note in notes" :note="note"></RedditPreview>
        <div v-html="content" class="m-2 p-2 bg-white border border-secondary"></div>
      </div>
      <div class="m-2">
        <CreditBalance :user="user"></CreditBalance>
        <div class="w-100">Create notes or write reviews to earn credits!</div>
      </div>
    </div>
  </div>
</template>

<script>
import RedditPreview from "@/components/RedditPreview.vue";
import CreditBalance from "@/components/CreditBalance.vue";
import { marked } from 'marked';
import swal from "sweetalert";

export default {
  name: "DiscoverView",
  props: ["user", "note"],
  components: {
    RedditPreview,
    CreditBalance,
  },
  data() {
    return {
      user: {},
      content: "",
      notes: [],
    };
  },
  methods: {
    async viewNote(){
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.content = marked(response.data.content);
        this.notes = [{
          title: response.data.title,
          userId: {
            username: response.data.username,
          },
          dateLastUpdated: response.data.dateLastUpdated,
          votes: response.data.votes,
          tier: response.data.tier,
          isFavourited: response.data.isFavourited,
          isLocked: response.data.isLocked, 
          price: response.data.price, 
          voteStatus: response.data.voteStatus, 
          _id: this.$route.params.noteId
        }];
      } catch (err) {
        switch (err.request.status) {
          case 402:
            this.$router.push("/purchase/"+this.$route.params.noteId);
            break;
          default:
            swal("Error", "Something went wrong", "error");
        }
      }
    }
  },
  async created() {
    await this.viewNote();
  }
};
</script>

<style scoped></style>