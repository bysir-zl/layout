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
          cssJs: {},
          cssAll: '',
        }
      }
    })

    // 添加组件css
    Vue.component('bind-css', {
      template:
      '<div class="css">' +
      '<div v-html="cssAll"></div>' +
      '<div v-for="(value,key) in style" :key="key" v-html="value"></div>' +
      '</div>',

      name: "BindCss",
      data() {
        return {}
      },
      computed: {
        style() {
          return status.cssRendered
        },
        cssAll() {
          return status.cssAll
        }
      }
    })

    // 添加基本方法
    Vue.prototype.$css = {
      locked: false,

      // 添加样式, 如给#id1 添加 {color:#fff}, key就是#id1, value就是{"color":"#fff"}
      add(key, value) {
        if (this.locked) {
          return
        }

        status.cssJs[key] = value

        let css = {}
        css[key] = value

        let html = this._renderCssJsItem(css)
        Vue.set(status.cssRendered, key, html)
      },
      // 设置css变量, 注意设置变量后会重新渲染整个css
      setRoot(root) {
        if (this.locked) {
          return
        }
        this.root = root

        for (let k in status.cssJs) {
          let css = {}
          css[k] = status.cssJs[k]
          let html = this._renderCssJsItem(css)
          Vue.set(status.cssRendered, k, html)
        }
      },
      _renderCssJsItem(css) {
        if (this.root) {
          css[":root"] = this.root
        }

        return "<style>" + processCssJs(css) + "</style>"
      },

      // 生成一个大的css
      buildAdd() {
        return this._renderCssJsItem(status.cssJs)
      },
      // 将已经渲染好的css保存到localStorage, 供恢复
      save(version) {
        let x = this.buildAdd()
        localStorage.setItem("bind-css-css", x)
        localStorage.setItem("bind-css-version", version)
      },
      // 获取最后一次保存的版本, 方便对比是否需要更新
      getLastSaveVersion() {
        return localStorage.getItem("bind-css-version")
      },
      // 将保存的css恢复到dom上, 减少处理的时间
      // 一般来说, restore使用在不需要add代码的时候, 所以为了防止性能消耗, 应当与lock一同使用
      restore() {
        status.cssAll = localStorage.getItem("bind-css-css")
      },
      // 锁定css, 锁定后不能再add
      lock() {
        this.locked = true
      },
      // 解锁
      unlock() {
        this.locked = false
      }
    }
  }
}


