<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-primary bg-primary rounded-0 p-0 shadow">
      <div class="container-fluid">
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
          <ul class="navbar-nav w-100 me-auto">
            <li class="nav-item col">
              <a class="nav-link text-dark btn bg-primary w-100" href="/discover">Discover</a>
            </li>
            <li class="nav-item col">
              <a class="nav-link text-dark btn bg-primary w-100" href="/study">Study</a>
            </li>
            <li class="nav-item col">
              <a class="nav-link text-dark btn bg-primary w-100" href="/edit">Edit</a>
            </li>
            <li class="nav-item col">
              <a class="nav-link text-dark btn bg-primary w-100" href="/collate">Collate</a>
            </li>
            <li class="nav-item dropdown col">
              <a
                class="nav-link text-dark dropdown-toggle btn bg-primary"
                href="/"
                id="accountDropdown"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>
              <ul class="dropdown-menu dropdown-menu-right bg-primary pl-0 shadow-none" v-if="id" aria-labelledby="accountDropdown">
                <li>
                  <a class="dropdown-item" v-bind:href="'/user/'+id+'/profile'">Profile</a>
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