<!--列组件, 也就是横向布局容器-->
<template>
  <div class="self show-border editor-padding" @click="click" :style="style" :class="classes">
    <div class="row">
      <div v-for="(item,index) in children" class="col" :class="'col-'+widths[index]">
        <component :is="item.type" :layout="item"></component>
      </div>
    </div>
    <div class="edit" ref="btn">edit column</div>

    <edit-box v-if="active" @close="active=false" :data="data" :config="editConfig" title="column"
              @input="onEdit"></edit-box>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'
  import util from '../util'

  // data:{widths:[4]}
  export default {
    name: 'Column',
    mixins: [mixin.style],
    props: [
      'layout',
    ],
    data() {
      return {
        active: false,
        editConfig: {
          'data.widths': {
            label: '列数',
            type: 'enum',
            options: [{
              label: '1',
              value: [''],
            }, {
              label: '2',
              value: ['',''],
            }]
          },
        }
      }
    },
    computed: {
      children() {
        let t = []
        if (this.data.widths.length!==this.layout.c.length){

        }
        for (let index in this.layout.c) {
          let c = {...this.layout.c[index]}

          // 读取item的type
          let cid = this.layout.c[index].i
          let item = this.$store.state.view.items[cid]
          if (!item) {
            console.log("item id " + cid + " can't found in items, but it used in layout")
            continue
          }
          c.type = item.type

          t.push(c)
        }

        return t
      },
      widths() {
        return this.data.data.widths
      }
    },
    methods: {
      click(e) {
        if (e.target !== this.$refs.btn) {
          return
        }
        e.stopPropagation()

        this.active = true
        bus.$emit(event.SomethingClicked, this)

        bus.$once(event.SomethingClicked, (components) => {
          if (components === this) {
            return
          }
          this.active = false
        })

      },
      onEdit(s) {
        this.data = s
      },
      setNum(num) {
        let t = []
        for (let i = 0; i < num; i++) {
          t.push("")
        }
        let s = _.cloneDeep(this.data)
        if (!s.data) {
          s.data = {widths: t}
        } else {
          s.data.widths = t
        }

        this.$store.commit('view/updateItem', {id: this.id, data: s})
      },
      modifyChildren() {
        // 根据width修改儿子
        let max = 0
        if (this.data.data && this.data.data.widths) {
          max = this.data.data.widths.length
        }
        let childrenCount = this.layout.c ? this.layout.c.length : 0
        let deleteCount = childrenCount - max

        if (deleteCount > 0) {
          // // 多余的children删除掉
          // console.log(this.layout.c, deleteCount)
          // // 不应该在循环中操作与循环相关的变量, 所以用一个列表把要删除的收集起来一起删除
          // let delIds = []
          //
          // for (let i = 0; i < deleteCount; i++) {
          //   let item = this.layout.c[max + i]
          //   delIds.push(item.i)
          // }
          //
          // this.$store.commit('view/removeItemWithLayout', {parentId: this.id, ids: delIds})

        } else if (deleteCount < 0) {
          // 添加空row
          let newItems = []
          for (let i = 0; i < -deleteCount; i++) {
            let itemId = util.genId()
            newItems.push({id: itemId, type: 'row'})
          }

          this.$store.commit('view/addItemWithLayout', {parentId: this.id, index: childrenCount, items: newItems})
        }
      }
    },
    mounted() {
      this.modifyChildren()
    },
    watch: {
      'data'(n, o) {
        // 在view.items变化后, 不知道为什么会触发这个data的改变, 但是新旧是一样的, 所以解决办法就是判断一下.
        if (n === o) {
          return
        }
        console.log('column data changed')
        this.modifyChildren()
      }
    }

  }
</script>

<style scoped lang="less">
  .self {
    position: relative;
  }

  .edit {
    cursor: pointer;
    /*position: absolute;*/
    height: 24px;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: #64a4ff;
    color: #fff;
    text-align: center;
  }


</style>
