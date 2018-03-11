<!--行组件, 也就是纵向布局容器, 在编辑模式下, 会出现添加按钮-->

<template>
  <div :style="style" :class="classes" data-type="row" class="show-border on-editor">
    <div v-if="props.children.length===0">
      <div class="container placeholder">
        <component v-for="(item, index) in children" :key="item.id" :is="item.type" :props="item"></component>
      </div>
    </div>
    <template v-else>
      <component v-for="(item, index) in children" :key="item.id" :is="item.type" :props="item"></component>
    </template>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'

  // data:{widths:[4]}
  export default {
    name: 'Row',
    mixins: [mixin.style],
    props: [
      'props',
    ],

    data() {
      return {}
    },
    computed: {
      children() {
        let t = []
        for (let i in this.props.children) {
          let c = this.props.children[i]

          t.push({'type': 'add', 'data': {'in': this.props.children, index: parseInt(i)}})
          t.push(c)
        }
        if (!this.props.children) {
          console.log(this)
        }
        t.push({'type': 'add', 'data': {'in': this.props.children, index: this.props.children.length}})
        return t
      }
    },
    methods: {},
    mounted() {

    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .placeholder {
    /*border: 1px dashed #dddddd;*/
    /*border-radius: 4px;*/
    padding: 20px 10px;
  }



</style>
