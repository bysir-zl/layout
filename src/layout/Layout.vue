<!--布局器, 会重组数据结构,并读对组件进行布局-->

<template>
  <div :id="'layout-'+params.id">
    <component
      v-if="params.items[params.layout.i]"
      :is="params.items[params.layout.i].type"
      :params="{id:params.id,items:params.items,layout:params.layout}"
      :root="this"></component>
  </div>
</template>

<script>
  import Vue from 'vue'
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  /*
  params:
      {'id', // layout需要有id
      'items',
      'layout',
      }
      */

  export default {
    name: 'Layout',
    props: [
      'params',
    ],

    data() {
      return {}
    },
    computed: {},
    methods: {
      updateItem(item) {
        console.log("item changed, ", this.params.id, item)
        this.axios.put("/v1/item", item).then(({data}) => {

        })
      },
      addItem(item, done) {
        console.log("item added, ", this.params.id, item)
        this.axios.post("/v1/item", item).then(({data}) => {
          Vue.set(this.params.items, data.id, data)
          done(data)
        })
      },
      updateLayout() {
        console.log("layout changed, ", this.params.id)
        let post = {
          id: this.params.id,
          layout: JSON.stringify(this.params.layout)
        }

        this.axios.put("/v1/page", post).then(({data}) => {

        })
      },
    },
    mounted() {
    }
  }
</script>

<style scoped lang="less">


</style>
