<template>
    <div class="step-container">
        <h1>Target pairing</h1>
        <div class="targets">
            <div v-for="device in devices">
                <div class="target-to-pairing" v-if="device.state !== states.PAIRED">
                    <a-button type="dashed" size="large" block @click="pair(device.index)">
                        <img src="@/assets/images/target-to-pairing.png" alt="target"/>
                        <p>blinking ?</p>
                    </a-button>
                </div>
                <div class="target-paired" v-if="device.state === states.PAIRED">
                    <img src="@/assets/images/target.png" alt="target"/>
                    <p>paired !</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Device from '@/shared/entities/device';
  import {Component, Prop} from 'vue-property-decorator';
  import {startPairingTarget, stopPairingTarget} from '@/target-service/service';

  @Component
  export default class Pairing extends Vue {

    @Prop(Array) devices;
    states = Device.states;
    currentIndex = 0;

    created() {
      startPairingTarget(this.devices[this.currentIndex]);
    }

    pair(position) {
      stopPairingTarget(this.devices[this.currentIndex], position);
      if (this.currentIndex < this.devices.length - 1) {
        startPairingTarget(this.devices[++this.currentIndex]);
      }
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
            display: grid;
            grid-template-columns: auto auto;
            grid-gap: 20px 20px;
            align-items: center;
            justify-content: space-evenly;

            button {
                padding: 15px 15px 6px;
                border-radius: 10px;
                height: initial;
            }

            p {
                margin: 0;
                font-size: 16px;
            }

            .target-paired {
                padding: 15px 15px 6px;
            }
        }
    }
</style>
