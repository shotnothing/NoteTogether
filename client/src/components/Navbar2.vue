<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-primary bg-primary rounded-0 p-0 shadow fixed-top">
      <div class="container-fluid">


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

          <ul class="navbar-nav w-50 mx-auto">

            <a class="navbar-left" href="/"><img style="max-width:150px;" class="m-0" src="../assets/Logo.png" alt="NoteTogether Logo"></a>

            <li class="nav-item col my-auto">
              <a class="nav-link text-dark btn bg-primary w-100" href="/discover">Discover</a>
            </li>
            <li class="nav-item col my-auto">
              <a class="nav-link text-dark btn bg-primary w-100" href="/study">Study</a>
            </li>
            <li class="nav-item col my-auto">
              <a class="nav-link text-dark btn bg-primary w-100" href="/edit">Edit</a>
            </li>
            <li class="nav-item col my-auto">
              <a class="nav-link text-dark btn bg-primary w-100" href="/collate">Collate</a>
            </li>
            <li class="nav-item col my-auto">
              <a class="nav-link text-dark btn bg-primary w-100" v-if="id" @click="logUserOut">Logout</a>
              <a class="nav-link text-dark btn bg-primary w-100" v-else href="/user/login">Login</a>

            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    id: String
  },
  methods: {
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/");
      window.location.reload();
    },
  }
};
</script>

<style scoped></style>