<template>
    <div class="centered-container">
        <h1><a-button class="back" type="primary" shape="circle" icon="arrow-left" size="large" @click="$router.push('/start')"></a-button> Quiz end</h1>
        <a-button type="primary" class="button" size="large" block @click="clean">CLEAN</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import {cloneDeep} from 'lodash';
    import * as targetActions from '@/target-service/actions.js'
    import * as kahootActions from '@/kahoot-service/actions.js'
    import {clean} from '@/kahoot-service/service';

    @Component
  export default class End extends Vue {

    devices = [];

    beforeCreate() {
      this.unsubscribe = this.$store.subscribe(() => this.storeChanged())
    }

    beforeDestroy() {
      this.unsubscribe();
    }

    clean() {
        clean();
    }

    created() {
      this.devices = cloneDeep(this.$store.getState().devices);
    }

    async storeChanged() {
      const newState = this.$store.getState();
      if (!newState || !newState.lastAction) return;
      this.devices = cloneDeep(this.$store.getState().devices);
      switch (newState.lastAction) {
          case kahootActions.msg.KAHOOT_CLEAN_SESSIONS:
              this.$router.push({path: '/start'});
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
