<template>
    <div class="centered-container">
        <div class="content">
            <h1 class="title">
                <img src="https://vuematerial.io/assets/logo-color.png">
                <span>Takahoot !</span>
            </h1>
            <div>
                <a-tooltip v-if="disabledPlayButton" placement="top" class="button">
                    <template slot="title">
                        <span>{{disabledPlayButtonMessage()}}</span>
                    </template>
                    <a-button type="primary" :disabled="true" size="large" block @click="$router.push('/play')">
                        LET'S PLAY
                    </a-button>
                </a-tooltip>
                <a-button v-if="!disabledPlayButton" class="button" type="primary" size="large" block @click="$router.push('/play')">
                    LET'S PLAY
                </a-button>
                <a-button type="primary" class="button" size="large" block @click="$router.push('/configuration')">
                    CONFIGURATION
                </a-button>
                <a-button type="primary" class="button" size="large" block @click="exit">
                    EXIT
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import Settings from '@/app/settings';

  @Component
  export default class Home extends Vue {

    disabledPlayButton = true;

    exit() {
      window.close();
    }

    mounted() {
      this.disabledPlayButton = !Settings.configuration.targetsSearched || !Settings.configuration.targetsFounded;
      console.log(Settings.configuration);
    }

    disabledPlayButtonMessage() {
      if (!Settings.configuration.targetsSearched) {
        return 'You need to configure the App to found targets'
      } else if (!Settings.configuration.targetsFounded) {
        return 'You need to plug targets on your device'
      }
    }
  }
</script>

<style scoped lang="scss">
    @import '@/assets/colors';

    .button {
        width: 100%;
    }

    .title {
        display: block;
        text-align: center;
        margin-bottom: 30px;
        width: 100%;

        img {
            margin-bottom: 16px;
            max-width: 80px;
        }
    }

    .button {
        margin-bottom: 13px;
    }
</style>