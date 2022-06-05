import {createApp} from 'vue'
import { createStore } from 'vuex'
import store from "./store/index";
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from "./axios";
import VueAxios from 'vue-axios'
// import mock from './mock'
import mixin from './globalFun'
import * as echarts from 'echarts'

const app = createApp(App)// .use(router).use(ElementPlus).use(VueAxios, axios).mount('#app')
app.config.globalProperties.$echarts = echarts;
app.use(VueAxios,axios);
app.use(ElementPlus);
app.use(store)
app.use(router);
app.mixin(mixin);
app.config.productionTip = false;
app.mount('#app')
