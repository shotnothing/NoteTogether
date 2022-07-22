import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./styles/_custom.scss";
import vuetify from './plugins/vuetify'

const base = axios.create({
  //baseURL: "https://notetogether-server.herokuapp.com"
  baseURL: "http://localhost:4000"
});

Vue.prototype.$http = base;
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
