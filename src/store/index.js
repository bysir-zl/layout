import Vue from 'vue'
import Vuex from 'vuex'
import css from './css'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    css,
  },
})

export default store
