<template>
   <div class="container">
      <a-steps :current="current">
         <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <div class="steps-content">
            <component :is="steps[current].content"></component>
      </div>

      <div class="steps-action">
         <a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button>
         <div class="buttons">
            <a-button v-if="current>0" style="margin-left: 8px" @click="prev">Previous</a-button>
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="$message.success('Processing complete!')">Done</a-button>
         </div>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';
   import Step1 from './steps/Step1';
   import Step2 from './steps/Step2';
   import Step3 from './steps/Step3';

   @Component
   export default class Configuration extends Vue {

      current = 0;
      steps = [{
         title: 'Step 1 title',
         content: Step1,
      }, {
         title: 'Second',
         content: Step2,
      }, {
         title: 'Last',
         content: Step3,
      }];

      next() {
         this.current++
      }

      prev() {
         this.current--
      }
   }
</script>

<style scoped lang="scss">
   .container {
      padding: 14px;
      height: 100vh;
      display:flex;
      flex-direction:column;
   }

   .steps-content {
      flex:1;
      margin-top: 16px;
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      min-height: 200px;
      text-align: center;
      padding-top: 70px;
   }

   .steps-action {
      margin-top: 24px;
      display: flex;
      .buttons {
         flex: 1;
         text-align:center;
      }
   }

</style>