<template>
    <div class="centered-container">
        <h1>
            <a-button class="back" type="primary" shape="circle"
                      icon="arrow-left" size="large" @click="clean"
                      :disabled="reCalibrating">
            </a-button>
            Quiz end
        </h1>
        <a-spin v-if="reCalibrating" size="large"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import {cloneDeep} from 'lodash';
    import * as targetActions from '@/target-service/actions.js'
    import * as kahootActions from '@/kahoot-service/actions.js'
    import {clean} from '@/kahoot-service/service';
    import {startCalibratingTargets} from '@/target-service/service';
    import Device from '@/shared/entities/device';
    import conf from '@/common/conf.json';

    @Component
    export default class End extends Vue {

        devices = [];
        reCalibrating = false;

        beforeCreate() {
          this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
        }

        beforeDestroy() {
          this.unsubscribe();
        }

        clean() {
            clean();
        }

        created() {
          this.devices = cloneDeep(this.$store.getState().devices);
        }

        sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

        async storeChanged() {
          const newState = this.$store.getState();
          if (!newState || !newState.lastAction) return;
          this.devices = cloneDeep(this.$store.getState().devices);
          switch (newState.lastAction) {
              case kahootActions.msg.KAHOOT_CLEAN_SESSIONS:
                  this.reCalibrating = true;
                  startCalibratingTargets();
                  break;
              case targetActions.msg.TARGET_CALIBRATED:
                  if (this.devices.every(device => device && device.state === Device.states.CALIBRATED)) {
                      this.reCalibrating = false;
                      await this.sleep(conf.CONFIGURATION_STEP_DELAY);
                      this.$router.push({path: '/start'});
                  }
                  break;
          }
        }
  }
</script>

<style scoped lang="scss">
    .centered-container {
        flex-direction: column;

        .targets {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            width: 100%;

            button {
                padding: 15px 15px 6px;
                border-radius: 10px;
                height: initial;
            }

            p {
                margin: 0;
                font-size: 16px;
            }

            .target{
                padding: 15px 15px 6px;
                text-align: center;
            }

            .start-target-input {
                width: 125px;
                margin-top: 15px;
                display: block;
            }
        }
    }
</style>
