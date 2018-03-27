<template>
  <div @click="click" class="editor">
    <div>editor start</div>
    <page :params="params"></page>
    <div>editor end</div>
  </div>
</template>

<script>
  import {bus, event} from '../util/event_bus'

  export default {
    name: 'Editor',
    data() {
      return {
        params: {
          data: {}
        },
      }
    },
    computed: {
      strips() {
        return this.$store.state.view.layout
      }
    },
    methods: {
      click(ele) {

      }
    },
    created() {
      bus.$on(event.ItemChanged, ({id, props}) => {
        console.log(id, props)
      })
    },

    // 为什么不用vuex做单向数据流, 因为在这项目中, 其实没有父组件管理子组件的概念, 组件应该自己管理自己.
    // 放在全局的store里在做复用组件的时候不好做, 因为复用组件需要自己管理自己的所有元素, 给不是交给这个全局的store管理.

    mounted() {
      let page = {
        i: "page1",
        c: [
          {
            i: '1',
            c: [
              {i: '2',}
            ]
          }
        ],
        items: {
          'page1': {
            id: 'page1',
            type: 'page',
            data: {
              title: "你好"
            },
          },
          '1': {
            id: 1,
            type: 'strip',
            data: {
              fulled: true,
            }
          },
          '2': {
            id: 2,
            type: 'z-text',
            data: {
              text: '<h1>HELLO LAYOUT</h1>'
            },
            design: {
              // 其中 优先级 model < css < advanced < custom
              model: {'shape': 'o'}, // 选定指定好了的类
              css: { // 用户输入数值, 将会生成到<style>标签里, 使用id作为选择器
                'color': '#800',
//                'background-color': "#eee",
                '&:hover': {"color": "#f5f"},
              },
              advanced: {
                'background': {
                  'type': 'img',
                  'video': 'http://www.w3school.com.cn/i/movie.ogg',
                  'img': 'http://pic.sc.chinaz.com/Files/pic/pic9/201802/bpic5722_s.jpg',
                  'color': '#dee'
                }
              },
              custom: { // 用户自己输入的样式与类, 将原封不动的添加到元素的class和style
                // style: {'color': '#37e'}, classes: []
              },
            },
          }
        }
      }

      // 将数据处理成这种格式:
      // 每一个组件都有data和children根字段, data保存自己的数据, children保存儿子的数据, 父组件只会修改data的数据和children的增加删除, 不会更改子组件的data.

      // 为什么在更新组件属性的时候一般是赋值整个data, 而不是更改data里的一项:
      //  因为有时候data里有些属性不是初始化就有的, 是不能响应式监听到的, 直接更改data就能触发响应式.
      // 为什么要data和children分开为一个对象的两个字段:
      //  1. 上面说了更新组件属性的时候一般是赋值整个data, 如果不在外层包裹一层而是直接将data传递进入子组件,那么根据vue的单向数据流原则是不能赋值传递进来的值的. 包裹一层后组件就能自己管理自己data.
      //  2. 赋值data操作会用到深copy, data里的数据越简单越好, 所以将children提高一个层级.

      let t = {
        data: {
          id: '1',
          type: 'page',
          data: {}
        },
        children: [
          {
            data: {
              id: '1',
              type: 'page',
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
        ]
      }

      function fullChildren(layout, items) {
        let item = {
          data: items[layout.i]
        }
        if (layout.c) {
          let c = []
          for (let i in layout.c) {
            let l = layout.c[i]
            c.push(fullChildren(l, items))
          }
          item.children = c
        }

        return item
      }

      this.params = fullChildren(page, page.items)


      setTimeout(() => {
        this.$css.save()
      }, 2000)
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .editor {
    width: 100%;
    height: 100%;
  }
</style>
