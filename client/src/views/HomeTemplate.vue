<template>
  <div class="bg-primary text-dark h-100">
    <Navbar :id="user._id" :username="user.username"></Navbar>
    <router-view v-if="user._id" :user="user" style="padding-top:80px"></router-view>
    <section v-else class="text-center align-items-center flex-column m-auto" style="padding-top:80px">
      <img src="../assets/Logo.png" class="w-25 mt-10">
      <h4 class="lead w-50 m-auto text-center">
        <a href="/user/login">It seems like your authentication has failed or expired. <br>Please log in to continue using this site!</a>
      </h4>
      <br>
      <h1>Resources</h1>
      <h4 class="lead w-50 m-auto text-center">
        <a href="https://github.com/shotnothing/NoteTogether">GitHub</a>
      </h4>
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
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