<template>
  <div>
    <h4 class="font-weight-bold">Credits: <span class="text-secondary">{{ userData.credits }}</span></h4>
  </div>
</template>

<script>
export default {
  name: "CreditBalance",
  props: ["user"],
  data() {
    return {
      userData: {},
    }
  },
  methods: {
    async getUserData() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/user/me",
        {},
        { headers: { 'Authorization': token } }
      );
      this.userData = response.data.userData;
    }
  },
  async created() {
    await this.getUserData();
  }
};
</script>