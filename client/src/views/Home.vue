<template>
  <div>
    <section>
      <center class="container" v-if="user._id">
        <h2>Welcome back, {{ user.username }}!</h2>
      </center>
      <center v-else>
        <h2>Please log in before accessing the contents of this site!</h2>
      </center>
    </section>
    <!-- <router-link v-for="route in $router.options.routes" :key="route.path" :to="route.path">{{ route }}</router-link> -->
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
export default {
  data() {
    return {
      user: {},
      items: []
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