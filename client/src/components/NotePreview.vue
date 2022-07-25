<template>
  <div class="" href="" v-if=!isRemoved>
    <button v-on:click="accessNote()" class="bg-primary p-2 text-left" type="button">
      <img src="@/assets/SampleThumbnail.png">
      <div class="pt-2">
        <div class="text-dark small">{{ note.title }}</div>
        <div class="text-dark small"> By {{ note.userId.username }}</div>
        <div class="small">
          <span v-if="address === 'edit'">
            <a
              class="text-secondary"
              v-if=!note.isPublished
              v-on:click.stop="publishNote()"
            >
              <u>Publish</u>
            </a>
            <a
              class="text-secondary"
              v-else
              v-on:click.stop="forkNote()"
            >
              <u>Fork</u>
            </a>
             | 
          </span>
          <span v-else>
            <a
              class="text-secondary"
              v-on:click.stop="accessNote()"
            >
              <u>Study</u>
            </a>
             | 
          </span>
          <a
            class="text-secondary"
            v-if="note.userId._id === userId"
            v-on:click.stop="deleteNote()"
          >
            <u>Delete</u>
          </a>
          <a
            class="text-secondary"
            v-else
            v-on:click.stop="unfavouriteNote()"
          >
            <u>Remove</u>
          </a>
          </div>
      </div>
    </button>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  name: "NotePreview",
  props: ["note", "address", "userId"],
  data() {
    return {
      isRemoved: false,
    };
  },
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
    },
    async forkNote() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/create",
        { title: "Untitled Document", content: "", forkOf: this.note._id },
        { headers: { 'Authorization': token } }
      );
      this.$router.push("/edit/"+response.data.note._id);
    },
    async publishNote() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/publish",
          { noteId: this.note._id },
          { headers: { 'Authorization': token } }
        );
        this.isRemoved = true;
        swal("Success", "Publish Successful! New note created in private! Please refresh to see the changes!", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 405:
            swal("Error", "Already Published! Please refresh to see the changes!", "error");
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    },
    async deleteNote() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/delete",
          { noteId: this.note._id },
          { headers: { 'Authorization': token } }
        );
        this.isRemoved = true;
        swal("Success", "Delete Successful!", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 405:
            swal("Error", "Already Deleted! Please refresh to see the changes!", "error");
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    },
    async unfavouriteNote() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/favourite",
          { noteId: this.note._id, action: "unfavourite" },
          { headers: { 'Authorization': token } }
        );
        this.isRemoved = true;
        swal("Success", "Remove Successful!", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 405:
            swal("Error", "Already Unfavourited! Please refresh to see the changes!", "error");
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    },
  }
};
</script>