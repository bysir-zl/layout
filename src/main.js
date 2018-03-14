// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Text from './components/Text.vue'
import Row from './components/Row.vue'
import Column from './components/Column.vue'
import Add from './components/Add.vue'
import Strip from './components/Strip.vue'

Vue.config.productionTip = false

// 将组件定义在全局, 这样各个递归组件才能方便的使用
Vue.component('z-text', Text)
Vue.component('row', Row)
Vue.component('column', Column)
Vue.component('add', Add)
Vue.component('strip', Strip)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
