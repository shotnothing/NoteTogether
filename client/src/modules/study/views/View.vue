<template>
  <div class="container">
    <h3 class="ml-2">{{ title }} by {{ username }}</h3>
    <div v-html="content" class="p-2 bg-white border border-secondary"></div>
  </div>
</template>

<script>
import RedditPreview from "@/components/RedditPreview.vue";
import { marked } from 'marked';

export default {
  name: "StudyView",
  props: ["user", "note"],
  components: {
    RedditPreview,
  },
  data() {
    return {
      user: {},
      content: "",
      title: "",
      username: "",
    };
  },
  methods: {
    async viewNote(){
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        this.content = marked(response.data.content);
        this.title = response.data.title;
        this.username = response.data.username;
      } catch (err) {
        // this.content = err;
      }
    }
  },
  async created() {
    await this.viewNote();
  }
};
</script>

<style scoped></style>