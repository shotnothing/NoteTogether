<template>
  <div class="container">
    <section class="text-center align-items-center flex-column m-auto">
    <h1>Study Notes</h1>
    </section>

    <h3>Created Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in createdNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <div v-if="createdNotes.length==0">
        Nothing to show here! 
        <br><br></div>
    <br>
    <h3>Favourited Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in favouritedNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <div v-if="favouritedNotes.length==0">
      Nothing to show here! 
      <br><br></div>
    <br>
    <h3>Purchased Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in purchasedNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <div v-if="purchasedNotes.length==0">
      Nothing to show here! 
      <br><br></div>

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
      createdNotes: [],
      favouritedNotes: [],
      purchasedNotes: [],
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
      this.createdNotes.push(...createdResponse.data.notes.notes);
      this.favouritedNotes.push(...favouritedResponse.data.notes.favourited);
      this.purchasedNotes.push(...purchasedResponse.data.notes.purchased);
    },
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>