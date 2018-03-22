<!--行组件, 也就是纵向布局容器-->

<template>
  <div :style="style" @click="click" :class="classes" data-type="row" class="show-border editor-padding">
    <div v-if="!layout.c || layout.c.length===0">
      <div class=" placeholder">
        <component v-for="(item, index) in children" :key="item.id" :is="item.type" :layout="item"></component>
      </div>
    </div>
    <template v-else>
      <component v-for="(item, index) in children" :key="item.id" :is="item.type" :layout="item"></component>
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
      'layout',
    ],

    data() {
      return {}
    },
    computed: {
      children() {
        let t = []
        for (let index in this.layout.c) {
          let c = {...this.layout.c[index]}

          // 读取item的type
          let cid = this.layout.c[index].i
          let item = this.$store.state.view.items[cid]
          if (!item) {
            console.log("item id " + cid + " can't found in items, but it used in layout")
            continue
          }
          c.type = item.type

          t.push({type: 'add', data: {parentId: this.layout.i, index: parseInt(index)}})
          t.push(c)
        }

        t.push({type: 'add', data: {parentId: this.layout.i, index: 99999}})

        return t
      },
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
