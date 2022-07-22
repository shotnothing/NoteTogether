<template>
  <div class="container-fluid" style="height:100%">
    <section class="text-center align-items-center flex-column m-auto">
    <h1 style="
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 300;
      font-size: 80px;
      line-height: 150px;
      text-align: center;
      color: #000000;
      padding-top:200px; padding-bottom:0px;
    "><b>Need Study Notes?</b></h1>
  </section>
  <section class="text-center align-items-center flex-column m-auto">
    <h1 style="
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 110px;
      line-height: 80px;
      text-align: center;
      color: #CE9999;
      padding-top:0px; padding-bottom:100px;
    "><b>We gotchu.</b></h1>
  </section>
    <section class="text-center align-items-center flex-column m-auto" style="
      padding-top:80px; padding-bottom:30px;
    ">
      <a class="btn btn-link" v-bind:href="landingButtons[validToken ? 0 : 1].link" style="
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 100px;
        background-color: #CE9999;
        border: none;
        color: black;
        padding: 30px 120px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        cursor: pointer;
        color: #9D3333;
        border-radius: 100px;
      "> <h2><b>{{landingButtons[validToken ? 0 : 1].text}}</b></h2></a>

    </section>

    <section class="text-center align-items-center flex-column m-auto">
      Also, check us out on <a href="https://github.com/shotnothing/NoteTogether">GitHub</a>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: ["user"],
  data() {
    return {
      validToken: true,
      landingButtons: [
        {text: "Discover Notes", link: "/user/discover"},
        {text: "Sign Up Now", link: "/user/register"},
      ]
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
        this.validToken = false;
      }
    }
  },
  created() {
    this.checkValidToken();
  }
};
</script>

<style scoped></style>