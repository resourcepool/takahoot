<template>
   <div class="step-container">
      <h1>Target detection...</h1>
      <div class="targets">
         <div v-for="device in devices">
            <a-spin size="large"/>
            <p>{{ deviceState.MSG[device.state] }}</p>
         </div>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';
   import Store from "@/target-business/store";
   import Actions from "@/target-business/actions";
   import {init, getDevices, connectToDevice} from "@/target-business/target/target-service";
   import uuid from 'uuid/v4';

   class Device {
      id;
      data;
      state;
      constructor(data, state) {
         this.id = uuid();
         this.data = data;
         this.state = state;
      }
   }

   @Component
   export default class Step1 extends Vue {

      devices = [];

      deviceState = {
         TO_IDENFITY: 'TO_IDENFITY',
         IDENTIFIED: 'IDENTIFIED',
         MSG: {
            TO_IDENFITY: 'To identify...',
            IDENTIFIED: 'Identified !'
         }
      };

      mounted() {
         const store = Store.createAppStore();
         init({}, store).then(() => {

            this.devices = getDevices().map(data => new Device(data, this.deviceState.TO_IDENFITY));

            for (let i in this.devices) {
               let d = this.devices[i].data;
               store.subscribe(a => {
                  console.log(a);
               });
               store.dispatch(Actions.connectToDevice(d, i));
            }
         })

      }
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