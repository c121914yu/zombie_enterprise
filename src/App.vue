<template>
  <div id="app">
    <Nav></Nav>
    <div class="view">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
export default {
  mounted() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      delay: 100,
      anchorPlacement: 'bottom-bottom',
      once: true,
    })
  },
  components: {
    Nav,
  },
}
</script>

<style>
@import url('./assets/common.css');
#app {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.view {
  width: 100%;
  min-height: 100vh;
  padding-top: 60px;
}
</style>
