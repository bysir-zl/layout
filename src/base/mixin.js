export default {
  style: {
    data() {

    },
    methods: {
      // 封装提交css方法
      commitCss(value) {
        if (!this.data.id) {
          console.warn("component must has unique id to use commit css")
          return
        }
        let key = "#v-" + this.data.id
        this.$css.add(key, value)
      }
    },
    computed: {
      // style只会在用户自定义style才会使用, 所以每个组件都是统一的
      style() {
        if (!this.data.design || !this.data.design.custom || !this.data.design.custom.style) {
          return []
        }

        return this.data.design.custom.style
      },
      // 计算要使用的class, 由 用户自定义 + 每个组件自己的逻辑 得到
      classes() {
        let base = []
        if (this.data.design) {
          if (this.data.design.custom && this.data.design.custom.classes) {
            base = this.data.design.custom.classes
          }
          if (this['$class']) {
            base = base.concat(this['$class']())
          }
        }
        return base
      },

      id() {
        return this.layout.i
      },
      data: {
        get() {
          return this.$store.state.view.items[this.id]
        },
        set(v) {
          this.$store.commit('view/updateItem', {id: v.id, data: v})
        }
      },
    }
  }
}
