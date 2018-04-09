<template>
  <div v-if="active">
    <!--<div class="editor-box">-->
    <!--<div class="info">{{title}}</div>-->
    <!--<div class="button">-->
    <!--<button @click="$emit('remove')">删除</button>-->
    <!--</div>-->
    <!--</div>-->
    <div class="mask" v-if="showMask"></div>
    <div class="editor-fixed">
      <div class="editor">
        <div class="head">
          {{title}}
          <div class="button-content button-close" @click="close">
            <svg width="25" height="25" viewBox="0 0 25 25">
              <path
                d="M11.793 12.5L8.146 8.854 7.793 8.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646z"></path>
            </svg>
          </div>
        </div>
        <div class="body">
          <div v-for="(v) in config">
            <label>{{v.label}}</label>
            <div v-if="v.type==='fullText'">
              <el-input type="textarea"
                        :rows="4"
                        v-model="tempData[v.componentAlias][v.key]" @input="input(v)"></el-input>
            </div>
            <div v-else-if="v.type==='text'">
              <el-input v-model="tempData[v.componentAlias][v.key]" @input="input(v)"></el-input>
            </div>
            <div v-else-if="v.type==='color'">
              <el-input v-model="tempData[v.componentAlias][v.key]" @input="input(v)"></el-input>
            </div>
            <div v-else-if="v.type==='background'">
              <el-radio v-model="tempData[v.componentAlias][v.key].type"
                        label="color" @input="input(v)">颜色
              </el-radio>
              <el-radio v-model="tempData[v.componentAlias][v.key].type"
                        label="img" @input="input(v)">图片
              </el-radio>
              <el-radio v-model="tempData[v.componentAlias][v.key].type"
                        label="video" @input="input(v)">视频
              </el-radio>


              <el-input v-if="tempData[v.componentAlias][v.key].type==='video'"
                        v-model="tempData[v.componentAlias][v.key].video"
                        @input="input(v)"></el-input>
              <el-input v-else-if="tempData[v.componentAlias][v.key].type==='img'"
                        v-model="tempData[v.componentAlias][v.key].img"
                        @input="input(v)"></el-input>
              <el-input v-else-if="tempData[v.componentAlias][v.key].type==='color'"
                        v-model="tempData[v.componentAlias][v.key].color"
                        @input="input(v)"></el-input>
            </div>
            <div v-else-if="v.type==='enum'">
              <el-radio
                v-for="i in v.options"
                :key="i.label"
                v-model="tempData[v.componentAlias][v.key]"
                :label="i.value" @input="input(v)">{{i.label}}
              </el-radio>
            </div>
            <div v-else-if="v.type==='bool'">
              <el-radio
                v-for="i in [true,false]"
                :key="i"
                v-model="tempData[v.componentAlias][v.key]"
                :label="i" @input="input(v)">{{i.label}}
              </el-radio>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="reset">还原</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // data:{config:{
  //  data
  // },data:{}}
  import {bus, event} from '../util/event_bus'


  export default {
    name: 'EditBox',
    props: [],
    data() {
      return {
        tempData: {}, // 保存各个别名组件下的修改数据
        active: false,
        bg: {},
        showMask: false,// 是否显示遮罩层, 在修改了任何元素就显示

        editedItems: {}, // 这个编辑器影响的所有组件的初始状态, 用于重置, 和与tempData融合出新属性.

        config: {}, // 配置项
        title: '', // 标题
        layout: {}, // 考虑到父组件只会影响到子组件, 所以在按别名查找组件的时候只会遍历在这个layout下的组件.
        onInput: null, // 当某个组件改变了之后
        onSave: null, // 当组件保存
        onClose: null, // 当编辑框关闭
        onOpen: null, // 当编辑框打开

        itemChangedAlias: {}, // 改变过的组件的别名, 在保存的时候只更新改变过的.
      }
    },
    methods: {
      input(config) {
        // 这里settimeout是因为在部分控件触发@input="input"的时候, v-model还没来得及改变
        setTimeout(() => {
          let src = this.editedItems[config.componentAlias]
          let editData = this.tempData[config.componentAlias]

          let x = this.tranDataZ(src, editData)
          this.onInput && this.onInput(x)

          this.showMask = true
          this.itemChangedAlias[config.componentAlias] = true
        }, 10)


      },
      save() {
        for (let alias in this.itemChangedAlias) {
          let src = this.editedItems[alias]
          let editData = this.tempData[alias]

          let x = this.tranDataZ(src, editData)
          this.onSave && this.onSave(x)
        }

        this.active = false
        this.afterClose()
      },
      reset() {
        for (let alias in this.editedItems) {
          let i = this.editedItems[alias]
          this.onInput && this.onInput(_.cloneDeep(i))
        }
        this.showMask = false
      },
      close() {
        this.reset()
        this.active = false

        this.$nextTick(this.afterClose)
      },
      afterOpen() {
        // let bodyEl = document.body
        // if (!bodyEl.style.top) {
        //   this.top = window.scrollY
        //
        //   bodyEl.style.position = 'fixed'
        //   bodyEl.style.top = -this.top + 'px'
        //   bodyEl.style.paddingRight = '17px'
        // }

        this.onOpen && this.onOpen()
      },
      afterClose() {
        // let bodyEl = document.body
        // bodyEl.style.position = ''
        // bodyEl.style.top = ''
        // bodyEl.style.paddingRight = ''
        //
        // window.scrollTo(0, this.top) // 回到原先的top

        this.showMask = false

        this.onClose && this.onClose()

      },
      tranData(config, editItems) {
        let y = {}

        config.forEach((v) => {
          if (!y[v.componentAlias]) {
            y[v.componentAlias] = {}
          }
          try {
            let x = editItems[v.componentAlias]
            y[v.componentAlias][v.key] = eval('x.' + v.key)
          } catch (e) {
            // 需要给属性赋值上默认值, 才能实现数据响应式
            switch (v.type) {
              case 'background':
                y[v.componentAlias][v.key] = {}
                break
              default:
                y[v.componentAlias][v.key] = null
            }
          }
        })

        return y
      },
      tranDataZ(base, modify) {
        let x = _.cloneDeep(base)

        for (let k in modify) {
          let v = modify[k]
          this.setValue(x, k, v)
        }

        return x
      },
      // 设置src对象的k为v
      // k可以为嵌套表达式:如 data.text.value, 或者这种 data["text"]["value"]
      // src.data.text.value = v
      // 如果在解析过程中遇到undefined会自动赋值为空对象
      setValue(src, k, v) {
        // 将data["text-x"]["value"]转为data.text-x.value统一处理
        k = k.replace(/"\]/g, '').replace(/\["/g, '.')

        let arr = k.split('.')
        let len = arr.length
        let t = src
        arr.forEach((i, index) => {
          if (len === index + 1) {
            t[i] = v
            return
          }

          if (!t[i]) {
            t[i] = {}
          }
          t = t[i]
        })
      },

      // 获取config能影响到所有子组件
      // alias => item
      getEditItems(items, layout, config) {
        let alias = []

        let editItems = {}
        config.forEach((c) => {
          if (c.componentAlias !== 'default') {
            alias.push(c.componentAlias)
          } else {
            // 别名是default则说明是自己
            editItems['default'] = _.cloneDeep(items[layout.i])
          }
        })

        let collectLayoutAlias = (l) => {
          let item = items[l.i]
          if (!item) {
            return
          }

          // 别名一样
          if (alias.indexOf(items[l.i].alias) !== -1) {
            editItems[items[l.i].alias] = _.cloneDeep(items[l.i])
          }

          if (l.c) {
            l.c.forEach((i) => {
              collectLayoutAlias(i)
            })
          }
        }

        collectLayoutAlias(layout)

        return editItems

      }
    },
    watch: {},
    created() {
      // 将当前数据copy一份

      bus.$on(event.EditorBoxOpen, ({layout, items, config, onInput, onClose, onOpen, onSave, title}) => {
        // 关闭之前的
        this.onClose && this.onClose()

        this.active = true

        config.forEach((c) => {
          if (!c.componentAlias) {
            c.componentAlias = 'default'
          }
        })
        this.editedItems = this.getEditItems(items, layout, config)

        let tempConfig = []
        // 如果没找到config指定的别名, 那么config里的当前别名配置项也不应该出现. 并且报一个警告
        config.forEach((c) => {
          if (!this.editedItems[c.componentAlias]) {
            console.warn("can't found any children that alias is "+c.componentAlias+"")
            return
          }
          tempConfig.push(c)
        })

        this.config = tempConfig
        this.onInput = onInput
        this.onSave = onSave
        this.title = title
        this.onClose = onClose
        this.onOpen = onOpen


        this.tempData = this.tranData(this.config, this.editedItems)
        this.itemChangedAlias = {}

        this.$nextTick(this.afterOpen)

      })
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .editor-box {
    z-index: 2;
    position: absolute;
    display: block;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    top: -2px;
    left: -2px;

    box-shadow: 0px 0px 20px rgba(79, 101, 174, 0.15);
    .info {
      position: absolute;
      background-color: #64a4ff;
      font-size: 13px;
      height: 15px;
      line-height: 15px;
      top: -16px;
      left: -2px;
      border-radius: 0;
      padding: 0 4px;
      color: #fff;
    }
  }

  .mask {
    z-index: 1;
    position: fixed;
    left: 0;
    top: 0;
    right: 0px;
    height: 100%;
    background: rgba(0, 0, 0, 0.14);
  }

  .editor-fixed {
    position: fixed;
    right: 30px;
    top: 30px;
    width: 320px;
    overflow-y: auto;
    background-color: #f6f6f6;
    z-index: 100;
    border-radius: 10px;

    box-shadow: 0 0 18px 0 rgba(22, 45, 61, 0.27);

    .editor {
      position: relative;

      .head {
        padding: 10px;
        background-color: #64a4ff;
        color: #fff;
        .button-close {
          cursor: pointer;
          background-color: #4e7dc5;
          border-radius: 999px;
          float: right;
          height: 25px;
          svg {
            fill: #fff;
          }
        }
      }
      .body {
        padding: 10px;
        height: 500px;
        /*height: 530px;*/
        overflow-y: auto;
        .num {
          > span {
            display: inline-block;
            background-color: rgba(100, 164, 255, 0.6);
            color: #fff;
            width: 20px;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
          }
        }

        /*滚动条样式*/
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.15);
        }
        &::-webkit-scrollbar-track {
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.07);
        }
      }
      .footer {
        padding: 10px;
        /*position: fixed;*/
        width: 100%;
        bottom: 0;
      }
    }
  }

</style>
