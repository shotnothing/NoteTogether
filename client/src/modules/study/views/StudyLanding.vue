<template>
  <div class="container bg-primary">
    <h3>Published Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in publishedNotes" :note="note" :key="note" :address="address" :userId="userId"></NotePreview>
    </div>
    <div v-if="publishedNotes.length==0">
        Nothing to show here! 
        <br><br></div>
    <br>
    <h3>Private Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in unpublishedNotes" :note="note" :key="note" :address="address" :userId="userId"></NotePreview>
    </div>
    <div v-if="unpublishedNotes.length==0">
        Nothing to show here! 
        <br><br></div>
    <br>
    <h3>Favourited Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in favouritedNotes" :note="note" :key="note" :address="address" :userId="userId"></NotePreview>
    </div>
    <div v-if="favouritedNotes.length==0">
      Nothing to show here! 
      <br><br></div>
    <br>
    <h3>Purchased Notes</h3>
    <div class=row>
      <NotePreview class="col-sm-6 col-md-2" v-for="note in purchasedNotes" :note="note" :key="note" :address="address" :userId="userId"></NotePreview>
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
      publishedNotes: [],
      unpublishedNotes: [],
      favouritedNotes: [],
      purchasedNotes: [],
      address: "study",
      userId: "",
    };
  },
  methods: {
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
      this.userId = favouritedResponse.data._id;
      this.publishedNotes.push(...createdResponse.data.published);
      this.unpublishedNotes.push(...createdResponse.data.unpublished);
      this.favouritedNotes.push(...favouritedResponse.data.favourited);
      this.purchasedNotes.push(...purchasedResponse.data.purchased);
    },
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>