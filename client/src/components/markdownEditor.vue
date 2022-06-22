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
    <vue-simplemde 
      v-model="content" 
      ref="noteUploadMDE"
    />

    <div class="float-right w-50">
      <button
        class="float-right btn btn-secondary btn-block w-25 m-2"
        type="button"
        v-on:click="uploadNote()"
      >
        Create
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
  name: "MarkdownEditor",
  data() {
    return {
      title: "",
      content: "",
        // placeholder: "## Welcome to NoteTogther! \n**Lorem ipsum** dolor _sit amet_, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\n>  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\n`Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`\n\nExcepteur sint [occaecat](https://somelink) \n*  cupidatat non proident, \n*  sunt in culpa qui officia deserunt \n*  mollit anim id est laborum.\n\n![Poster](https://drive.google.com/drive/u/2/folders/1l86i2zFTW22skrEASi6uezud8QOXTRjO) <= embed links will be blocked to prevent cross-site scripting, will whitelist stuff on our servers in the future"
      renderedContent: ""
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async uploadNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde);
        let response = await this.$http.post(
          "/note/create",
          { title: this.title, content: this.content},
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
      this.renderedContent = marked(this.content);
    },
  }
};
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>