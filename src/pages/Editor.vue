<template>
  <div @click="click" class="editor">
    <div>editor start</div>
    <row :props="layout"></row>
    <div>editor end</div>
  </div>
</template>

<script>
  import bus from '../event_bus'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        layout: {
          children: []
        }
      }
    },
    methods: {
      onEditor(layout) {
        this.layout = layout
      },
      click(ele) {
        // console.log(ele.target)

        // bus.$emit('something-clicked', ele.target)
      }

    },
    created() {
      bus.$on('edit-add', function (data) {
        console.log(data)
      })
    },
    mounted() {
      this.layout = {
        children:
          [
            {
              id: 123,
              type: 'z-text',
              data: {
                text: '<h1>HELLO LAYOUT</h1>'
              },
              style: {'color': '#800', 'shape': 'o', 'background-color': "#50ae70"}

            },
            {
              id: 4,
              type: 'row',
              children: [
                {
                  id: 3,
                  type: 'column',
                  data: {
                    widths: ["lg-4", "", ""], // 4,4,4栅格, 原理是生成的class为: col-${widths[index]}. 使用bootstrap4.0, 所以可以使用如'','sm-4','lg-4'等值
                  },
                  style: {
                    'shape': 'o',
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
                          style: {
                            'background-color': "#4f65ae",
                          }
                        },
                        {
                          id: 6,
                          type: 'z-text',
                          data: {
                            text: '<span> i am a childen3</span> '
                          },
                          style: {
                            'background-color': "#4f65ae",
                          }
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
                          style: {
                            'background-color': "#a46aae"
                          }
                        }
                      ]
                    },

                  ]
                }
              ],
            }

          ]
      }

      var t = []
      // 生成1k个节点测试性能

      setTimeout(() => {
        for (let i = 0; i < 200; i++) {

          let item = {
            // id: 10000 + i,
            type: 'column',
            data: {
              widths: ["lg-4", "", ""], // 4,4,4栅格, 原理是生成的class为: col-${widths[index]}. 使用bootstrap4.0, 所以可以使用如'','sm-4','lg-4'等值
            },
            style: {
              'shape': 'o',
            },
            children: [
              {
                // id: 20000 + i,
                type: 'row',
                children: [
                  {
                    id: 4,
                    type: 'z-text',
                    data: {
                      text: '<span> i am a childen</span> '
                    },
                    style: {
                      'background-color': "#4f65ae",
                    }
                  },
                  {
                    // id: 30000 + i,
                    type: 'z-text',
                    data: {
                      text: '<span> i am a childen3</span> '
                    },
                    style: {
                      'background-color': "#4f65ae",
                    }
                  },
                ]
              },
              {
                // id: 40000 + i,
                type: 'row',
                children: [
                  {
                    id: 50000 + i,
                    type: 'z-text',
                    data: {
                      text: '<span> i am a childen2</span> '
                    },
                    style: {
                      'background-color': "#a46aae"
                    }
                  }
                ]
              },

            ]
          }


          t.push(item)
        }

      }, 1000)

      setTimeout(() => {
        this.layout.children[1].children = t
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
