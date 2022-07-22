<template>
  <div class="container">
    <section class="text-center align-items-center flex-column m-auto">
    <h1>Study Notes</h1>

    </section>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in studyNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
  </div>
</template>

<script>
import NotePreview from "@/components/NotePreview.vue";
import swal from "sweetalert";

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
      let createdResponse = await this.$http.post(
        "/user/notes/created",
        {},
        { headers: { 'Authorization': token } }
      );
      let favouritedResponse = await this.$http.post(
        "/user/notes/favourited",
        {},
        { headers: { 'Authorization': token } }
      );
      let purchasedResponse = await this.$http.post(
        "/user/notes/purchased",
        {},
        { headers: { 'Authorization': token } }
      );
      this.studyNotes.push(...createdResponse.data.notes.notes);
      this.studyNotes.push(...favouritedResponse.data.notes.favourited);
      this.studyNotes.push(...purchasedResponse.data.notes.purchased);
    },
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>