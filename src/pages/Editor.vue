<template>
  <div @click="click" class="editor">
    <layout :params="params"></layout>
    <edit-box></edit-box>
  </div>
</template>

<script>

  export default {
    name: 'Editor',
    data() {
      return {
        params: {
          id: 0,
          layout: {},
          items: {},
        },
      }
    },
    computed: {},
    methods: {
      click(ele) {

      }
    },
    created() {

    },

    // 为什么不用vuex做单向数据流
    //  1. 因为在这项目中, 其实没有父组件管理子组件的概念, 组件应该自己管理自己, 就算自己数据改变了也不应该让父组件知道并处理.
    //  2. 放在全局的store里在做复用组件的时候不好做, 因为复用组件需要自己管理自己的所有元素, 给不是交给这个全局的store管理.

    // layout必须是一个(容器)组件
    mounted() {
      let layout = {
        id: 1,
        layout: {
          i: 0,
          c: [
            {
              i: 1,
              c: [
                {i: 2},
              ]
            },
            {i: 2},
            {i: 44},
          ]
        }
        ,
        items: {
          '0': {
            id: 0,
            type: 'row'
          },
          '1': {
            id: 1,
            type: 'row',
            data: {
              center: true,
            }
          },
          '2': {
            id: 2,
            alias:'title',
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
          },
          44: {
            id: 44,
            type: 'layout',
            layout:
              {
                i: 21,
                c: [
                  {i: 22},
                ]
              }
            ,
            items: {
              '21': {
                id: 21,
                type: 'row',
                data: {
                  center: true,
                }
              },
              '22': {
                id: 22,
                type: 'z-text',
                data: {
                  text: '<h1>HELLO LAYOUT</h1>'
                },
                design: {
                  // 其中 优先级 model < css < advanced < custom
                  model: {'shape': ''}, // 选定指定好了的类
                  css: { // 用户输入数值, 将会生成到<style>标签里, 使用id作为选择器
                    'color': '#111',
                    '&:hover': {"color": "#666"},
                  },
                  advanced: {
                    'background': {
                      'type': 'color',
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
        }
      }

     this.params = layout

      // this.axios.get("/v1/page/layout?id=1").then(({data}) => {
      //   this.params = data
      // })

      // setTimeout(() => {
      //   this.$css.save()
      // }, 2000)
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
