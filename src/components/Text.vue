<template>
  <div class="self" data-comp="text" :id="'v-'+data.id">
    <div class="data" :style="style" :class="classes" @click="click">
      <div v-html="data.data.text"></div>
      <video v-if="data.design&&data.design.advanced.background&&data.design.advanced.background.type === 'video'"
             class="video-bg" loop autoplay :src="data.design.advanced.background.video"></video>
    </div>
    <edit-box v-if="active" @close="active=false" :data="data" :config="editConfig" title="text"
              @input="onEdit" @remove="$emit('remove')"></edit-box>
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
      'params',
    ],
    data() {
      return {
        active: false,
        editConfig: {
          'data.text': {
            label: '文本',
            type: 'fullText'
          },
          'design.advanced.background': {
            label: '背景',
            type: 'background'
          },
          'design.css["padding"]': {
            label: 'padding',
            type: 'color'
          },
          'design.css["margin"]': {
            label: 'margin',
            type: 'color'
          },
          'design.css["color"]': {
            label: '字体颜色',
            type: 'color'
          },
          'design.css["&:hover"].color': {
            label: 'hover字体颜色',
            type: 'color'
          },
          'design.model.shape': {
            label: '形状',
            type: 'enum',
            options: [{
              label: '普通',
              value: '-',
            }, {
              label: '圆形',
              value: 'o',
            }]
          },
        },

      }
    },
    computed: {},
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

      onEdit(s) {
        this.data = s
      },
      '$class'() {
        return obj2array(this.data.design.model, '-')
      },
      // 重新渲染, 一般在data改变后操作
      reRenderCss() {
        if (!this.data.design || !this.data.design.css) {
          return
        }
        // 处理高级样式
        let x = _.cloneDeep(this.data.design.css)
        if (this.data.design && this.data.design.advanced) {
          if (this.data.design.advanced.background.type === 'img') {
            x.background = 'url(' + this.data.design.advanced.background.img + ')'
          } else if (this.data.design.advanced.background.type === 'color') {
            x.background = this.data.design.advanced.background.color
          }
        }
        this.commitCss({".data": x})
      }
    },
    watch: {
      // 在data变化后需要生成新的css
      'data'(n, o) {
        if (n === o) {
          return
        }

        console.log('text data changed')
        this.reRenderCss()
      },
    },
    created() {
      this.reRenderCss()
    }
  }
</script>

<style scoped lang="less">
  .shape-o {
    border: 1px solid #c0009a;
    border-radius: 10px;
  }

  .self {
    position: relative;
  }

  .data {
    padding: 3px 6px;
    overflow: hidden;
    position: relative;
  }


</style>
