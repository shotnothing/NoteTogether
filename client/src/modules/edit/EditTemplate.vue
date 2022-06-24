<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "EditTemplate",
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
