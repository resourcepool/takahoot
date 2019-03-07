<template>
   <div class="step-container">
      <h1>Target detection...</h1>
      <div class="targets">
         <div v-for="device in devices">
            <a-spin size="large"/>
            <p>{{ deviceStateMsgs[device.state] }}</p>
         </div>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';
   import {openSerialConnection} from '@/target-service/actions';

   @Component
   export default class Step1 extends Vue {

      devices = [];

      deviceStateMsgs = {
         TO_IDENFITY: 'To identify...',
         IDENTIFIED: 'Identified !'
      };

      created() {
         this.$store.subscribe(() => {
            this.devices = this.$store.getState().devices;
         })
      }

      mounted() {
         this.$store.dispatch(openSerialConnection());

         // init({}, store).then(() => {
         //
         //    for (let i in this.devices) {
         //       let d = this.devices[i].data;
         //       store.subscribe(a => {
         //          console.log(a);
         //       });
         //       store.dispatch(Actions.connectToDevice(d, i));
         //    }
         // })

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