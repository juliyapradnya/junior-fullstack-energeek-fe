import Vue from 'vue'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import VImageInput from 'vuetify-image-input';



Vue.use(Vuetify)
Vue.component(VImageInput.name, VImageInput);


const opts = {}

export default new Vuetify(opts)