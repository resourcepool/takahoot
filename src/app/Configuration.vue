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
   import Done from './steps/Done';

   import {TARGET_INIT_SUCCESS, TARGET_CONNECT_SUCCESS, TARGET_PAIRING_SUCCESS, TARGET_CALIBRATING_SUCCESS} from '@/target-service/actions.json';
   import {cloneDeep} from 'lodash';

   @Component({
      components: { Connection, Pairing, Calibration, Done}
   })
   export default class Configuration extends Vue {

      devices = [];
      step = 0;
      connectionStep = 0;
      SHORT_TIMER = 400;
      LONG_TIMER = 1100;
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
         title: 'Done',
         content: Done
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
               this.goToConnectionStep(1);
               break;
            case TARGET_CONNECT_SUCCESS:
               this.goToConnectionStep(2, () => this.goToStep(1));
               break;
            case TARGET_PAIRING_SUCCESS:
               this.goToStep(2);
               break;
            case TARGET_CALIBRATING_SUCCESS:
               this.goToStep(3);
               break;
         }
      }

      goToConnectionStep(index, cb = () => {}) {
         setTimeout(() => {
            this.connectionStep = index;
            cb();
         }, this.SHORT_TIMER);
      }

      goToStep(index, cb = () => {}) {
         setTimeout(() => {
            this.step = index;
            cb();
         }, this.LONG_TIMER);
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