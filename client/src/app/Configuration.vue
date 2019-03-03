<template>
   <div>
      <router-link to="/">Return</router-link>
      <p>configuration</p>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';

   @Component
   export default class Configuration extends Vue {

      mounted () {
         // this.greet()
      }
   }
</script>

<style scoped lang="scss">
</style>