<template>
  <div class="self" data-comp="text" @click="click" :id="'v-'+props.id" :style="style" :class="classes">
    <div v-html="props.data.text" class="data"></div>
    <div class="editor-box" v-if="active">
      <div class="info">text</div>
      <div class="editor-fixed">
        <div v-html="props.data.text"></div>
        <div @click="editClick">click</div>
      </div>
    </div>
  </div>
</template>

<script>
  // 组件上需要data-comp属性标记它是一个组件, 方便在点击事件时激活它
  //  'data', // 整个组件的数据
  //    'style', // 样式, 可自定义或者原生属性
  //    'methods', // 用户自定义事件(js)

  // 由于vue不支持数据驱动css, 所以我们用postcss做一个数据驱动的css:)
  // <style>也是一个dom, 最小颗粒的就是一个<style>标签. 如果要做增量更新的话只能更新一个<style>

  import mixin from '../base/mixin.js'
  import bus from '../event_bus'
  import cssStore from '../store/css'

  export default {
    name: 'VText',
    mixins: [mixin.style],
    cssStore,
    props: [
      'props',
    ],
    data() {
      return {
        active: false,
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
      },
      editClick() {
        let key = "#v-" + this.props.id
        let value = this.props.design.css
        value["background-color"] = "#f00"

        this.$store.commit("addCss", {key: key, value: value})
      }
    },
    mounted() {

    },
    computed: {
      classes() {
        // 计算要使用的class, 由用户自定义+model得到
        let base = []
        if (this.props.design) {
          if (this.props.design.custom && this.props.design.custom.classes) {
            base = this.props.design.custom.classes
          }
          if (this.props.design.model) {
            base = base.concat(this.props.design.model)
          }
        }
        return base
      },

      style() {
        if (!this.props.design || !this.props.design.custom || !this.props.design.custom.style) {
          return []
        }

        return this.props.design.custom.style
      }
    },
    created() {
      if (!this.props.design || !this.props.design.css) {
        return ""
      }

      let key = "#v-" + this.props.id
      this.$store.commit("addCss", {key: key, value: this.props.design.css})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shape-o {
    border: 1px solid #c0009a;
    border-radius: 4px;
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
