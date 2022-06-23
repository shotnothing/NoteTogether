<template>
  <div class="bg-primary text-dark h-100">
    <Navbar :id="user._id" :username="user.username"></Navbar>
    <section class="text-center align-items-center flex-column m-auto" style="padding-top:60px">
      <a href="/"><img src="../assets/Logo.png" class="w-25 mt-10"></a>
    </section>
    <router-view :user="user"></router-view>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
// import Login from "@/components/Login.vue";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "HomeTemplate",
  data() {
    return {
      user: {},
    };
  },
  components: {
    Navbar,
    // Login,
  },
  methods: {
    async getUserDetails() {
      let token = localStorage.getItem("jwt");
      this.user = VueJwtDecode.decode(token);
    }
  },
  async created() {
    await this.getUserDetails();
    if (!this.user._id) {
      this.$router.push("/user/login");
    }
  },
};
</script>