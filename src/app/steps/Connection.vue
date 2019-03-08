<template>
    <div class="step-container">
        <h1>Target detection...</h1>
        <div class="targets">
            <div v-for="device in devices">
                <a-spin v-if="step === 0 || step === 1" size="large"/>
                <p v-if="step === 0">initialization...</p>
                <p v-if="step === 1">connection...</p>
                <a-icon v-if="step === 2" style="font-size: 2.5em;color:#27ae60;" type="check"/>
                <p v-if="step === 2">connected !</p>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import {connectTargets, initTargets} from '@/target-service/service';

  @Component
  export default class Connection extends Vue {

    @Prop(Array) devices;
    @Prop(Number) step;

    created() {
      initTargets().catch(console.error);
    }

    @Watch('step')
    onStepChanged(step, oldStep) {
      if (step - 1 === oldStep) { //step incremented
        switch (step) {
          case 1:
            connectTargets().catch(console.error);
            break;
        }
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