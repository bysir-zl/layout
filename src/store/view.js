import Vue from "vue"

const state = {
  layout: [],
  items: {}
}

// getters
const getters = {}

function getParent(id, layout) {
  for (let i in layout) {
    let c = layout[i]
    if (c.i === id) {
      return c
    }

    if (c.c) {
      let r = getParent(id, c.c)
      if (r) {
        return r
      }
    }
  }
}

// mutations
const mutations = {
  // 更新整个items
  updateItem(state, {id, data}) {
    Vue.set(state.items, id, data)
  },
  // 设置视图
  setView(state, {layout, items}) {
    state.layout = layout
    state.items = items
  },
  // 更新layout
  updateLayout(state, layout) {
    state.layout = layout
  },
  // 删除元素, 并更新layout
  // 这里不会删除元素的儿子, 元素的儿子会被GC清除掉
  removeItemWithLayout(state, {parentId, id}) {
    delete state.items[id]

    parent = getParent(parentId, state.layout)
    if (parent) {
      let index = _.findIndex(parent.c, ({i}) => {
        return i === id
      })
      if (index >= 0) {
        parent.c.splice(index, 1)
      }

    }
  },
  // 添加多个item, 并更新layout
  // items:  [{id:1,data:{text:'hh'}}]
  addItemWithLayout(state, {parentId, index, items}) {
    // 计算并更新layout
    let parent = getParent(parentId, state.layout)
    if (!parent) {
      console.warn("can't found parent(id: " + parentId + "), add item fail")
      return
    }

    let newLayout = _.map(items, function (e) {
      return {i: e.id}
    })

    if (!parent.c) {
      Vue.set(parent, 'c', newLayout)
    } else {
      parent.c.splice(index, 0, ...newLayout)
    }

    // 更新items
    for (let i in items) {
      let item = items[i]
      Vue.set(state.items, item.id, item)
    }

  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
