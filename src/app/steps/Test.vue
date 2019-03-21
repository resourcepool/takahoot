<template>
    <div class="step-container">
        <h1>Target test</h1>
        <div class="targets">
            <div v-for="device in devices">
                <pre>{{device.player.lastHit}} - {{device.player.targetPosition}}</pre>
            </div>
        </div>
        <a-button type="primary" class="button" size="large" block v-on:click="finishTest">FINISH TEST</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Device from '@/shared/entities/device';
    import {Component, Prop} from 'vue-property-decorator';
    import {finishTest} from "@/target-service/service";

    @Component
    export default class Test extends Vue {

        @Prop(Array) devices;
        states = Device.states;

        finishTest() {
            finishTest();
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
