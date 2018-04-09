import Vue from 'vue'
export default {
  style: {
    data() {

    },
    methods: {
      // 封装提交css方法
      commitCss(value) {
        if (!this.id) {
          console.warn("component must has unique id to use commit css")
          return
        }
        let key = "#item-" + this.id
        this.$css.add(key, value)
      }
    },
    computed: {
      // style只会在用户自定义style才会使用, 所以每个组件都是统一的
      style() {
        // return {}
        if (!this.item.design || !this.item.design.custom || !this.item.design.custom.style) {
          return []
        }

        return this.item.design.custom.style
      },
      // 计算要使用的class, 由 用户自定义 + 每个组件自己的逻辑 得到
      classes() {
        // return []
        let base = []
        if (this.item.design) {
          if (this.item.design.custom && this.item.design.custom.classes) {
            base = this.data.design.custom.classes
          }
        }
        if (this['$class']) {
          base = base.concat(this['$class']())
        }
        return base
      },

      id() {
        return this.params.layout.i
      },
      item:{
        get() {
          return this.params.items[this.params.layout.i]
        },
        set(v) {
          Vue.set(this.params.items,v.id,v)
        }
      },
    }
  }
}
