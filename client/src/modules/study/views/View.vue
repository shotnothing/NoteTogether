<template>
  <div class="container">
    <h3>Study View</h3>
    
    <div class="d-flex">
      <div class="flex-fill">
        <div>
          <SearchResultList :user="user" v-for="note in notes" :note="note" :key="note.votes"></SearchResultList>
        </div>
        <div v-html="content" class="m-2 p-2 bg-white border border-secondary"></div>
      </div>
      <div class="m-2 mw-25">
        <div><span class="font-weight-bold">Title:</span> <span class="text-light">{{ title }}</span></div>
        <div><span class="font-weight-bold">Contributors:</span> <span class="text-light">{{ username }}</span></div>
        <div><span class="font-weight-bold">Privacy:</span> <span class="text-light">{{ privacy }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResultList from "@/components/SearchResultList.vue";
import { marked } from 'marked';
import swal from "sweetalert";

export default {
  name: "StudyView",
  props: ["user", "note"],
  components: {
    SearchResultList,
  },
  data() {
    return {
      user: {},
      content: "",
      title: "",
      username: "",
      privacy: "",
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
        this.privacy = response.data.isPublished ? "Public" : "Private";
        this.notes = [{
          title: response.data.title,
          userId: {
            username: response.data.username,
          },
          dateLastUpdated: response.data.dateLastUpdated,
          votes: response.data.votes,
          _id: this.$route.params.noteId
        }];
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