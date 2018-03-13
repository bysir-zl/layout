<!--列组件, 也就是横向布局容器-->
<template>
  <div class="container self" @click="click">
    <div :style="style" :class="classes" class="row show-border editor-padding">
      <div v-for="(item,index) in children" class="col" :class="'col-'+widths[index]">
        <component :is="item.type" :props="item"></component>
      </div>
    </div>
    <div class="edit">edit</div>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import bus from '../event_bus.js'

  // data:{widths:[4]}
  export default {
    name: 'Column',
    mixins: [mixin.style],
    props: [
      'props',
    ],
    data() {
      return {
        widths: [],
      }
    },
    computed: {
      children() {

        let t = []
        for (let i in this.props.children) {
          t.push(this.props.children[i])
        }

        return t
      }
    },
    methods: {
      click(e) {
        bus.$emit('something-clicked', this)
        e.stopPropagation()
      }
    },
    mounted() {
      this.widths = []
      for (let i in this.props.children) {
        this.widths.push(this.props.data.widths.length > i ? this.props.data.widths[i] : 0)
      }
    },
    created() {
      // 检查widths长度和children长度
      let max = this.props.data.widths.length > this.props.children.length ? this.props.data.widths.length : this.props.children.length
      let oldLen = this.props.children.length
      for (let i = 0; i < max - oldLen; i++) {
        this.props.children.push({type: 'row', children: []})
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .self {

  }

  .edit {
    background-color: aqua;
  }
</style>
