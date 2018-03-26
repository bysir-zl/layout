<!--行组件, 也就是纵向布局容器-->

<template>
  <div :style="style" @click="click" :class="classes" data-type="row" class="show-border editor-padding">
    <div v-if="!data.children || data.children.length===0">
      <div class=" placeholder">
        <component v-for="(item, index) in children" :key="item.id" :is="item.type" :data="item"></component>
      </div>
    </div>
    <template v-else>
      <component v-for="(item, index) in children" :key="item.id" :is="item.type" :data="item"></component>
    </template>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  // data:{}
  export default {
    name: 'Row',
    mixins: [mixin.style],
    props: [
      'data',
    ],

    data() {
      return {}
    },
    computed: {
      children() {
        let t = []
        for (let index in this.data.children) {

          let item = this.data.children[index]

          t.push({type: 'add', data: {parentId: this.id, index: parseInt(index)}})
          t.push(item)
        }

        t.push({type: 'add', data: {parentId: this.id, index: 99999}})

        return t
      },
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
  .placeholder {
    padding: 20px 10px;
  }

</style>
