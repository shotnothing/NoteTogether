<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center border border-secondary p-5"
          style="height:auto;padding-top:100px !important;"
          @submit.prevent="registerUser"
        >
          <input
            type="text"
            id="username"
            class="form-control mb-5"
            placeholder="Username"
            v-model="register.username"
            required
            minlength=3
            maxlength=16
          />
          <input
            type="email"
            id="email"
            class="form-control mb-5"
            placeholder="Email"
            v-model="register.email"
            required
            maxlength=254
          />

          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="register.password"
            minlength=6
            maxlength=20
          />

          <input
            type="password"
            id="confirmPassword"
            class="form-control mb-5"
            placeholder="Confirm Password"
            minlength=6
            maxlength=20
          />

          <p>
            Already have an account?
            <router-link to="/user/login">Login</router-link>

            <!-- Sign in button -->
            <center>
              <button class="btn btn-secondary btn-block w-75 my-4" type="submit">
                Sign Up
              </button>
            </center>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  name: "RegisterComponent",
  data() {
    return {
      register: {
        username: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async registerUser() {
      try {
        if (document.getElementById("password").value !== 
          document.getElementById("confirmPassword").value) {
          swal("Error", "Password fields do not match", "error");
        } else {
          let response = await this.$http.post("/user/register", this.register);
          let token = response.data.token;
          if (token) {
            localStorage.setItem("jwt", token);
            this.$router.push("/");
            swal("Success", "Registration Was successful", "success");
          } else {
            swal("Error", "Oops, Something Went Wrong", "error");
          }
        }
      } catch (err) {
        let error = err.response;
        if (error.status == 409) {
          swal("Error", error.data.message, "error");
        } else {
          swal("Error", error.data.err.message, "error");
        }
      }
    }
  }
};
</script>
