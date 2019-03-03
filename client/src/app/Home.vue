<template>
   <div>
      <h2>Takahoot</h2>
      <router-link to="/play">Start the game</router-link><br/>
      <router-link to="/configuration">Configuration</router-link>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';

   @Component({
      props: {
         propMessage: String
      }
   })
   export default class Home extends Vue {
      mounted () {
      }
   }
</script>

<style scoped lang="scss">
    p {
        color: red;
    }
</style>