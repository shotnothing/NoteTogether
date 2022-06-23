<template>
  <div>
    <h3>Credits:</h3>
    {{ userData }}
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
      let response = await this.$http.get(
        "/user/me",
        { headers: { 'Authorization': token } }
      );
      this.userData = response.data;
    }
  },
  async created() {
    await this.getUserData();
  }
};
</script>