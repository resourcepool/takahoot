<template>
   <div class="step-container">
      <h1>Target detection...</h1>
      <div class="targets">
         <div><a-spin size="large"/></div>
         <div><a-spin size="large"/></div>
         <div><a-spin size="large"/></div>
         <div><a-spin size="large"/></div>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';

   @Component
   export default class Step1 extends Vue {
   }
</script>

<style scoped lang="scss">
   .step-container {
      display:flex;
      flex-direction: column;
      height: 100%;

      .targets {
         flex: 1;
         display:flex;
         flex-direction: row;
         align-items: center;
         > * {
            flex: .25;
         }
      }
   }
</style>