import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/app/Home';
import Play from '@/app/Play';
import Configuration from '@/app/Configuration';
import {createAppStore} from "@/common/store";
import '@/assets/style';
import 'ant-design-vue/dist/antd.css';
import { Button, Input, Steps, List, Spin, Tooltip } from 'ant-design-vue';

Vue.use(VueRouter);
Vue.use(Button);
Vue.use(Input);
Vue.use(Steps);
Vue.use(List);
Vue.use(Spin);
Vue.use(Tooltip);

const routes = {
  routes: [
    {path: '/', component: Home},
    {path: '/configuration', component: Configuration},
    {path: '/play', component: Play}
  ],
  path: '*', redirect: '/'
};

const router = new VueRouter(routes);

Vue.prototype.$store = createAppStore();

new Vue({router}).$mount('#app');