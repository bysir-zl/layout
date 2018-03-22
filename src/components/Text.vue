<template>
  <div class="self" data-comp="text" @click="click" :id="'v-'+data.id">
    <div v-html="data.data.text" class="data" :style="style" :class="classes"></div>
    <div class="editor-box" v-if="active">
      <div class="info">text</div>
      <div class="editor-fixed">
        <div v-html="data.data.text"></div>
        <div @click="editClickCss">clickCss</div>
        <div @click="editClickModel">clickModel</div>
        <div @click="editClickText">editClickText</div>
      </div>
    </div>
  </div>
</template>

<script>
  // 组件上需要data-comp属性标记它是一个组件, 方便在点击事件时激活它
  //  'data', // 整个组件的数据
  //    'style', // 样式, 可自定义或者原生属性
  //    'methods', // 用户自定义事件(js)

  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'
  import obj2array from '../util/obj2array'

  export default {
    name: 'VText',
    mixins: [mixin.style],
    props: [
      'layout',
    ],
    data() {
      return {
        active: false,
      }
    },
    computed: {

    },
    methods: {
      click(e) {
        this.active = true
        bus.$emit(event.SomethingClicked, this)
        e.stopPropagation()

        bus.$once(event.SomethingClicked, (components) => {
          if (components === this) {
            return
          }
          this.active = false
        })
      },
      editClickCss() {
        // 请注意要clone一个在修改
        // 1: 单向数据流
        // 2: 如果直接在原对象里改, 当commit之后, 由于是同一个对象就不会触发到data的watch
        let s = _.cloneDeep(this.data)
        if (!s.design) {
          s.design = {css: {}}
        } else if (!s.design.css) {
          s.design.css = {}
        }
        s.design.css["background-color"] = "#f00"
        this.$store.commit('view/updateItem', {id: this.id, data: s})
      },
      editClickModel() {
        let s = _.cloneDeep(this.data)
        s.design.model['shape'] = 'p'

        this.$store.commit('view/updateItem', {id: this.id, data: s})
      },
      editClickText() {
        let s = _.cloneDeep(this.data)
        s.data.text = "hh"

        this.$store.commit('view/updateItem', {id: this.id, data: s})
      },
      '$class'() {
        return obj2array(this.data.design.model, '-')
      },

    },
    mounted() {

    },

    watch: {
      'data'() {
        if (!this.data.design || !this.data.design.css) {
          return
        }
        this.commitCss({".data": this.data.design.css})
      }
    },
    created() {
      if (!this.data.design || !this.data.design.css) {
        return ""
      }
      this.commitCss({".data": this.data.design.css})
    }
  }
</script>

<style scoped lang="less">
  .shape-o {
    border: 1px solid #c0009a;
    border-radius: 4px;
  }

  .shape-p {
    border: 1px solid #88a4c0;
    border-radius: 10px;
  }

  .self {
    position: relative;
  }

  .data {
    padding: 3px 6px;
    overflow: hidden;
  }

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

    .editor-fixed {
      position: fixed;
      right: 50px;
      top: 50px;
      width: 300px;
      height: 600px;
      overflow-y: auto;
      background-color: #fff;
      z-index: 100;

      box-shadow: 0 0 18px 0 rgba(22, 45, 61, 0.27);
      border-radius: 10px;
    }

  }

</style>
