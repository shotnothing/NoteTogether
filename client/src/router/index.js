import Vue from "vue";
import VueRouter from "vue-router";

import collateRoute from "../modules/collate";
import discoverRoute from "../modules/discover";
import editRoute from "../modules/edit";
import studyRoute from "../modules/study";
import userRoute from "../modules/user";
import purchaseRoute from "../modules/purchase";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "HomeTemplate",
    component: () => import("../views/HomeTemplate.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue")
      },
      userRoute,
      discoverRoute,
      studyRoute,
      editRoute,
      collateRoute,
      purchaseRoute,
    ]
  },
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
