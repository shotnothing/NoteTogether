const PurchaseTemplate = () => import("./PurchaseTemplate.vue");
const PurchaseLanding = () => import("./views/PurchaseLanding.vue");
const View = () => import("./views/View.vue");

const purchaseRoute = {
	path: "Purchase",
	component: PurchaseTemplate,
	children: [
		{
			path: "/",
			component: PurchaseLanding,
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

export default purchaseRoute;