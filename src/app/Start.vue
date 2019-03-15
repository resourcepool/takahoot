<template>
    <div class="centered-container">
        <h1><a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button> Start game</h1>
        <div class="targets">
            <div v-for="device in devices">
                <div class="target">
                    <img src="@/assets/images/target.png" alt="target"/>
                    <a-input v-model="device.player.name" placeholder="Player name" class="start-target-input" />
                </div>
            </div>
        </div>
        <a-input v-model="gamePin" placeholder="Set the game pin"/>
        <a-button type="primary" class="button" size="large" block v-on:click="init">START</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import {init} from '@/kahoot-service/service';
    import * as actions from '@/kahoot-service/actions';
    import {cloneDeep} from 'lodash';

    @Component
    export default class Pairing extends Vue {

        devices = [];
        gamePin = '';

        beforeCreate() {
            this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
        }

        beforeDestroy() {
            this.unsubscribe();
        }

        created() {
          this.devices = cloneDeep(this.$store.getState().devices);
        }

        async storeChanged() {
            const newState = this.$store.getState();
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
