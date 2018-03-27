<!--最外层纵向布局容器, 主要实现两种模式:全宽度,居中 默认为居中-->

<template>
  <div :style="style" @click="click" :class="classes" data-type="strip" class="show-border editor-padding">
    <div v-if="params.children.length===0">
      <div class=" placeholder">
        <component v-for="(item, index) in children" :key="item.id" :is="item.data.type" :params="item"></component>
      </div>
    </div>
    <template v-else>
      <component v-for="(item, index) in children" :key="item.id" :is="item.data.type" :params="item"
                 @remove="remove(item.data.id)"></component>
    </template>
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
      children() {
        let t = []
        for (let index in this.params.children) {
          let item = this.params.children[index]

          t.push({data:{'type': 'add', 'data': {parent: this.params.children, index: parseInt(index)}}})
          t.push(item)
        }

        t.push({data:{'type': 'add', 'data': {parent: this.params.children, index: this.params.children.length}}})

        return t
      },
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
      },
      remove(id) {
        let index = _.findIndex(this.params.children, i => i.data.id === id)
        if (index >= 0) {
          this.params.children.splice(index, 1)
        }
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
