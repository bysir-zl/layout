<template>
  <div id="app">
    <css/>
    <base-style/>
    <router-view/>
  </div>
</template>

<script>
  import BaseStyle from './css/BaseStyle.vue'
  import Css from './css/Css.vue'

  export default {
    name: 'App',
    components: {
      'base-style': BaseStyle,
      'css': Css,
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
