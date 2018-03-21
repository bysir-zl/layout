<template>
  <div class="self" data-comp="text" @click="click" :id="'v-'+props.id">
    <div v-html="props.data.text" class="data" :style="style" :class="classes"></div>
    <div class="editor-box" v-if="active">
      <div class="info">text</div>
      <div class="editor-fixed">
        <div v-html="props.data.text"></div>
        <div @click="editClickCss">clickCss</div>
        <div @click="editClickModel">clickModel</div>
      </div>
    </div>

    {{css}}
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
      'props',
    ],
    data() {
      return {
        active: false,
      }
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
        let value = this.props.design.css
        value["background-color"] = "#f00"

        this.commitCss({".data": value})
      },
      editClickModel() {
        let s = _.cloneDeep(this.props)
        s.design.model['shape'] = 'p'

        bus.$emit(event.ItemChanged, {id: this.props.id, props: s})
      },
      '$class'() {
        return obj2array(this.props.design.model, '-')
      },
      '$bindCss'(css) {
        return {".data": css}
      }

    },
    mounted() {

    },
    computed: {},
    watch: {
      'props.design.model'() {
        console.log('p1')
      },
      'props.design.css'() {
        console.log('p2')
      },
    },
    created() {
      if (!this.props.design || !this.props.design.css) {
        return ""
      }
      this.commitCss({".data": this.props.design.css})
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

  .editor {
    .self {
      .data {
        pointer-events: none;
      }
    }
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
