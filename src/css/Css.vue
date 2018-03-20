<!--处理动态css-->
<template>
  <div class="css">
    <div v-for="(value,key) in style" :key="key" v-html="value"></div>
  </div>
</template>

<script>

  export default {
    name: 'Css',
    computed: {
      style() {
        return this.$store.state.css.style
      }
    },
    methods: {}
  }
</script>
