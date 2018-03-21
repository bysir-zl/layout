<template>
  <div @click="click" class="editor">
    <div>editor start</div>
    <strip v-for="(item,index) in layout" :key="index" :props="item"></strip>
    <div>editor end</div>
  </div>
</template>

<script>
  import {bus,event} from '../util/event_bus'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        layout: []
      }
    },
    methods: {
      click(ele) {
        // console.log(ele.target)

        // bus.$emit('something-clicked', ele.target)
      }

    },
    created() {

    },
    mounted() {
      this.layout = [
        {
          data: {
            fulled: true,
          },
          children: [
            {
              id: 123,
              type: 'z-text',
              data: {
                text: '<h1>HELLO LAYOUT</h1>'
              },
              design: {
                model: {'shape': 'o'}, // 选定指定好了的类
                css: { // 用户输入数值, 将会生成到<style>标签里, 使用id作为选择器
                  'color': '#800',
                  'background-color': "#eee",
                  '&:hover': {"color": "#f5f"},
                },
                custom: { // 用户自己输入的样式与类, 将原封不动的添加到元素的class和style
                  // style: {'color': '#37e'}, classes: []
                },
              },
            },
          ],
        },
        {
          data: {
            fulled: false,
          },
          children: [
            {
              id: 4,
              type: 'row',
              data: {
                fulled: true,
              },
              design: {
                css: {
                  'background-color': "#eee",
                }
              },
              children: [
                {
                  id: 3,
                  type: 'column',
                  data: {
                    widths: ["lg-4", "", ""], // 4,4,4栅格, 原理是生成的class为: col-${widths[index]}. 使用bootstrap4.0, 所以可以使用如'','sm-4','lg-4'等值
                  },
                  design: {
                    model: {
                      'shape': 'o'
                    }
                  },
                  children: [
                    {
                      id: 100,
                      type: 'row',
                      children: [
                        {
                          id: 4,
                          type: 'z-text',
                          data: {
                            text: '<span> i am a childen</span> '
                          },
                          design: {
                            css: {
                              'background-color': "#e2e2e2"
                            }
                          },
                        },
                        {
                          id: 6,
                          type: 'z-text',
                          data: {
                            text: '<span> i am a childen3</span> '
                          },
                          design: {
                            css: {
                              'background-color': "#e2e2e2"
                            }
                          },
                        },
                      ]
                    },
                    {
                      id: 101,
                      type: 'row',
                      children: [
                        {
                          id: 5,
                          type: 'z-text',
                          data: {
                            text: '<span> i am a childen2</span> '
                          },
                          design: {
                            css: {
                              'background-color': "#e2e2e2"
                            }
                          },
                        }
                      ]
                    },

                  ]
                }
              ],
            },
          ]
        },
        {
          data: {
            fulled: true,
          },
          children: [
            {
              id: 15,
              type: 'row',
              data: {},
              children: [
                {
                  id: 19,
                  type: 'z-text',
                  data: {
                    text: '<h2>end</h2>'
                  },
                  style: {'color': '#833', 'background-color': "#eee"}
                }
              ]
            }
          ]

        }
      ];

      var t = []
      // 生成1k个节点测试性能

      // setTimeout(() => {
      //   for (let i = 0; i < 200; i++) {
      //
      //     let item = {
      //       // id: 10000 + i,
      //       type: 'column',
      //       data: {
      //         widths: ["lg-4", "", ""], // 4,4,4栅格, 原理是生成的class为: col-${widths[index]}. 使用bootstrap4.0, 所以可以使用如'','sm-4','lg-4'等值
      //       },
      //       style: {
      //         'shape': 'o',
      //       },
      //       children: [
      //         {
      //           // id: 20000 + i,
      //           type: 'row',
      //           children: [
      //             {
      //               id: 4,
      //               type: 'z-text',
      //               data: {
      //                 text: '<span> i am a childen</span> '
      //               },
      //               style: {
      //                 'background-color': "#4f65ae",
      //               }
      //             },
      //             {
      //               // id: 30000 + i,
      //               type: 'z-text',
      //               data: {
      //                 text: '<span> i am a childen3</span> '
      //               },
      //               style: {
      //                 'background-color': "#4f65ae",
      //               }
      //             },
      //           ]
      //         },
      //         {
      //           // id: 40000 + i,
      //           type: 'row',
      //           children: [
      //             {
      //               id: 50000 + i,
      //               type: 'z-text',
      //               data: {
      //                 text: '<span> i am a childen2</span> '
      //               },
      //               style: {
      //                 'background-color': "#a46aae"
      //               }
      //             }
      //           ]
      //         },
      //
      //       ]
      //     }
      //
      //
      //     t.push(item)
      //   }
      //
      // }, 1000)
      //
      // setTimeout(() => {
      //   this.layout.children[1].children = t
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
