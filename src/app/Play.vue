<template>
    <div class="centered-container">
        <h1><a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button> Play game</h1>
        <div class="targets">
            <div v-for="device in devices">
                <div class="target">
                    <img src="@/assets/images/target.png" alt="target"/>
                    <p>{{device.player.name}}</p>
                    <p>{{device.player.kahootSession ? 'JOINED' : '...'}}</p>
                    <pre>{{device.player.lastHit}} - {{device.player.targetPosition}}</pre>
                </div>
            </div>
        </div>
        <a-button type="primary" class="button" size="large" block @click="reset">RESET</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import * as targetActions from '@/target-service/actions.js'
    import * as kahootActions from '@/kahoot-service/actions.js'
    import {clean, play} from '@/kahoot-service/service';
    import {gameReset} from '@/target-service/service';

    @Component
    export default class Play extends Vue {

        @Prop(Array) devices;

        beforeCreate() {
            this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
        }

        beforeDestroy() {
            this.unsubscribe();
        }

        reset() {
          gameReset();
        }

        created() {
          play();
        }

        async storeChanged() {
          const newState = this.$store.getState();
          if (!newState || !newState.lastAction) return;
          switch (newState.lastAction) {
            case kahootActions.msg.KAHOOT_JOINED:
              break;
            case kahootActions.msg.KAHOOT_QUIZ_END:
              this.$router.push({path: '/end'});
              break;
            case targetActions.msg.TARGET_HIT:
              const player = newState.devices[newState.lastActionDeviceIndex].player;
              console.log('TARGET_HIT', player);
              setTimeout(() => player.kahootSession.question.answer(player.lastHit), 500);
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
