<template>
  <v-app>
    <v-main>
      <v-overlay absolute opacity="0" class="my-overlay">
          <transition name="fade">
            <Main key="1" v-if="isOnMainPage"/>
            <landing-page @go-to-main="isOnMainPage=true" key="2"  v-else/>
          </transition>
      </v-overlay>
      <my-particle/>
    </v-main>
  </v-app>
</template>

<script>
import LandingPage from "./components/LandingPage";
import MyParticle from "./components/MyParticle";
import Main from "./components/Main";

export default {
  name: 'App',
  components: {
    Main,
    MyParticle,
    LandingPage
  },
  data(){
    return{
      isOnMainPage : false
    }
  }
};
</script>

<style scoped>

.my-overlay >>> .v-overlay__content {
  width: 100%;
  height: 100%;
}
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 1s;
  opacity: 0;
}
</style>
