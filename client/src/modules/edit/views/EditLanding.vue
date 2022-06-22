<template>
  <div class="container">
    <h3>Created Notes</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in ownedNotes" :note="note" :key="note"></NotePreview>
      <div class="col-sm-6 col-md-2">
        <a @click="createNote()" class="text-dark">
          <img src="@/assets/SampleThumbnail.png" style="filter: brightness(0%) invert(1)">
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -65%); font-size: 100px">+</span>
          <span class="text-center" style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -25%);">Create Note</span>
        </a>
      </div>
    </div>
    <br>
    <h3>Saved Notes</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in savedNotes" :note="note" :key="note"></NotePreview>
      <div class="col-sm-6 col-md-2">
        <a href="/discover" class="text-dark">
          <img src="@/assets/SampleThumbnail.png" style="filter: brightness(0%) invert(1)">
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -65%); font-size: 100px">+</span>
          <span class="text-center" style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -25%);">Discover Notes</span>
        </a>
      </div>
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
      publishedNotes: [],
      ownedNotes: [],
      savedNotes: [],
    };
  },
  methods: {
    async createNote() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/create",
        { title: "hi", content: "" },
        { headers: { 'Authorization': token } }
      );
      this.$router.push("/edit/"+response.data.note._id);
    },
    async getOwnedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.ownedNotes = response.data.searchResults;
    },
    async getSavedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.savedNotes = response.data.searchResults;
    }
  },
  created() {
    this.getOwnedNotes();
    this.getSavedNotes();
  }
};
</script>

<style scoped></style>