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
          v-model="mde.title"/>
      </div>
      <br>
      <form id="mde-form">
        <vue-simplemde 
          type="text"
          v-model="mde.content"
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
      loaded: false,
      renderedContent: "",
      mde: {
        content: "",
        title: "",
        username: "",
      },
      isPublished: false,
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
        this.mde.content = response.data.content;
        this.mde.title = response.data.title;
        this.mde.username = response.data.username;
        this.isPublished = response.data.isPublished;
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
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    },
    async saveNote() {
      try {
        let token = localStorage.getItem("jwt");
        
        if (this.mde.title === "") {
          swal("Error", "Please enter a title!", "error");
          return;
        }
        if (this.mde.content === "") {
          swal("Error", "Please enter some content!", "error");
          return;
        }

        if (!this.isPublished) {
          let response = await this.$http.post(
            "/note/update",
            { title: this.mde.title, content: this.mde.content, noteId: this.$route.params.noteId },
            { headers: { 'Authorization': token } }
          );
          console.log(response.data);
          swal("Success", "Save Successful", "success");
        } else {
          try {
            let response = await this.$http.post(
              "/note/create",
              { title: this.mde.title, content: this.mde.content, forkOf: this.$route.params.noteId },
              { headers: { 'Authorization': token } }
            );
            this.mde.title = response.data.note.title;
            this.$router.push("/edit/"+response.data.note._id);
            swal("Success", "Save Successful! Created new private note!", "success");
          } catch (err) {
            console.log(err);
            swal("Error", `Uhh, error ${err.request.status}`, "error");
          }
        }

      } catch (err) {
        console.log(err);
      }
    },
    async publishNote() {
      try {
        let token = localStorage.getItem("jwt");
        console.log(this.mde.content);
        if (this.mde.title === "") {
          swal("Error", "Please enter a title!", "error");
          return;
        } else if (this.mde.title === "Untitled Document") {
          swal("Error", "Please change the title to something more meaningful!", "error");
          return;
        }
        if (this.mde.content === "") {
          swal("Error", "Please enter some content!", "error");
          return;
        }
        let response = await this.$http.post(
          "/note/update",
          { title: this.mde.title, content: this.mde.content, noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );

        response = await this.$http.post(
          "/note/publish",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.$router.push("/edit/"+response.data.note._id);
        swal("Success", "Publish Successful", "success");
        console.log(response);
      } catch (err) {
        switch(err.request.status) {
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error ${err.request.status}`, "error");
        }
      }
    },
    renderNote() {
      try {
        console.log(this.mde.content);
        this.renderedContent = marked(this.mde.content);
      } catch (err) {
        this.mde.title = err.request.status;
      }
    },
  },
  mounted() {
    this.getNote();
    this.renderNote();
    this.mde.codemirror.on('change', function() {
      self.$emit('input', self.mde.content())
    })
  },
  created() {
    this.renderNote();
  },
  watch: {
    content(newVal) {
      this.mde.content(newVal);
    }
  }
};
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>
</style>
