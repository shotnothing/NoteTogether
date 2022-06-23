<template>
  <div class="container d-flex">
    <div class="flex-fill">
      <div class="float-right input-group w-50 p-2">
        <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" v-model="searchTerm"/>
        <button type="button" class="btn btn-secondary" v-on:click="searchNotes()">Search</button>
      </div>
      <div class="">
        <h2 class="p-2">Search Results</h2>
      </div>
      <div class="">
        <RedditPreview class="row" :user="user" v-for="note in searchResults" :note="note" :key="note.votes"></RedditPreview>
      </div>
    </div>
    <div class="p-2 m-2 w-25">
      <CreditBalance :user="user"></CreditBalance>
      <div class="w-100">Create notes or write reviews to earn credits!</div>
    </div>
  </div>
</template>

<script>
import RedditPreview from "@/components/RedditPreview.vue";
import CreditBalance from "@/components/CreditBalance.vue";

export default {
  name: "EditLanding",
  props: ["user"],
  components: {
    RedditPreview,
    CreditBalance,
  },
  data() {
    return {
      user: {},
      searchTerm: "",
      searchResults: [],
    };
  },
  methods: {
    async getNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.searchResults = response.data.searchResults;
    },
    async searchNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: this.searchTerm },
        { headers: { 'Authorization': token } }
      );
      this.searchResults = response.data.searchResults;
    }
  },
  created() {
    this.getNotes();
  }
};
</script>

<style scoped></style>