import Vue from 'vue';
import 'jquery';
import App from './Pi'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app');
