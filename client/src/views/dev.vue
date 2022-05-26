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

            <br><h3> Debug Tool: Document Upload </h3>
            <MarkdownEditor></MarkdownEditor>

            
            
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
    MarkdownEditor: () => import('../components/markdownEditor.vue'),
    NavBar: () => import('../components/navbar.vue'),
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
