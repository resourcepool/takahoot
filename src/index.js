import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/app/Home';
import Start from '@/app/Start';
import Play from '@/app/Play';
import End from '@/app/End';
import Configuration from '@/app/Configuration';
import {store} from "@/shared/store";
import '@/assets/style';
import 'ant-design-vue/dist/antd.css';
import { Button, Input, Steps, List, Spin, Tooltip, Icon } from 'ant-design-vue';

Vue.use(VueRouter);
Vue.use(Button);
Vue.use(Input);
Vue.use(Steps);
Vue.use(List);
Vue.use(Spin);
Vue.use(Icon);
Vue.use(Tooltip);

const routes = {
  routes: [
    {path: '/', component: Home},
    {path: '/configuration', component: Configuration},
    {path: '/start', component: Start},
    {path: '/play', component: Play},
    {path: '/end', component: End}
  ],
  path: '*', redirect: '/'
};

const router = new VueRouter(routes);

Vue.prototype.$store = store;

new Vue({router}).$mount('#app');
