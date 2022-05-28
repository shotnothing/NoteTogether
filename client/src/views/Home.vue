<template>
  <div>
    <NavBar></NavBar>
    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <h2> Welcome back, {{ user.username }}! </h2>
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
    NavBar: () => import('../components/Navbar.vue')
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

<style scoped></style>
