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