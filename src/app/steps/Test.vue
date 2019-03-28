<template>
    <div class="step-container">
        <h1>Target test</h1>
        <div class="targets">
            <div v-for="device in devices">
                <pre>{{device.player.lastHit}} - {{device.player.targetPosition}}</pre>
            </div>
        </div>
        <a-button type="primary" class="button" size="large" block v-on:click="resetAll">RESET ALL</a-button>
        <hr>
        <a-button type="primary" class="button" size="large" block v-on:click="finishTest">FINISH TEST</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {cloneDeep} from 'lodash';
    import Device from '@/shared/entities/device';
    import {Component, Prop} from 'vue-property-decorator';
    import * as targetActions from '@/target-service/actions.js'
    import {finishTest} from "@/target-service/service";
    import {gameReset} from '@/target-service/service';

    @Component
    export default class Test extends Vue {

        @Prop(Array) devices;
        states = Device.states;

        finishTest() {
            finishTest();
        }

        resetAll() {
            gameReset();
        }

        beforeCreate() {
            this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
        }

        beforeDestroy() {
            this.unsubscribe();
        }

        async storeChanged() {
            const newState = this.$store.getState();
            if (!newState || !newState.lastAction) return;
            switch (newState.lastAction) {
                case targetActions.msg.TARGET_HIT:
                    const player = newState.devices[newState.lastActionDeviceIndex].player;
                    console.log('Testing calibration - TARGET_HIT', player);
                    setTimeout(gameReset, 500);
                    break;
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
