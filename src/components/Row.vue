<!--行组件, 也就是纵向布局容器-->
<!-- data.center=true 则居中布局-->

<template>
  <div :id="'item-'+this.id" :style="style" @click="click" :class="classes" data-type="row"
       class="show-border editor-padding">
    <div v-if="params.children.length===0" class="placeholder">
      <add :index="0" @add="add"></add>
    </div>
    <template v-else>
      <div v-for="(item, index) in children" :key="item.id">
        <add :index="index" @add="add"></add>
        <component
          :is="item.type"
          :params="item"
          @remove="remove(item.id)">
        </component>

      </div>
      <add :index="params.children.length" @add="add"></add>
    </template>

  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  export default {
    name: 'Row',
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
        this.params.children.forEach((item, index) => {
          t.push(item)
        })
        return t
      },
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

        bus.$emit(event.LayoutChanged + this.data._layoutId)
      },
      add({index, item}) {
        this.params.children.splice(index, 0, item)
        // 异步请求并更新id
        let post = _.cloneDeep(item.data)
        post.id = 0

        this.axios.post("/v1/item", post).then(({data}) => {
          item.id = data.id
          item.data.id = data.id

          bus.$emit(event.ItemAdded + this.data._layoutId, item)
          bus.$emit(event.LayoutChanged + this.data._layoutId)
        })
      },
      '$class'() {
        if (this.data.data && this.data.data.center) {
          return ["container"]
        }
        return []
      },
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
