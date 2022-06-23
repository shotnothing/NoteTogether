<template>
  <div class="container">
    <h3>Study Notes</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in studyNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
  </div>
</template>

<script>
import NotePreview from "@/components/NotePreview.vue";

export default {
  name: "StudyLanding",
  components: {
    NotePreview,
  },
  data() {
    return {
      studyNotes: [],
      address: "study",
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
    async getStudyNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: "" },
        { headers: { 'Authorization': token } }
        );
      this.studyNotes = response.data.searchResults;
    }
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>