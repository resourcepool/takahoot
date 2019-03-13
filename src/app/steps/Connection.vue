<template>
    <div class="step-container">
        <h1>Target detection...</h1>
        <div class="targets">
            <div v-for="device in devices">
                <a-spin v-if="device.state !== states.CONNECTED" size="large"/>
                <p v-if="device.state !== states.CONNECTED">connection...</p>
                <a-icon v-if="device.state === states.CONNECTED" style="font-size: 2.5em;color:#27ae60;" type="check"/>
                <p v-if="device.state === states.CONNECTED">connected !</p>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Device from '@/common/entities/device';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import {connectTargets, initTargets} from '@/target-service/service';

  @Component
  export default class Connection extends Vue {

    @Prop(Array) devices;
    @Prop(Boolean) initialized;
    states = Device.states;

    created() {
      initTargets();
    }

    @Watch('initialized')
    onInitializedChanged(initialized, old) {
      if (initialized && !old) {
        connectTargets();
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
        }
    }
</style>