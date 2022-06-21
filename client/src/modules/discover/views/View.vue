<template>
  <div class="container">
    <div class="">
      {{content}}
    </div>
  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde';
import { marked } from 'marked';

export default {
  name: "DiscoverView",
  props: ["user"],
  components: {
  },
  data() {
    return {
      user: {},
      content: "",
    };
  },
  methods: {
    async viewNote(){
      console.log(this.selected);
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
          );
        this.content = response.data.content.join();
        // this.content = marked(response.data.content.join("\n"));
      } catch (err) {
        // this.content = err;
      }
    }
  },
  created() {
    this.viewNote();
  }
};
</script>

<style scoped></style>