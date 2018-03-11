<template>
  <div class="container show-border self" v-html="props.data.text" :style="style" :class="classes">
  </div>
</template>

<script>
  //  'data', // 整个组件的数据
  //    'style', // 样式, 可自定义或者原生属性
  //    'methods', // 用户自定义事件(js)

  import mixin from '../base/mixin.js'

  export default {
    name: 'HelloWorld',
    mixins: [mixin.style],
    props: [
      'props',
    ],
    data() {
      return {}
    },
    methods: {
      '$renderStyle'(key, value, style, classes) {
        switch (key) {
          // 对于自定义属性, 我们需要解析成内联style或者class
          case 'shape':
            classes.push('shape-' + value)
            return true
          default:
            return false
        }
      },
    },
    mounted() {
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shape-o {
    border: 1px solid #c0009a;
  }
  .self{
    padding: 3px 6px;
  }

</style>
