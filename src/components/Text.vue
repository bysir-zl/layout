<template>
  <div class="self" data-comp="text" @click="click" :id="'v-'+props.id" :style="style" :class="classes">
    <div v-html="props.data.text" class="data"></div>
    <div class="editor-box" v-if="active">
      <div class="info">text</div>
      <div class="editor-fixed">
        <div v-html="props.data.text"></div>
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
  import bus from '../event_bus'

  export default {
    name: 'HelloWorld',
    mixins: [mixin.style],
    props: [
      'props',
    ],
    data() {
      return {
        active: false
      }
    },
    methods: {
      '$renderStyle'(key, value, style, classes) {
        switch (key) {
          // 对于自定义属性, 我们需要解析成内联style或者class
          case 'shape':
            classes.push('shape-' + value)
            return true
          default:
            return false
        }
      },
      click(e) {
        this.active = true
        bus.$emit('something-clicked', this)
        e.stopPropagation()

        bus.$once('something-clicked', (components) => {
          if (components === this) {
            return
          }
          this.active = false
        })
      }
    },
    mounted() {

    },
    computed: {
      classes() {
        return []
      },
      style() {
        if (!this.props.style.custom) {
          return this.props.style
        }
        let name = '#' + 'v-' + this.props.id + ':hover'
        let css = {'color': '#ff5'}
        var cssx = document.createElement('style');
        cssx.type = 'text/css';
        cssx.innerHTML = name + '{' + 'color:#ff5 !important;' + '}';
        document.getElementsByTagName('head')[0].appendChild(cssx);

        let r = _.assign(this.props.style, this.props.style.custom.style)
        return r
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shape-o {
    border: 1px solid #c0009a;
  }

  .self {
    padding: 3px 6px;
    position: relative;
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
