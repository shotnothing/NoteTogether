const EditTemplate = () => import("./EditTemplate.vue");
const EditLanding = () => import("./views/EditLanding.vue");
const View = () => import("./views/View.vue");
const Create = () => import("./views/Create.vue");

const editRoute = {
	path: "edit",
	component: EditTemplate,
	children: [
		{
			path: "/",
			component: EditLanding,
			meta: {
				requiresAuth: true,
			}
		},
		{
			path: "create",
			component: Create,
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
		},
	]
}

export default editRoute;