<template>
  <div @click="click" class="editor">
    <div>editor start</div>
    <strip v-for="(item,index) in strips" :key="index" :layout="item"></strip>
    <div>editor end</div>
  </div>
</template>

<script>
  import {bus, event} from '../util/event_bus'

  export default {
    name: 'HelloWorld',
    data() {
      return {}
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

    // 这个是全局属性, 放在store最好了
    mounted() {
      let view = {
        layout: [
          {
            i: '1',
            c: [
              {
                i: '2',
              }
            ]
          }
        ],
        items: {
          '1': {
            id: 1,
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
              model: {'shape': 'o'}, // 选定指定好了的类
              css: { // 用户输入数值, 将会生成到<style>标签里, 使用id作为选择器
                'color': '#800',
                'background-color': "#eee",
//                  'display': 'none',
                '&:hover': {"color": "#f5f"},
              },
              custom: { // 用户自己输入的样式与类, 将原封不动的添加到元素的class和style
                // style: {'color': '#37e'}, classes: []
              },
            },
          }
        }
      }

      // 为什么要处理这个数据?
      // 嵌套结构时 组件自己管理自己的儿子, 不需要维护一个全局对象存放items
      // 当需要做复用组件的时候, 原数据结构不太方便, 因为又需要将复用的组件items放在全局对象里面

      this.$store.commit('view/setView', view)


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
