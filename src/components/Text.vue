<template>
  <div class="self" data-comp="text" :id="'v-'+data.id">
    <div v-html="data.data.text" class="data" :style="style" :class="classes" @click="click"></div>
    <edit-box v-if="active" @close="active=false" :data="data" :config="editConfig" title="text"
              @input="onEdit"></edit-box>
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
  import EditBox from "./EditBox.vue";

  export default {
    components: {EditBox},
    name: 'VText',
    mixins: [mixin.style],
    props: [
      'layout',
    ],
    data() {
      return {
        active: false,
        editConfig: {
          'data.text': {
            label: '文本',
            type: 'fullText'
          },
          'design.css["background-color"]': {
            label: '背景颜色',
            type: 'color'
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
            label: 'color',
            type: 'color'
          },
          'design.model.shape': {
            label: '形状',
            type: 'enum',
            options: [{
              label: '普通',
              value: '',
            }, {
              label: '圆形',
              value: 'o',
            }]
          },
        }
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

    },
    mounted() {

    },

    watch: {
      // 在data变化后需要生成新的css
      'data'(n, o) {
        if (n === o) {
          return
        }

        console.log('text data changed')

        if (!this.data.design || !this.data.design.css) {
          return
        }
        this.commitCss({".data": this.data.design.css})
      },
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
    border-radius: 10px;
  }

  .self {
    position: relative;
  }

  .data {
    padding: 3px 6px;
    overflow: hidden;
  }


</style>
