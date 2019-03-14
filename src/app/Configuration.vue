<template>
   <div class="container">

      <div class="steps-content">
         <Connection v-if="step === 0" :devices="devices" :initialized="initialized"></Connection>
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
   import {gameReset} from '@/target-service/service';

   import * as actions from '@/target-service/actions.js';
   import {cloneDeep} from 'lodash';

   @Component({
      components: { Connection, Pairing, Calibration}
   })
   export default class Configuration extends Vue {

      devices = [];
      step = 0;
      initialized = false;
      SHORT_TIMER = 600;
      LONG_TIMER = 1500;
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
            case actions.msg.TARGET_INIT_SUCCESS:
               await this.sleep(this.SHORT_TIMER);
               this.initialized = true;
               break;
            case actions.msg.TARGET_CONNECT_SUCCESS:
               await this.sleep(this.LONG_TIMER);
               this.step = 1;
               break;
            case actions.msg.TARGET_PAIRING_SUCCESS:
               await this.sleep(this.LONG_TIMER);
               this.step = 2;
               break;
            case actions.msg.TARGET_CALIBRATING_SUCCESS:
               await this.sleep(this.LONG_TIMER);
               gameReset();
               this.$router.push({ path: '/'});
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