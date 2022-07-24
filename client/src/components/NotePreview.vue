<template>
  <div class="" href="">
    <button v-on:click="accessNote()" class="bg-primary p-2 text-left" type="button">
      <img src="@/assets/SampleThumbnail.png">
      <div>
        <div class="text-dark small lead">{{ note.title }}</div>
        <div class="text-secondary small">{{ note.userId.username }}<span v-if=!note.isPublished> (Unpublished)</span></div>
      </div>
    </button>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  name: "NotePreview",
  props: ["note", "address"],
  methods: {
    async accessNote() {
      try {
        if (this.address == "study" || !this.note.isPublished) {
          this.$router.push("/"+this.address+"/"+this.note._id);
        } else {
          swal("Error", "Cannot edit a published note!", "error");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>