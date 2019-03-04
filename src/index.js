import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/app/Home';
import Play from '@/app/Play';
import Configuration from '@/app/Configuration';
import '@/assets/style';
import 'ant-design-vue/dist/antd.css';
import { Button, Input, Steps, List, Spin } from 'ant-design-vue';
import {init} from "@/target-business/index";

Vue.use(VueRouter);
Vue.use(Button);
Vue.use(Input);
Vue.use(Steps);
Vue.use(List);
Vue.use(Spin);

const routes = {
  routes: [
    {path: '/', component: Home},
    {path: '/configuration', component: Configuration},
    {path: '/play', component: Play}
  ],
  path: '*', redirect: '/'
};

const router = new VueRouter(routes);

new Vue({router}).$mount('#app');

init(process.env).then((a) => {
  console.log(a)
});