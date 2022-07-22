<template>
  <div class="Register">
      <section class="text-center align-items-center flex-column m-auto" style="padding-top:120px; padding-bottom:30px">
      <h1>Register</h1>
    </section>
    <RegisterComponent/>
  </div>
</template>
<script>
import RegisterComponent from "@/components/Register";
export default {
  name: "Register",
  components: {
    RegisterComponent
  }
};
</script>