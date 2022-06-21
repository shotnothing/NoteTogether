<template>
  <div class="container">
    <h3>Published Notes</h3>
    <div class="row">
      <NotePreview class="col-sm" v-for="note in publishedNotes" :note="note" :key="note"></NotePreview>
    </div>
    <h3>Created Notes</h3>
    <div class="row">
      <NotePreview class="col-sm" v-for="note in ownedNotes" :note="note" :key="note"></NotePreview>
    </div>
    <h3>Saved Notes</h3>
    <div class="row">
      <NotePreview class="col-sm" v-for="note in savedNotes" :note="note" :key="note"></NotePreview>
    </div>
  </div>
</template>

<script>
import NotePreview from "@/components/NotePreview.vue";

export default {
  name: "EditLanding",
  components: {
    NotePreview,
  },
  data() {
    return {
      publishedNotes: [
        {name:'BK Generics', username: 'Boon Keng', votes: 40},
        {name:'BK Never Gonna Give You Up', username: 'Boon Keng', votes: 41},
        {name:'BK All Star', username: 'Boon Keng', votes: 30},
      ],
      ownedNotes: [
        {name:'Type Erasure', username: 'Boon Keng', votes: 43},
        {name:'Type Inference', username: 'Boon Keng', votes: 44},
        {name:'Generic Types', username: 'Boon Keng', votes: 45},
      ],
      savedNotes: [
        {name:'AL Generics', username: 'Aljunied', votes: 46},
        {name:'HS Never Gonna Give You Up', username: 'Hong Shan', votes: 47},
        {name:'BS All Star', username: 'Bi Shan', votes: 48},
        {name:'AL Generics', username: 'Aljunied', votes: 49},
        {name:'HS Never Gonna Give You Up', username: 'Hong Shan', votes: 50},
        {name:'BS All Star', username: 'Bi Shan', votes: -10},
      ],
    };
  },
  methods: {
    async getPublishedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "gen" },
        { headers: { 'Authorization': token } }
        );
      return response.data.searchResults;
    },
    async getOwnedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      return response.data.searchResults;
    },
    async getSavedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      return response.data.searchResults;
    }
  },
  created() {
    this.getPublishedNotes();
    this.getOwnedNotes();
    this.getSavedNotes();
  }
};
</script>

<style scoped></style>