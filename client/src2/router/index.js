import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/dev",
    name: "Dev",
    component: () => import("../views/Dev.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/discover",
    name: "Discover",
    component: () => import("../views/discover/Landing.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/discover/read",
    name: "Discover Read",
    component: () => import("../views/discover/Read.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/study",
    name: "Study",
    component: () => import("../views/study/Landing.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/study/read",
    name: "Study Read",
    component: () => import("../views/study/Read.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/edit",
    name: "Edit",
    component: () => import("../views/edit/Landing.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/edit",
    name: "Edit",
    component: () => import("../views/edit/Landing.vue"),
    meta: {
      requiresAuth: true,
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
