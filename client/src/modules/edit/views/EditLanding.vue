<template>
  <div class="container">
    <h3>Created Notes (<a class="text-secondary" @click="createNote()">Create Note</a>)</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in createdNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <div v-if="createdNotes.length==0">
      Nothing to show here! 
      <br><br></div>
    <br>
    <h3>Favourited Notes (<a class="text-secondary" href="discover">Discover Notes</a>)</h3>
    <div class="row">
      <NotePreview class="col-sm-6 col-md-2" v-for="note in favouritedNotes" :note="note" :key="note" :address="address"></NotePreview>
    </div>
    <div v-if="favouritedNotes.length==0">
      Nothing to show here! 
      <br><br></div>
    <br>
    <div v-if="purchasedNotes.length > 0">
      <h3>Purchased Notes</h3>
      <div class="row">
        <NotePreview class="col-sm-6 col-md-2" v-for="note in purchasedNotes" :note="note" :key="note" :address="address"></NotePreview>
      </div>
      <div v-if="purchasedNotes.length==0">
        Nothing to show here! 
        <br><br></div>
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
      purchasedNotes: [],
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
        "/user/notes/created",
        {},
        { headers: { 'Authorization': token } }
        );
      this.createdNotes = response.data.notes.notes;
    },
    async getFavouritedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/user/notes/favourited",
        {},
        { headers: { 'Authorization': token } }
        );
      this.favouritedNotes = response.data.notes.favourited;
    },
    async getPurchasedNotes() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/user/notes/purchased",
        {},
        { headers: { 'Authorization': token } }
        );
      this.purchasedNotes = response.data.notes.purchased;
    }
  },
  created() {
    this.getCreatedNotes();
    this.getFavouritedNotes();
    this.getPurchasedNotes();
  }
};
</script>

<style scoped></style>