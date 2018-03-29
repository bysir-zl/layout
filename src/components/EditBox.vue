<template>
  <div>
    <div class="editor-box">
      <div class="info">{{title}}</div>
      <div class="button">
        <button @click="$emit('remove')">删除</button>
      </div>
    </div>
    <div class="editor-fixed">
      <div class="mask"></div>
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
          <div v-for="(v,k) in config">
            <label>{{v.label}}</label>
            <div v-if="v.type==='fullText'">
              <el-input type="textarea"
                        :rows="4"
                        v-model="tempData[k]" @input="input"></el-input>
            </div>
            <div v-else-if="v.type==='color'">
              <el-input v-model="tempData[k]" @input="input"></el-input>
            </div>
            <div v-else-if="v.type==='background'">
              <el-radio v-model="tempData[k].type"
                        label="color" @input="input">颜色
              </el-radio>
              <el-radio v-model="tempData[k].type"
                        label="img" @input="input">图片
              </el-radio>
              <el-radio v-model="tempData[k].type"
                        label="video" @input="input">视频
              </el-radio>


              <el-input v-if="tempData[k].type==='video'" v-model="tempData[k].video" @input="input"></el-input>
              <el-input v-else-if="tempData[k].type==='img'" v-model="tempData[k].img" @input="input"></el-input>
              <el-input v-else-if="tempData[k].type==='color'" v-model="tempData[k].color" @input="input"></el-input>
            </div>
            <div v-else-if="v.type==='enum'">
              <el-radio
                v-for="i in v.options"
                :key="i.label"
                v-model="tempData[k]"
                :label="i.value" @input="input">{{i.label}}
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

  export default {
    name: 'EditBox',
    props: [
      'data', // 要修改的数据
      'config',// 数据类型
      'title',
    ],
    data() {
      return {
        tempData: {},
        oldData: {},
        x: 'o',
        bg: {},
      }
    },
    methods: {
      input() {
        // 这里settimeout是因为在部分控件触发@input="input"的时候, v-model还没来得及改变
        setTimeout(() => {
          let x = this.tranDataZ(this.oldData, this.tempData)
          this.$emit('input', x)
        }, 10)
      },
      save() {
        let x = this.tranDataZ(this.oldData, this.tempData)
        this.$emit('input', x)
        this.$emit('close', false)
      },
      reset() {
        this.$emit('input', _.cloneDeep(this.oldData))
      },
      cancel() {
        this.$emit('input', this.oldData)
      },
      close() {
        this.cancel()
        this.$emit('close', false)
      },
      tranData(x) {
        let y = {}

        for (let k in this.config) {
          if (!this.config.hasOwnProperty(k)) {
            continue
          }
          let v = this.config[k]
          try {
            y[k] = eval('x.' + k)
          } catch (e) {
            // 需要给属性赋值上默认值, 才能实现数据响应式
            switch (v.type) {
              case 'background':
                y[k] = {}
                break
              default:
                y[k] = null
            }
          }
        }

        return y
      },
      tranDataZ(base, src) {
        let x = _.cloneDeep(base)
        for (let k in this.config) {
          if (!this.config.hasOwnProperty(k)) {
            continue
          }
          this.setValue(x, k, src[k])
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
    },
    watch: {
      'data'() {
        this.tempData = this.tranData(this.data)
      }
    },
    created() {
      // 将当前数据copy一份
      this.oldData = _.cloneDeep(this.data)

      this.tempData = this.tranData(this.data)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .editor-box {
    position: absolute;
    display: block;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    top: -2px;
    left: -2px;

    border: 1px solid #64a4ff;
    .info {
      position: absolute;
      background-color: #64a4ff;
      font-size: 13px;
      height: 15px;
      line-height: 15px;
      top: -15px;
      left: -1px;
      border-radius: 0;
      padding: 0 4px;
      color: #fff;
    }
  }

  .editor-fixed {
    position: fixed;
    right: 50px;
    top: 50px;
    width: 330px;
    overflow-y: auto;
    background-color: #fff;
    z-index: 100;

    box-shadow: 0 0 18px 0 rgba(22, 45, 61, 0.27);
    border-radius: 10px;
    .mask {
      z-index: -1;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
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
        height: 530px;
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
      }
    }
  }

</style>
