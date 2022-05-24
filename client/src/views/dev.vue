<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="home">NoteTogether</a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-nav" href="dev">Developer Page</a>

        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" @click="logUserOut"> Logout</a>
            </li>
          </ul>
        </div>

      </div>
    </nav>

    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">Username : {{ user.username }}</li>
              <li class="list-group-item">Email : {{ user.email }}</li>
            </ul>

            <br><h3> Debug Tool: Document Upload </h3>
            <vue-simplemde v-model="content" ref="documentUploadMDE" />

          </div>
        </div>
      </div>
    </section>
  </div>
</template>



<script>
import VueSimplemde from 'vue-simplemde'
import VueJwtDecode from "vue-jwt-decode";

export default {
  data() {
    return {
      user: {}
    };
  },
  components: {
    VueSimplemde
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/");
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
