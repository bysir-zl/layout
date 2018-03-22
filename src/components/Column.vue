<!--列组件, 也就是横向布局容器-->
<template>
  <div class="self show-border editor-padding" @click="click" :style="style" :class="classes">
    <div class="row">
      <div v-for="(item,index) in children" class="col" :class="'col-'+widths[index]">
        <component :is="item.type" :layout="item"></component>
      </div>
    </div>
    <div class="edit" ref="btn">edit column</div>

    <div v-if="active">
      <div class="editor-box">
        <div class="info">column</div>
      </div>
      <div class="editor-fixed">
        <div class="head">
          edit column
          <div class="button-content button-close" @click="active=false">
            <svg width="25" height="25" viewBox="0 0 25 25">
              <path
                d="M11.793 12.5L8.146 8.854 7.793 8.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646z"></path>
            </svg>
          </div>
        </div>
        <div class="body">
          <div class="num">
            <span @click="setNum(1)">1</span>
            <span @click="setNum(2)">2</span>
            <span @click="setNum(3)">3</span>
            <span @click="setNum(4)">4</span>
            <span @click="setNum(5)">5</span>
          </div>
        </div>
      </div>
    </div>
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
      }
    },
    computed: {
      children() {
        let t = []
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
        e.stopPropagation()
        bus.$emit(event.SomethingClicked, this)

        if (e.target === this.$refs.btn) {
          this.active = true
        }

        bus.$once(event.SomethingClicked, (components) => {
          if (components === this) {
            return
          }
          this.active = false
        })

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
          // 多余的children删除掉
          for (let i = 0; i < deleteCount; i++) {
            let item = this.layout.c[max + i]
            this.$store.commit('view/removeItemWithLayout', {parentId: this.id, id: item.i})
          }
        } else if (deleteCount < 0) {
          // 添加空row
          let items = []
          for (let i = 0; i < -deleteCount; i++) {
            let itemId = util.genId()
            items.push({id: itemId, type: 'row'})
          }

          this.$store.commit('view/addItemWithLayout', {parentId: this.id, index: childrenCount, items})
        }
      }
    },
    mounted() {
      this.modifyChildren()
    },
    watch: {
      'data'() {
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

  .editor-box {
    position: absolute;
    display: block;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    top: -2px;
    left: -2px;
    pointer-events: none;

    border: 1px solid #64a4ff;
    .info {
      position: absolute;
      background-color: #64a4ff;
      font-size: 13px;
      height: 15px;
      line-height: 15px;
      top: -15px;
      left: -1px;
      border-radius: 0;
      padding: 0 4px;
      color: #fff;
    }
  }

  .editor-fixed {
    position: fixed;
    right: 50px;
    top: 50px;
    width: 300px;
    height: 600px;
    overflow-y: auto;
    background-color: #fff;
    z-index: 100;

    box-shadow: 0 0 18px 0 rgba(22, 45, 61, 0.27);
    border-radius: 10px;

    .head {
      padding: 10px;
      background-color: #64a4ff;
      color: #fff;
      .button-close {
        cursor: pointer;
        background-color: #4e7dc5;
        border-radius: 999px;
        float: right;
        height: 25px;
        svg {
          fill: #fff;
        }
      }
    }
    .body {
      padding: 10px;
      .num {
        > span {
          display: inline-block;
          background-color: rgba(100, 164, 255, 0.6);
          color: #fff;
          width: 20px;
          height: 20px;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
