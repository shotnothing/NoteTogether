<template>
  <div>
    <section class="text-center align-items-center flex-column m-auto" style="padding-top:120px; padding-bottom:30px">
      <h1>Discover Notes</h1>
    </section>

    <router-view :user="user"/>
  </div>
</template>

<script>
export default {
  name: "PurchaseTemplate",
  props: ["user"],
  data() {
    return {
      user: {},
    }
  },
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
