import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from 'axios'
//import "vuetify/dist/vuetify.min.css";
import VueMoment from "vue-moment";
import moment from "moment-timezone";


Vue.config.productionTip = false

moment.tz.guess();
Vue.use(VueMoment, { moment });

Vue.prototype.$http = axios;
//Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$api = 'https//juniorfullstackenergeek.juliyapradnya.my.id/api';


new Vue({
  vuetify,
  router,
 
  render: h => h(App),
}).$mount('#app')
