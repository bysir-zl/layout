<!--行组件, 也就是纵向布局容器-->
<!-- data.center=true 则居中布局-->

<template>
  <div :id="'item-'+params.layout.i" data-type="row" :style="style" :class="classes"
       class="self show-border editor-padding"  @dragstart="ondragstart">
    <span class="pin" @click="click"></span>
    <div v-if="!params.layout.c || params.layout.c.length===0" class="placeholder">
      <add :index="0" @add="add"></add>
    </div>
    <template v-else>
      <div v-for="(layout, index) in params.layout.c" :key="layout.i">
        <add :index="index" @add="add" @drop="drop(index)"></add>
        <template v-if="params.items[layout.i]">
          <!--如果是布局组件，则使用布局组件的布局-->
          <layout
            v-if="params.items[layout.i].type==='layout'"
            :params="params.items[layout.i]"
            @remove="remove(index)">
          </layout>
          <!--否则就使用由上到下继承下来的布局-->
          <component
            v-else
            :is="params.items[layout.i].type"
            :params="{id:layout.i,items:params.items,layout:layout}"
            :root="root"
            @remove="remove(index)"
            draggable="true" @dragstart="dragstart(index)">
          </component>

        </template>
        <span v-else>
          not found {{layout.i}}
        </span>

      </div>
      <add :index="params.layout.c.length" @add="add" @drop="drop(params.layout.c.length)"></add>
    </template>

  </div>
</template>

<script>
  import Vue from 'vue'
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  /*
  params:
      {
      'items',
      'layout'
      }
      */

  export default {
    name: 'Row',
    mixins: [mixin.style],
    props: [
      'params',
      'root',
    ],

    data() {
      return {
        // 对于复合组件的config可能是由设计师编写的, 是从后台获取的
        editConfig: [
          {
            key: 'data.center',
            label: '居中',
            type: 'bool'
          },
          {
            componentAlias: 'title',
            label: '标题',
            key: 'data.text',
            type: 'text'
          }
        ],
      }
    },
    computed: {},
    methods: {
      click(e) {
        bus.$emit(event.EditorBoxOpen, {
          items: this.params.items,
          layout: this.params.layout,
          config: this.editConfig,
          onInput: (s) => {
            Vue.set(this.params.items, s.id, s)
          },
          onSave: (s) => {
            Vue.set(this.params.items, s.id, s)
            this.root.updateItem(s)
          },
          title: 'row',
        })

      },
      ondragstart(e) {
        e.preventDefault();
        e.stopPropagation()
        this.$emit("dragstart",e)
      },

      onSave(s) {
        this.item = s
      },
      remove(index) {
        this.params.children.splice(index, 1)

        this.root.updateLayout()
      },
      add({index, item}) {
        // 异步请求并更新id
        let post = _.cloneDeep(item.data)
        post.id = 0

        this.root.addItem(post, (i) => {
          this.params.layout.c.splice(index, 0, {i: i.id, c: []})
          this.root.updateLayout()
        })
      },
      dragstart(index) {
        console.log(this.params.layout.i)
        window.drag = {layout: this.params.layout, index: index}
      },
      drop(index) {
        console.log(this.params.layout.i)
        if (window.drag) {
          let item = window.drag.layout.c[window.drag.index]
          window.drag.layout.c.splice(window.drag.index, 1)

          this.params.layout.c.splice(index, 0, item)
        }

        window.drag = null
      },
      '$class'() {
        if (this.item.data && this.item.data.center) {
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

  .self {
    padding-top: 12px;
    position: relative;
  }

  .pin {
    position: absolute;
    left: 1px;
    top: 1px;
    z-index: 10;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: #35b1eb;
    cursor: pointer;
  }


</style>
