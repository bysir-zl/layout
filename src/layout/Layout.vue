<!--布局器, 会重组数据结构,并读对组件进行布局-->

<template>
  <div>
    <component :is="root.type" :params="root"></component>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  /*
  params:
      {'id',
      'items',
      'layout',
      'reuse',
      }
      */
  export default {
    name: 'Layout',
    mixins: [mixin.style],
    props: [
      'params',
    ],

    data() {
      return {
        root: {}
      }
    },
    computed: {},
    methods: {
      buildRoot() {
        if (typeof this.params.layout.i === "undefined") {
          return {}
        }
        // 将数据处理成这种格式:
        // 每一个组件都有data和children根字段, data保存自己的数据, children保存儿子的数据, 父组件只会修改data的数据和children的增加删除, 不会更改子组件的data.

        // 为什么要data和children分开为一个对象的两个字段:
        //  1. 上面说了更新组件属性的时候一般是赋值整个data, 如果不在外层包裹一层而是直接将data传递进入子组件,那么根据vue的单向数据流原则是不能赋值传递进来的值的. 包裹一层后组件就能自己管理自己data.
        //  2. 赋值data操作会用到深copy, data里的数据越简单越好, 所以将children提高一个层级.
        // 为什么在更新组件属性的时候一般是赋值整个data, 而不是更改data里的一项:
        //  因为有时候data里有些属性不是初始化就有的, 是不能响应式监听到的, 但最外层的data是永远存在的, 直接更改data就能触发响应式.

        // 将id和type提上一层的原因是在引用子组件的时候需要type和id, 不需要读取data:
        // <component v-for="(item, index) in children" :key="item.id" :is="item.type" :params="item"></component>
        let base =
          {
            id: 0,
            type: 'row',
            item: {
              id: '1',
              type: 'row',
              data: {}
            },
            children: [
              {
                data: {
                  id: '1',
                  type: 'text',
                  data: {}
                }
              }
            ]
          }
        let layout = {
          id: 0,
          type: 'layout',
          items: {},
          layout: {},
          layouts: {}
        }


        let layoutId = this.params.id
        let layouts = this.params.layouts
        let items = this.params.items

        // 在同一个组件复用的时候, 在结构树中应该引用已经处理好的组件, 以实现数据通用
        // 不过在实际使用中, 不经常出现这个场景
        let temp = {}

        function fullChildren(layout) {
          if (temp[layout.i]) {
            return temp[layout.i]
          }

          let item
          if (layout.layout) {
            item = layouts[layout.i]
            if (!item) {
              console.warn("can't found layout id:"+layout.i)
              return null
            }
            item.type = 'layout'
          } else {
            let it = items[layout.i]
            if (!it) {
              console.warn("can't found item id:"+layout.i)
              return null
            }
            it._layoutId = layoutId
            item = {
              id: it.id,
              type: it.type,
              data: it,
            }

            if (layout.c) {
              let c = []
              console.log("layout.c",layout.c)
              for (let i in layout.c) {
                let l = layout.c[i]
                let r = fullChildren(l)
                if (r) {
                  c.push(r)
                }
              }
              item.children = c
            }
          }

          temp[layout.i] = item

          return item
        }

        return fullChildren(this.params.layout)
      }

    },
    mounted() {
      bus.$on(event.ItemChanged + this.params.id, ({id, item}) => {
        console.log("item changed, ", this.params.id, id, item)
      })
      bus.$on(event.LayoutChanged + this.params.id, ({layout}) => {
        console.log("layout changed, ", this.params.id, layout)
      })
      this.root = this.buildRoot()

    },
    watch: {
      params() {
        // 为何不用computed属性?
        //  computed属性不会给对象生成getset, 所以不会有响应式.
        //  如果直接赋值就会自动给对象生成getset
        //  有点不优雅, 考虑一下?
        this.root = this.buildRoot()
      }
    }
  }
</script>

<style scoped lang="less">


</style>
