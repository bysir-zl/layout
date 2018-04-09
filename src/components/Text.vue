<template>
  <div class="self" data-comp="text" :id="'item-'+item.id">
    <div class="data" :style="style" :class="classes" @click="click">
      <div v-html="item.data.text"></div>
      <video v-if="item.design&&item.design.advanced.background&&item.design.advanced.background.type === 'video'"
             class="video-bg" loop autoplay :src="item.design.advanced.background.video"></video>
    </div>

  </div>
</template>

<script>

  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'
  import obj2array from '../util/obj2array'

  export default {
    name: 'VText',
    mixins: [mixin.style],
    props: [
      'params',
      'root',
    ],
    data() {
      return {
        active: false,
        editConfig: [
          {
            key: 'data.text',
            label: '文本',
            type: 'fullText'
          }, {
            key: 'design.advanced.background',
            label: '背景',
            type: 'background'
          }, {
            key: 'design.css["padding"]',
            label: 'padding',
            type: 'text'
          }, {
            key: 'design.css["margin"]',
            label: 'margin',
            type: 'text'
          }, {
            key: 'design.css["color"]',
            label: '字体颜色',
            type: 'color'
          }, {
            key: 'design.css["&:hover"].color',
            label: 'hover字体颜色',
            type: 'color'
          }, {
            key: 'design.model.shape',
            label: '形状',
            type: 'enum',
            options: [{
              label: '普通',
              value: '-',
            }, {
              label: '圆形',
              value: 'o',
            }]
          }
        ],
      }
    },
    computed: {},
    methods: {
      click(e) {
        bus.$emit(event.EditorBoxOpen, {
          data: this.item,
          config: this.editConfig,
          onInput: this.onEdit,
          onSave: this.onSave,
          title: 'text',
        })

//        this.active = true
//        bus.$emit(event.SomethingClicked, this)
//        e.stopPropagation()
//
//        bus.$once(event.SomethingClicked, (components) => {
//          if (components === this) {
//            return
//          }
//          this.active = false
//        })
      },

      onEdit(s) {
        this.item = s
      },
      onSave(s) {
        this.item = s
        this.root.updateItem(s)
//        bus.$emit(event.ItemChanged + this.data._layoutId, s)
      },
      '$class'() {
        if (!this.item.design) {
          return []
        }
        return obj2array(this.item.design.model, '-')
      },
      // 重新渲染, 一般在data改变后操作
      reRenderCss() {
        if (!this.item.design || !this.item.design.css) {
          return
        }
        // 当在发布模式下, css已经缓存下来了, 就不需要处理的.
        if (this.$css.locked) {
          return
        }

        // 处理高级样式
        let x = _.cloneDeep(this.item.design.css)
        if (this.item.design && this.item.design.advanced) {
          if (this.item.design.advanced.background.type === 'img') {
            x.background = 'url(' + this.item.design.advanced.background.img + ')'
          } else if (this.item.design.advanced.background.type === 'color') {
            x.background = this.item.design.advanced.background.color
          }
        }

        this.commitCss({".data": x})
      }
    },
    watch: {
      // 在data变化后需要生成新的css
      'item'(n, o) {
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
    cursor: pointer;
  }

  .data {
    padding: 3px 6px;
    overflow: hidden;
    position: relative;
  }


</style>
