import processCssJs from "../../util/postcss_js";

const MyPlugin = {
  install(Vue, options) {
    // 一个app只有一个css集合
    // 保存所有提交的cssjs
    Vue.$cssJs = {}

    // 保存渲染后的css
    Vue.$cssRendered = {}

    // 添加组件css
    Vue.component('bind-css', {
      template:
      '<div>' +
      '<div v-for="(value,key) in style" :key="key" v-html="value"></div>' +
      '</div>',
      name: "BindCss",
      computed: {
        style() {
          return Vue.$cssRendered
        }
      }
    })

    function processCssJsWithRoot(css, root) {

    }

    // 添加基本方法
    Vue.prototype.$css = {
      // 添加, 可通过root传递css变量
      commit(key, value) {
        Vue.$cssJs[key] = value

        let css = {}
        css[key] = value

        let html = this.renderCssJs(css)
        Vue.set(Vue.$cssRendered, key, html)
      },
      // 设置css变量, 注意设置变量后会重新渲染整个css
      setRoot(root){
        this.root = root
      },
      renderCssJs(css){
        if (this.root) {
          css[":root"] = this.root
        }

        return "<style>" + processCssJs(css) + "</style>"
      },

      // 重新渲染整个css, 通常是root变量变化了之后需要这样做.
      rebuild(root) {
        Vue.$cssJs[":root"] = root

        return "<style>" + processCssJs(Vue.$cssJs) + "</style>"
      },
      // 将已经渲染好的css保存到localStorage, 供恢复
      save(version) {

      },
      // 获取最后一次保存的版本, 方便对比是否需要更新
      getLastSaveVersion() {

      },
      // 将保存的css恢复到dom上, 减少处理的时间
      restore() {

      }
    }
  }
}


export default MyPlugin
