<!--最外层纵向布局容器, 主要实现两种模式:全宽度,居中 默认为居中-->

<template>
  <div :style="style" @click="click" :class="classes" data-type="row" class="show-border editor-padding">
    <div v-if="props.children.length===0">
      <div class=" placeholder">
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
  import {bus,event} from '../util/event_bus'

  // data:{fulled:false}
  export default {
    name: 'Strip',
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
          console.warn('children is null:', this)
        }
        t.push({'type': 'add', 'data': {'in': this.props.children, index: this.props.children.length}})
        return t
      },
      classes(){
        if (this.props.data && this.props.data.fulled){
          return ["container-fluid"]
        }else{
          return ["container"]
        }
      }
    },
    methods: {
      click(e) {
        bus.$emit(event.SomethingClicked, this)
        e.stopPropagation()
      }
    },
    mounted() {
    },

  }
</script>

<style scoped lang="less">
  .placeholder {
    padding: 20px 10px;
  }

</style>
