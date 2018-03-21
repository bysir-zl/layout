import Vue from 'vue'

let bus = new Vue({})

const event = {
  SomethingClicked: 'SC',// 一些东西被点击了, 用来实现一个item的激活与不激活
  ItemChanged: 'IC', // 某个item改变了, body是整个item
  LayoutChanged: 'LC' // layout改变了, body是整个layout
}

export {
  bus,
  event
}
