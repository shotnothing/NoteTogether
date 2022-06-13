const CollateTemplate = () => import("./CollateTemplate.vue");
const CollateLanding = () => import("./views/CollateLanding.vue");
const View = () => import("./views/View.vue");

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
    {
      path: ":cheatsheetId",
      component: View,
      meta: {
        requiresAuth: true,
      }
    }
  ]
}

export default collateRoute;