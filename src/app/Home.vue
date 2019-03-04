<template>
    <div class="centered-container">
        <div class="content">
            <h1 class="title">
                <img src="https://vuematerial.io/assets/logo-color.png">
                <span>Takahoot !</span>
            </h1>

            <div>
                <a-button type="primary" class="button" size="large" block @click="$router.push('/play')">
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

  @Component
  export default class Home extends Vue {

    exit() {
      window.close();
    }
  }
</script>

<style scoped lang="scss">
    @import '@/assets/colors';


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