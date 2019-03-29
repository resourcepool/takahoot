<template>
    <div class="step-container">
        <h1>Target test</h1>
        <div class="targets">
            <div v-for="device in orderedDevices">
                <img v-if="device.player.lastHit === -1" src="@/assets/images/target-to-pairing.png" alt="target"/>
                <img v-if="device.player.lastHit === 0" src="@/assets/images/target-hit-red.png" alt="target red"/>
                <img v-if="device.player.lastHit === 1" src="@/assets/images/target-hit-blue.png" alt="target blue"/>
                <img v-if="device.player.lastHit === 2" src="@/assets/images/target-hit-yellow.png" alt="target yellow"/>
                <img v-if="device.player.lastHit === 3" src="@/assets/images/target-hit-green.png" alt="target green"/>
            </div>
        </div>
        <a-button type="primary" class="button" size="large" block v-on:click="resetAll">RESET ALL</a-button>
        <hr>
        <a-button type="primary" class="button" size="large" block v-on:click="finishTest">FINISH TEST</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Device from '@/shared/entities/device';
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import * as targetActions from '@/target-service/actions.js'
    import {finishTest} from "@/target-service/service";
    import {gameReset} from '@/target-service/service';
    import {orderBy} from 'lodash';

    @Component
    export default class Test extends Vue {

        @Prop(Array) devices;
        orderedDevices = [];
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

        created() {
            this.orderedDevices = orderBy(this.devices, 'player.targetPosition');
        }

        @Watch('devices')
        onDevicesChange(devices) {
            this.orderedDevices = orderBy(devices, 'player.targetPosition');
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
