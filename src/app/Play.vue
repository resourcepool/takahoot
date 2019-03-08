<template>
    <div class="centered-container">
        <div class="content">
            <a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/')"></a-button>
            <div>
                <h2>Game-pin<span v-if="gamePin"> : {{gamePin}}</span></h2>
                <a-input v-model="gamePinInput" placeholder="Set the game pin" @keyup.enter="setGamePin"/>
            </div>
            <div>
                <h2>Players</h2>
                <a-list size="small" bordered :dataSource="players" class="playerList">
                    <a-list-item slot="renderItem" slot-scope="player, index">
                        <span class="playerName">{{player.name}}</span>
                        <a-button slot="actions" class="deleteButton" type="danger" shape="circle" icon="delete"
                                                @click="deletePlayer(player.id)"></a-button>
                    </a-list-item>
                </a-list>
                <a-input v-if="players.length < 4" v-model="playerNameInput" placeholder="Add a player" @keyup.enter="addPlayer"/>
            </div>
            <a-button type="primary" class="button" size="large" block>START</a-button>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import uuid from 'uuid';

  @Component
  export default class Play extends Vue {
    gamePin = '';
    players = [];
    playerNameInput = '';
    gamePinInput = '';

    mounted() {
    }

    setGamePin() {
      console.log(this.gamePinInput)
      this.gamePin = this.gamePinInput;
      this.gamePinInput = '';
    }

    addPlayer() {
      this.players.push({name: this.playerNameInput, id: uuid.v1()});
      this.playerNameInput = '';
    }

    deletePlayer(id) {
      this.players = this.players.filter(player => player.id !== id);
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