<template>
   <div>
      <router-link to="/">Return</router-link>
      <div>
         <h1>Game-pin<span v-if="gamePin"> : {{gamePin}}</span></h1>
         <input v-model="gamePinInput" placeholder="Set the game pin" @keyup.enter="setGamePin"/>
      </div>
      <div>
         <h2>Add players</h2>
         <p v-for="player in players">
            <span>{{player.name}}</span>
            <button @click="deletePlayer(player.id)">X</button>
         </p>
      </div>
      <div>
         <input v-model="playerNameInput" placeholder="Add a player" @keyup.enter="addPlayer"/>
      </div>
   </div>
</template>

<script>
   import Vue from 'vue';
   import Component from 'vue-class-component';
   import uuid from 'uuid';

   @Component
   export default class Play extends Vue {
      gamePin = '';
      players = [];
      playerNameInput = '';
      gamePinInput = '';

      mounted () {
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

</style>