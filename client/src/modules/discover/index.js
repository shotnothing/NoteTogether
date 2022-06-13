const DiscoverTemplate = () => import("./DiscoverTemplate.vue");
const DiscoverLanding = () => import("./views/DiscoverLanding.vue");
const View = () => import("./views/View.vue");

const discoverRoute = {
  path: "discover",
  component: DiscoverTemplate,
  children: [
    {
      path: "/",
      component: DiscoverLanding,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: ":noteId",
      component: View,
      meta: {
        requiresAuth: true,
      }
    }
  ]
}

export default discoverRoute;