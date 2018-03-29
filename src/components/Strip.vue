<!--板块容器, 主要实现两种模式:全宽度,居中 默认为居中-->
<!--直接使用row组件渲染子节点, 以实现编辑, 但数据结构是不变的-->

<template>
  <div :style="style" @click="click" :class="classes" data-type="strip">
    <row :params="params"></row>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'

  // data:{fulled:false}
  export default {
    name: 'Strip',
    mixins: [mixin.style],
    props: [
      'params',
    ],

    data() {
      return {}
    },
    computed: {
      classes() {
        if (this.data && this.data.fulled) {
          return ["container-fluid"]
        } else {
          return ["container"]
        }
      }
    },
    methods: {
      click(e) {
//        bus.$emit(event.SomethingClicked, this)
//        e.stopPropagation()
      }
    },
    mounted() {
    },

  }
</script>

<style scoped lang="less">

</style>
