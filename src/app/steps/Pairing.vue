<template>
    <div class="step-container">
        <h1>Target pairing</h1>
        <div class="targets">
            <div v-for="device in devices">
                <a-spin size="large"/>
                <p>blinking ?</p>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import {initTargets} from '@/target-service/service';

  @Component
  export default class Pairing extends Vue {

    @Prop(Array) devices;

    created() {
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