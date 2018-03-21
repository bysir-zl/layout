export default {
  style: {
    data() {

    },
    methods: {
      // 封装提交css方法
      commitCss(value) {
        if (!this.props.id) {
          console.warn("component must has unique id to use commit css")
          return
        }
        let key = "#v-" + this.props.id
        this.$css.add(key, value)
      }
    },
    computed: {
      // style只会在用户自定义style才会使用, 所以每个组件都是统一的
      style() {
        if (!this.props.design || !this.props.design.custom || !this.props.design.custom.style) {
          return []
        }

        return this.props.design.custom.style
      },
      // 计算要使用的class, 由 用户自定义 + 每个组件自己的逻辑 得到
      classes() {
        let base = []
        if (this.props.design) {
          if (this.props.design.custom && this.props.design.custom.classes) {
            base = this.props.design.custom.classes
          }
          if (this['$class']) {
            base = base.concat(this['$class']())
          }
        }
        return base
      },
      // hack, 当props.design.css变化时会自动调用.
      css() {
        if (this.props.design) {
          if (this['$bindCss']) {
            let c = this['$bindCss'](this.props.design.css)
            this.commitCss(c)
          }
        }
      }
    }
  }
}
