<template>
  <div>

    <vue-simplemde 
      v-model="mde.content" 
      ref="noteUploadMDE"
    />
    <v-text-field
      label="Document Title"
      :rules="rules"
      hide-details="auto"
      v-model="mde.title" 
    ></v-text-field>
    <br>
    <v-btn
      @click.native="uploadNote()"
    >
      Upload
    </v-btn>

  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde'
export default {
  data() {
    return {
      mde: {
        title: "Untitled Document",
        content: "## Welcome to NoteTogther! \n**Lorem ipsum** dolor _sit amet_, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\n>  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\n`Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`\n\nExcepteur sint [occaecat](https://somelink) \n*  cupidatat non proident, \n*  sunt in culpa qui officia deserunt \n*  mollit anim id est laborum.\n\n![Poster](https://drive.google.com/drive/u/2/folders/1l86i2zFTW22skrEASi6uezud8QOXTRjO)"
      }
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async uploadNote() {
      let token = localStorage.getItem("jwt");
      console.log(this.mde);
      let response = await this.$http.post(
        "/note/create",
        this.mde,
        { headers: { 'Authorization': token } }
        );
      console.log(response);
    },
  }
};
</script>
