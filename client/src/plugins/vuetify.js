import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	customVariables: ['~/assets/variables.scss'],
    treeShake: true
});
