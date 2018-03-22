import Vue from 'vue'
import Vuex from 'vuex'
import css from './css'
import view from './view'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    css,
    view,
  },
})

export default store
