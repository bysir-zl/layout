import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BindCss from './lib/bind-css'
import router from './router'
import Text from './components/Text.vue'
import Row from './components/Row.vue'
import Column from './components/Column.vue'
import Add from './components/Add.vue'
import Strip from './components/Strip.vue'
import EditBox from './components/EditBox.vue'
import Page from './components/Page.vue'
import store from './store'
import 'lodash'

// Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(BindCss)

// 将组件定义在全局, 这样各个递归组件才能方便的使用
Vue.component('z-text', Text)
Vue.component('row', Row)
Vue.component('column', Column)
Vue.component('add', Add)
Vue.component('strip', Strip)
Vue.component('edit-box', EditBox)
Vue.component('page', Page)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
