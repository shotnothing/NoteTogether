<template>
  <div>
    <div>
      <h3>Edit Note</h3>
      <span>Title</span>
      <div class="input-group w-50">
        <input
          type="text"
          id="title"
          label="Document Title"
          class="form-control rounded"
          placeholder="Insert Title Here"
          v-model="title"/>
      </div>
      <br>
      <form>
        <vue-simplemde 
          v-model="content"
          ref="noteUploadMDE"
          v-if="loaded"
        />
      </form>

      <div class="float-right w-50">
        <button
          class="float-right btn btn-secondary btn-block w-25 m-2"
          type="button"
          v-on:click="publishNote()"
        >
          Publish
        </button>

        <button
          class="float-right btn btn-secondary btn-block w-25 m-2"
          type="button"
          v-on:click="saveNote()"
        >
          Save
        </button>

        <button
          class="float-right btn btn-secondary btn-block w-25 m-2"
          type="button"
          v-on:click="renderNote()"
        >
          Render
        </button>
      </div>

      <br><br>
      <div 
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde'
import { marked } from 'marked';
import swal from "sweetalert";
export default {
  name: "MarkdownEditorView",
  data() {
    return {
      content: "",
      title: "",
      loaded: false,
      renderedContent: "",
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async getNote() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.content = response.data.content;
        this.title = response.data.title;
        this.loaded = true;
      } catch (err) {
        switch(err.request.status) {
          case 402:
            this.$router.push("/purchase/"+this.$route.params.noteId);
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
        }
      }
    },
    async saveNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde);
        if (this.title === "") {
          swal("Error", "Please enter a title!", "error");
          return;
        }
        if (this.content === "") {
          swal("Error", "Please enter some content!", "error");
          return;
        }
        let response = await this.$http.post(
          "/note/update",
          { title: this.title, content: this.content, noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
          );
        swal("Success", "Save Successful", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
        }
      }
    },
    async publishNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde);
        if (this.title === "") {
          swal("Error", "Please enter a title!", "error");
          return;
        }
        if (this.content === "") {
          swal("Error", "Please enter some content!", "error");
          return;
        }
        let response = await this.$http.post(
          "/note/publish",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
          );
        swal("Success", "Publish Successful", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", 'Uhh, error {{err.request.status}}', "error");
        }
      }
    },
    async renderNote() {
      this.renderedContent = marked(this.mde.content);
    },
  },
  mounted() {
    this.getNote();
  }
};
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>