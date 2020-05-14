import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";


import App from "./App";
import store from "./store";
import router from "./router";


Vue.config.productionTip = true;

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
