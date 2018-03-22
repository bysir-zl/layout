import processCssJs from "./postcss_js";

export default {
  install(Vue, options) {
    // 一个app只有一个css集合
    let status = new Vue({
      data() {
        return {
          // 保存渲染后的css
          cssRendered: {},
          // 保存所有提交的cssjs
          cssJs: {}
        }
      }
    })

    // 添加组件css
    Vue.component('bind-css', {
      template:
      '<div class="css">' +
      '<div v-for="(value,key) in style" :key="key" v-html="value"></div>' +
      '</div>',

      name: "BindCss",
      data() {
        return {}
      },
      computed: {
        style() {
          return status.cssRendered
        }
      }
    })

    // 添加基本方法
    Vue.prototype.$css = {
      // 添加样式, 如给#id1 添加 {color:#fff}, key就是#id1, value就是{"color":"#fff"}
      add(key, value) {
        status.cssJs[key] = value

        let css = {}
        css[key] = value

        let html = this._renderCssJsItem(css)
        Vue.set(status.cssRendered, key, html)
      },
      // 设置css变量, 注意设置变量后会重新渲染整个css
      setRoot(root) {
        this.root = root

        for (let k in status.cssJs) {
          let v = status.cssJs[k]
          // todo
        }
      },
      _renderCssJsItem(css) {
        if (this.root) {
          css[":root"] = this.root
        }

        return "<style>" + processCssJs(css) + "</style>"
      },

      // 重新渲染整个css, 通常是root变量变化了之后需要这样做.
      rebuild() {
        return this._renderCssJsItem(status.cssJs)
      },
      // 将已经渲染好的css保存到localStorage, 供恢复
      save(version) {
        let x = this.rebuild()
        console.log(x)
        localStorage.setItem("bind-css-style", x)
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


