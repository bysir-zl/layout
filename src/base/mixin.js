export default {
  style: {
    data() {
      return {
        x_classed: []
      }
    },
    computed: {
      style() { // 处理style
        let t = {}
        for (let i in this.props.style) {
          let v = this.props.style[i]

          // 你可以在组件中编写一个这样的函数, 来实现自定义样式
          /*
          * '$renderStyle'(key, value,style,classes) {
          switch (key) {
            // 对于自定义属性, 我们需要解析成内联style或者class
            case 'shape':
              classes.push('shape-' + value)
              return true
            default:
              return false
          }
        }
        */

          if (this['$renderStyle'] && this['$renderStyle'](i, v, t, this.x_classed)) {
            continue
          }
          t[i] = v
        }
        return t
      },
      classes() {
        return this.x_classed
      }
    },

  }
}
