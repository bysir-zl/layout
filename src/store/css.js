import Vue from "vue"
import processCssJs from "../util/postcss_js"

const state = {
  style: {}, // 存放 某个组件对应的<style>标签
}

// getters
const getters = {}

// mutations
const mutations = {
  // 同一个key只会被添加一次
  add(state, {key, value}) {
    // 在添加css的时候处理一次, 优化负担

    // 这里添加一些变量...
    let css = {
      ":root": {"--primary-color": "#333"},
    }
    css[key] = value
    let html = "<style>" + processCssJs(css) + "</style>"

    Vue.set(state.style, key, html)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
