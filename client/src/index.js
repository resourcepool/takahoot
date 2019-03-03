import Vue from 'vue';
import VueRouter from "vue-router";
import Home from '@/app/Home';
import Play from '@/app/Play';
import Configuration from '@/app/Configuration';

Vue.use(VueRouter);

const html = document.createElement('div');
html.id = 'app';
document.body.appendChild(html);

const routes = {
  routes: [
    { path: '/configuration', component: Configuration },
    { path: '/', component: Home },
    { path: '/play', component: Play }
  ],
  path: '*', redirect: '/'
};

const router = new VueRouter(routes);

const app = new Vue({
  router,
  template:`<router-view></router-view>`
}).$mount('#app');