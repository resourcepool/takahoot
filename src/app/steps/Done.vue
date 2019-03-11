<template>
    <div class="step-container">
        <h1>Configuration finished!</h1>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import {initTargets} from '@/target-service/service';

  @Component
  export default class Done extends Vue {

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