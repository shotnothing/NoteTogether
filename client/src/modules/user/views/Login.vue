<template>
  <div class="Login">
      <section class="text-center align-items-center flex-column m-auto" style="padding-top:120px; padding-bottom:30px">
      <h1>Login</h1>
    </section>
    <LoginComponent/>
  </div>
</template>
<script>
import LoginComponent from "@/components/Login";
export default {
  name: "Login",
  components: {
    LoginComponent
  }
};
</script>
