<template>
    <div class="step-container">
        <h1>Start game</h1>
        <a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button>
        <div>
            <h2>Game-pin</h2>
            <a-input v-model="gamePin" placeholder="Set the game pin"/>
        </div>
        <div class="targets">
            <div v-for="device in devices">
                <div class="target-paired">
                    <img src="@/assets/images/target.png" alt="target"/>
                    <a-input v-model="device.player.name" placeholder="Player name" />
                </div>
            </div>
        </div>
        <a-button type="primary" class="button" size="large" block v-on:click="init">START</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import {init} from '@/kahoot-service/service';
    import * as actions from '@/kahoot-service/actions';

    @Component
    export default class Pairing extends Vue {

        @Prop(Array) devices;
        gamePin = '';

        beforeCreate() {
            this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
        }

        beforeDestroy() {
            this.unsubscribe();
        }

        async storeChanged() {
            const newState = this.$store.getState().kahootReducer;
            if (!newState || !newState.lastAction) return;
            this.devices = cloneDeep(this.$store.getState().devices);
            switch (newState.lastAction) {
                case actions.msg.KAHOOT_INIT:
                    this.$router.push('/play');
                    break;
            }
        }

        init() {
            init(this.gamePin, this.devices);
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
