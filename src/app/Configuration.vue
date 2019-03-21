<template>
   <div class="container">

      <div class="steps-content">
         <Connection v-if="step === 0" :devices="devices" :initialized="initialized"></Connection>
         <Pairing v-if="step === 1" :devices="devices"></Pairing>
         <Calibration v-if="step === 2" :devices="devices"></Calibration>
         <Test v-if="step === 3" :devices="devices"></Test>
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
   import Test from './steps/Test';
   import conf from '@/common/conf.json';

   import * as actions from '@/target-service/actions.js';
   import {cloneDeep} from 'lodash';
   import Device from '@/shared/entities/device';

   @Component({
      components: { Connection, Pairing, Calibration}
   })
   export default class Configuration extends Vue {

      devices = [];
      step = 0;
      initialized = false;
      steps = [{
         title: 'Connection',
         content: Connection
      }, {
         title: 'Pairing',
         content: Pairing
      }, {
         title: 'Calibration',
         content: Calibration
      }];

      sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      beforeCreate() {
         this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
      }

      beforeDestroy() {
         this.unsubscribe();
      }

      async storeChanged() {
         const newState = this.$store.getState();
         if (!newState || !newState.lastAction) return;
         this.devices = cloneDeep(this.$store.getState().devices);
         switch (newState.lastAction) {
            case actions.msg.TARGET_INITIALIZED:
               if (this.devices.every(device => device.state === Device.states.INITIALIZED)) {
                  await this.sleep(conf.CONFIGURATION_STEP_DELAY);
                  this.initialized = true;
               }
               break;
            case actions.msg.TARGET_CONNECTED:
               if (this.devices.every(device => device.state === Device.states.CONNECTED)) {
                  await this.sleep(conf.CONFIGURATION_STEP_DELAY);
                  this.step = 1;
               }
               break;
            case actions.msg.TARGET_PAIRED:
               if (this.devices.every(device => device.state === Device.states.PAIRED)) {
                  await this.sleep(conf.CONFIGURATION_STEP_DELAY);
                  this.step = 2;
               }
               break;
            case actions.msg.TARGET_CALIBRATED:
               if (this.devices.every(device => device.state === Device.states.CALIBRATED)) {
                  await this.sleep(conf.CONFIGURATION_STEP_DELAY);
                  this.step = 3;
               }
               break;
            case actions.msg.TARGET_TESTED:
               await this.sleep(conf.CONFIGURATION_STEP_DELAY);
               this.$router.push({path: '/'});
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
