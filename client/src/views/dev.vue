<template>
  <div>
    <NavBar></NavBar>
    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">Username : {{ user.username }}</li>
              <li class="list-group-item">Email : {{ user.email }}</li>
            </ul>

            <br><h3> Debug Tool: Document Editor and Upload </h3>
            <br>
            <MarkdownEditor></MarkdownEditor>

            <br><h3> Debug Tool: Document List View </h3>
            <br>
            <NotesList></NotesList>
            
          </div>
        </div>
      </div>
    </section>

  </div>
</template>




<script>
import VueJwtDecode from "vue-jwt-decode";

export default {
  data() {
    return {
      user: {}
    };
  },
  components: {
    MarkdownEditor: () => import('../components/MarkdownEditor.vue'),
    NavBar: () => import('../components/Navbar.vue'),
    NotesList: () => import('../components/NotesList.vue'),
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
    }
  },
  created() {
    this.getUserDetails();
  }
};
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>
