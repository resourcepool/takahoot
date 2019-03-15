<template>
    <div class="centered-container">
        <div class="content">
            <a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button>
            <h2>Join your Kahoot session with game pin:</h2>
            <p>You can follow the game from the console.</p>
            <a-button type="primary" class="button" size="large" block @click="reset">
                RESET
            </a-button>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {cloneDeep} from 'lodash';
  import * as targetActions from '@/target-service/actions.js'
  import * as kahootActions from '@/kahoot-service/actions.js'
  import {play} from '@/kahoot-service/service';
  import {gameReset} from '@/target-service/service';

  @Component
  export default class Play extends Vue {
    reset() {
      gameReset();
    }

    create() {
        play();
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
      this.devices = cloneDeep(this.$store.getState().devices);
      switch (newState.lastAction) {
          case targetActions.msg.TARGET_HIT:
              const player = newState.devices[newState.lastActionDeviceIndex].player;
              console.log('TARGET_HIT', player);
              //TODO: hit should trigger answer for proper player
              //TODO: store kahoot session in state player
              // this.kahootGame.kahootSessions[newState.lastActionDeviceIndex].answerQuestion(player.lastHit);
              break;
      }
    }
  }
</script>

<style scoped lang="scss">
    @import '@/assets/colors';



    .content > * {
        display: block;
        margin-bottom: 15px;
    }

    .playerList {
        margin-bottom: 15px;
        .playerName {
            text-transform: capitalize;
        }
    }

    .button {
        margin-top: 30px;
    }

    .back {
        left: -85px;
        top: 85px;
        position: absolute;
    }

</style>
