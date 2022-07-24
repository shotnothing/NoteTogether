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

      <v-pagination
        v-model="page"
        :length=pageCount
        :total-visible="7"
        circle
        color="bg-secondary"
        @input="searchNotes()"
      ></v-pagination>

      <div class="">
        <SearchResultList class="row" :user="user" v-for="note in searchResults" :note="note"></SearchResultList>
      </div>

      <v-pagination
        v-model="page"
        :length=pageCount
        :total-visible="7"
        circle
        color="bg-secondary"
        @input="searchNotes()"
      ></v-pagination>

      <br>

    </div>
    <div class="pl-5">
      <CreditBalance :user="user"></CreditBalance>
      <div class="w-75">Create notes or write reviews to earn credits!</div>

      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="#CE9999"
          v-if="loading"
        ></v-progress-circular>
      </div>

    </div>
  </div>
</template>

<script>
import SearchResultList from "@/components/SearchResultList.vue";
import CreditBalance from "@/components/CreditBalance.vue";

export default {
  name: "EditLanding",
  props: ["user"],
  components: {
    SearchResultList,
    CreditBalance,
  },
  data() {
    return {
      user: {},
      searchTerm: "",
      searchResults: [],
      page: 1,
      loading: false,
    };
  },
  methods: {
    async searchNotes() {
      this.loading = true;
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: this.searchTerm, page: this.page },
        { headers: { 'Authorization': token } }
      );
      this.searchResults = response.data.searchResults;
      this.pageCount = response.data.pageCount;
      console.log(response)
      this.loading = false;
    }
  },
  created() {
    this.searchNotes();
  }
};
</script>

<style scoped></style>