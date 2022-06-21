<template>
  <div class="container-fluid" style="height:100%">
    <section class="text-center align-items-center" style="height:100%">
      <img src="../assets/Logo.png">
      <div v-if="user._id">
        <h1>Welcome back, {{ user.username }}!</h1>
      </div>
      <div v-else>
        <h1>Please log in before accessing the contents of this site!</h1>
        <br>
        <a
          class="btn w-25 m-5 p-3 btn-secondary text-dark d-inline-block"
          style="border-radius:20px"
          href="/user/login">
          <h2>Log In</h2>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {
    user: Object
  },
};
</script>

<style scoped></style>