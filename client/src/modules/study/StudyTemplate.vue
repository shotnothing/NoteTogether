<template>
  <div>
    <section class="text-center align-items-center flex-column m-auto" style="padding-top:80px; padding-bottom:0px">
      <h1></h1>
    </section>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "StudyTemplate",
  props: ["user"],
  methods: {
    async checkValidToken() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/user/me",
          {},
          { headers: { 'Authorization': token } }
        );
      } catch (err) {
        this.$router.push("/user/login");
      }
    }
  },
  created() {
    this.checkValidToken();
  }
};
</script>
