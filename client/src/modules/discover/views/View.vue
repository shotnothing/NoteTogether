<template>
  <div class="container">
    <div>
      <RedditPreview :user="user" v-for="note in notes" :note="note" :key="note.votes"></RedditPreview>
    </div>
    <div v-html="content" class="p-2"></div>
  </div>
</template>

<script>
import RedditPreview from "@/components/RedditPreview.vue";
import VueSimplemde from 'vue-simplemde';
import { marked } from 'marked';

export default {
  name: "DiscoverView",
  props: ["user", "note"],
  components: {
    RedditPreview,
  },
  data() {
    return {
      user: {},
      content: "",
      notes: [],
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
        this.content = marked(response.data.content.join("<br>"));
        // this.content = response;
        this.notes = [{
          title: response.data.title,
          userId: {
            username: response.data.noteCreator,
          },
          dateLastUpdated: response.data.dateLastUpdated,
          votes: response.data.votes,
        }];
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