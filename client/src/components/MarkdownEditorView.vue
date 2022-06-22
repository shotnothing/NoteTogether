<template>
  <div>
    <div class="input-group w-50">
      <input
        type="text"
        label="Document Title"
        class="form-control rounded"
        placeholder="Insert Title Here"
        v-model="title"/>
    </div>
    <br>
    <form>
      <vue-simplemde 
        v-model="content"
        v-on:change="getNote()"
        ref="noteUploadMDE"
      />
    </form>

    <div class="float-right w-50">
      <button
        class="float-right btn btn-secondary btn-block w-25 m-2"
        type="button"
        v-on:click="getNote()"
      >
        Upload
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
</template>

<script>
import VueSimplemde from 'vue-simplemde'
import { marked } from 'marked';
import swal from "sweetalert";
export default {
  name: "MarkdownEditorView",
  data() {
    return {
      title: "",
      content: "",
      renderedContent: ""
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async getNote() {
      try {
        let token = localStorage.getItem("jwt");
        this.content = "4";
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.$emit("change");
        this.content = "5";
        this.content = response.data.content;
        this.title = response.data.title;
      } catch (err) {
        // this.content = err;
      }
    },
    async updateNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde);
        let response = await this.$http.post(
          "/note/update",
          this.mde,
          { headers: { 'Authorization': token } }
          );
        swal("Success", "Upload Successful (But Not Published)", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 409:
            swal("Error", "You already have a document with the same name!", "error");
            break;
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
  async created() {
    await this.getNote();
  }
};
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>