const CollateTemplate = () => import("./CollateTemplate.vue");
const CollateLanding = () => import("./views/CollateLanding.vue");

const collateRoute = {
  path: "collate",
  component: CollateTemplate,
  children: [
    {
      path: "/",
      component: CollateLanding,
      meta: {
        requiresAuth: true,
      }
    },
  ]
}

export default collateRoute;