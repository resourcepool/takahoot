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
  import Device from '@/common/entities/device';
  import {Component, Prop} from 'vue-property-decorator';
  import {startPairingTarget, stopPairingTarget} from '@/target-service/service';
  import {pairingSuccess} from "@/target-service/actions";

  @Component
  export default class Pairing extends Vue {

    @Prop(Array) devices;
    states = Device.states;
    currentPairingIndex = 0;

    created() {
      startPairingTarget(this.devices[this.currentPairingIndex]);
    }

    pair(index) {
      stopPairingTarget(this.devices[this.currentPairingIndex], index);
      if (this.currentPairingIndex < this.devices.length - 1) {
        startPairingTarget(this.devices[++this.currentPairingIndex]);
      } else {
        this.$store.dispatch(pairingSuccess());
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
            display: flex;
            flex-direction: row;
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