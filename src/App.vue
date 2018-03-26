<template>
  <div id="app">
    <bind-css/>
    <base-style/>
    <router-view/>
  </div>
</template>

<script>
  import BaseStyle from './css/BaseStyle.vue'

  export default {
    name: 'App',
    components: {
      'base-style': BaseStyle,
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
