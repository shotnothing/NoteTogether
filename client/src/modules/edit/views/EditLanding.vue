<template>
  <div class="container">
    <h3>Created Notes (<a class="text-secondary" @click="createNote()">Create Note</a>)</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in createdNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <br>
    <h3>Favourited Notes (<a class="text-secondary" href="discover">Discover Notes</a>)</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in favouritedNotes" :note="note" :key="note" :address="address"></NotePreview>
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
      createdNotes: [],
      favouritedNotes: [],
      address: "edit",
    };
  },
  methods: {
    async createNote() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/create",
        { title: "Untitled Document", content: "" },
        { headers: { 'Authorization': token } }
      );
      this.$router.push("/edit/"+response.data.note._id);
    },
    async getCreatedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.createdNotes = response.data.searchResults;
    },
    async getFavouritedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.favouritedNotes = response.data.searchResults;
    }
  },
  created() {
    this.getCreatedNotes();
    this.getFavouritedNotes();
  }
};
</script>

<style scoped></style>