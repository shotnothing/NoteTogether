const UserTemplate = () => import("./UserTemplate.vue");
const Login = () => import("./views/Login.vue");
const Register = () => import("./views/Register.vue");
const Profile = () => import("./views/Profile.vue");

const userRoute = {
  path: "user",
  component: UserTemplate,
  children: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "login",
      component: Login,
    },
    {
      path: "register",
      component: Register,
    },
    {
      path: ":userId",
      component: Profile,
      meta: {
        requiresAuth: true,
      }
    }
  ]
};

export default userRoute;