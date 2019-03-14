<template>
    <div class="step-container">
        <h1>Target calibration</h1>
        <div class="targets">
            <div v-for="device in devices">
                <div v-if="device.state !== states.CALIBRATED">
                    <a-spin size="large"/>
                    <p>calibration...</p>
                </div>
                <div v-if="device.state === states.CALIBRATED">
                    <a-icon style="font-size: 2.5em;color:#27ae60;" type="check"/>
                    <p>calibrated !</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Device from '@/common/entities/device';
  import {Component, Prop} from 'vue-property-decorator';
  import {startCalibratingTargets} from '@/target-service/service';

  @Component
  export default class Calibration extends Vue {

    @Prop(Array) devices;
    states = Device.states;

    created() {
      startCalibratingTargets();
    }
  }
</script>

<style scoped lang="scss">
    .step-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .targets {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
        }
    }
</style>