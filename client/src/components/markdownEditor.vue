<template>
  <div>
    <vue-simplemde v-model="content" ref="noteUploadMDE"/>
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
        title: "test title",
        content: "test content \n test content 2"
      }
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async uploadNote() {
      let token = localStorage.getItem("jwt");
      var authHeader = { header: token };
      let response = await this.$http.post(
        "/note/create",
        this.mde,
        { headers: {'Authorization': token} }
        );
      console.log(response);
    },
  }
};
</script>
