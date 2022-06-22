<template>
  <div class="bg-primary text-dark h-100">
    <Navbar :id="user._id"></Navbar>
    <router-view :user="user" style="padding-top:80px"></router-view>
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
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      this.user = VueJwtDecode.decode(token);
    }
  },
  created() {
    this.getUserDetails();
  },
};
</script>