<template>
  <div>
    <nav class="navbar navbar-expand-md sticky-top navbar-primary bg-primary rounded-0 p-0 shadow">
      <div class="container-fluid align-items-center align-items-stretch">
        <a class="navbar-left" href="/"><img style="max-width:150px;" class="m-0" src="../assets/Logo.png" alt="NoteTogether Logo"></a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav d-flex ml-20 mr-20 w-100 h-100 justify-content-around align-items-center">
            <li class="nav-item">
              <a class="nav-link text-dark" href="/discover">Discover</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="/study">Study</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="/edit">Edit</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="/collate">Collate</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-dark"
                href="/"
                id="accountDropdown"
                role="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>
              <ul class="dropdown-menu bg-primary pl-0 shadow-none" v-if="user._id" aria-labelledby="accountDropdown">
                <li>
                  <a class="dropdown-item" v-bind:href="'/user/'+user._id+'/profile'">Profile</a>
                </li>
                <li>
                  <a class="dropdown-item" @click="logUserOut">Logout</a>
                </li>
              </ul>
              <ul class="dropdown-menu bg-primary pl-0 shadow-none" v-else aria-labelledby="accountDropdown">
                <li>
                  <a class="dropdown-item" href="/user/login">Log In</a>
                </li>
                <li>
                  <a class="dropdown-item" href="/user/register">Register</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/");
      window.location.reload();
    },
  },

  created() {
    this.getUserDetails();
  }
};
</script>