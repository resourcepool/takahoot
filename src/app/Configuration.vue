<template>
   <div class="container">

      <div class="steps-content">
         <Connection v-if="step === 0" :devices="devices" :step="connectionStep"></Connection>
         <Pairing v-if="step === 1" :devices="devices"></Pairing>
         <Calibration v-if="step === 2" :devices="devices"></Calibration>
         <Finish v-if="step === 3"></Finish>
      </div>

      <div class="steps-action">
         <a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button>
         <a-steps :current="step" class="steps">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
         </a-steps>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import {Component} from 'vue-property-decorator';
   import Connection from './steps/Connection';
   import Pairing from './steps/Pairing';
   import Calibration from './steps/Calibration';
   import Finish from './steps/Finish';

   import {TARGET_INIT_SUCCESS, TARGET_CONNECT_SUCCESS} from '@/target-service/actions.json';
   import {cloneDeep} from 'lodash';

   @Component({
      components: { Connection, Pairing, Calibration}
   })
   export default class Configuration extends Vue {

      devices = [];
      step = 0;
      connectionStep = 0;
      steps = [{
         title: 'Connection',
         content: Connection
      }, {
         title: 'Pairing',
         content: Pairing
      }, {
         title: 'Calibration',
         content: Calibration
      },  {
         title: 'Finish',
         content: Finish
      }];

      beforeCreate() {
         this.$store.subscribe(() => this.storeChanged())
      }

      storeChanged() {
         const newState = this.$store.getState();
         if (!newState || !newState.lastAction) return;
         this.devices = cloneDeep(this.$store.getState().devices);
         switch (newState.lastAction) {
            case TARGET_INIT_SUCCESS:
               setTimeout(() => {
                  this.connectionStep = 1;
               }, 750);
               break;
            case TARGET_CONNECT_SUCCESS:
               setTimeout(() => {
                  this.connectionStep = 2;
                  setTimeout(() => {
                     this.step = 1;
                  }, 1250);
               }, 750);
               break;
         }
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
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      min-height: 200px;
      text-align: center;
      padding-top: 70px;
   }

   .steps-action {
      margin-top: 15px;
      display: flex;
      align-items: center;
      button {
         flex: none;
      }
      .steps {
         margin: 0 50px;
      }
   }

</style>