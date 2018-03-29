import Vue from 'vue'

let bus = new Vue({})

const event = {
  SomethingClicked: 'SC',// 一些东西被点击了, 全局使用. 用来实现一个item的激活与不激活
  ItemChanged: 'IC:', // 某个item的数据改变了, body{id:1,data:{id:1,type:'',data:{}}}. 在一个布局器中使用, 这个key后需要跟上布局器id
  ItemAdded: 'IA:', //
  ItemRemove: 'IR:', //
  LayoutChanged: 'LC:' // layout改变了, body{layout:[]}. 在一个布局器中使用, 这个key后需要跟上布局器id
}

export {
  bus,
  event
}
