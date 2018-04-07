<!--布局器, 会重组数据结构,并读对组件进行布局-->

<template>
  <div :id="'layout-'+params.id">
    <component v-if="params.items[params.layout.i]" :is="params.items[params.layout.i].type" :params="params"
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
//      buildRoot() {
//        if (typeof this.params.layout.i === "undefined") {
//          return {}
//        }
//        // 将数据处理成这种格式:
//        // 每一个组件都有data和children根字段, data保存自己的数据, children保存儿子的数据, 父组件只会修改data的数据和children的增加删除, 不会更改子组件的data.
//        // 这种格式的优点: 传参简单, 将整个树都传递进组件.
//        // 缺点: 需要重组, 麻烦, 并且在修改某个组件的时候只有使用js的引用传参特性, 如果要使用id定位组件则需要递归遍历.
//        //  由于布局结构数据会改变, 所以在向后端提交数据的时候又需要重新处理.
//
//        // 为什么要data和children分开为一个对象的两个字段:
//        //  1. 上面说了更新组件属性的时候一般是赋值整个data, 如果不在外层包裹一层而是直接将data传递进入子组件,那么根据vue的单向数据流原则是不能赋值传递进来的值的. 包裹一层后组件就能自己管理自己data.
//        //  2. 赋值data操作会用到深copy, data里的数据越简单越好, 所以将children提高一个层级.
//        // 为什么在更新组件属性的时候一般是赋值整个data, 而不是更改data里的一项:
//        //  因为有时候data里有些属性不是初始化就有的, 是不能响应式监听到的, 但最外层的data是永远存在的, 直接更改data就能触发响应式.
//
//        // 将id和type提上一层的原因是在引用子组件的时候需要type和id, 不需要读取data:
//        // <component v-for="(item, index) in children" :key="item.id" :is="item.type" :params="item"></component>
//        let base =
//          {
//            id: 0,
//            type: 'row',
//            item: {
//              id: '1',
//              type: 'row',
//              data: {}
//            },
//            children: [
//              {
//                data: {
//                  id: '1',
//                  type: 'text',
//                  data: {}
//                }
//              }
//            ]
//          }
//        let layout = {
//          id: 0,
//          type: 'layout',
//          items: {},
//          layout: {},
//          layouts: {}
//        }
//
//        let layoutId = this.params.id
//        let layouts = this.params.layouts ? this.params.layouts : {}
//        let items = this.params.items ? this.params.items : {}
//
//        // 在同一个组件复用的时候, 在结构树中应该引用已经处理好的组件, 以实现数据通用
//        // 不过在实际使用中, 不经常出现这个场景
//        let temp = {}
//
//        function fullChildren(layout) {
//          if (temp[layout.i]) {
//            return temp[layout.i]
//          }
//
//          let item
//          // 是布局组件
//          if (layout.layout) {
//            item = layouts[layout.i]
//            if (!item) {
//              console.warn("can't found layout id:" + layout.i)
//              return null
//            }
//            item.type = 'layout'
//          } else {
//            // 不是布局组件
//            let it = items[layout.i]
//            if (!it) {
//              console.warn("can't found item id:" + layout.i)
//              return null
//            }
//            it._layoutId = layoutId
//            item = {
//              id: it.id,
//              type: it.type,
//              data: it,
//            }
//
//            // 默认赋值一个children, 也容器组件中就难得判断了
//            item.children = []
//            if (layout.c) {
//              let c = []
//              for (let i in layout.c) {
//                let l = layout.c[i]
//                let r = fullChildren(l)
//                if (r) {
//                  c.push(r)
//                }
//              }
//              item.children = c
//            }
//          }
//
//          temp[layout.i] = item
//
//          return item
//        }
//
//        return fullChildren(this.params.layout)
//      },
      updateItem(item) {
        console.log("item changed, ", this.params.id, item)
        this.axios.put("/v1/item", item).then(({data}) => {

        })
      },
      addItem(item,done) {
        console.log("item added, ", this.params.id, item)
        this.axios.post("/v1/item", item).then(({data}) => {
          Vue.set(this.params.items,data.id,data)
          done(data)
        })
      },
      updateLayout(){
        console.log("layout changed, ", this.params.id)
        let post = {
          id: this.params.id,
          layout: JSON.stringify(this.params.layout)
        }

        this.axios.put("/v1/page", post).then(({data}) => {

        })
      },
      init() {

      }
    },
    mounted() {
      this.init()
    },
    watch: {
      params(n, o) {
        // 为何不用computed属性?
        //  computed属性不会给对象生成getset, 所以不会有响应式.
        //  如果直接赋值就会自动给对象生成getset
        //  有点不优雅, 考虑一下?
        bus.$off(event.ItemChanged + o.id)
        bus.$off(event.LayoutChanged + o.id)

        this.init()
      }
    }
  }
</script>

<style scoped lang="less">


</style>
