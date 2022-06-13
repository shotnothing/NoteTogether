const StudyTemplate = () => import("./StudyTemplate.vue");
const StudyLanding = () => import("./views/StudyLanding.vue");
const View = () => import("./views/View.vue");

const studyRoute = {
  path: "study",
  component: StudyTemplate,
  children: [
    {
      path: "/",
      component: StudyLanding,
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

export default studyRoute;