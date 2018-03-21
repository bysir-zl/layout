<!--列组件, 也就是横向布局容器-->
<template>
  <div class="self show-border editor-padding" @click="click" :style="style" :class="classes">
    <div class="row">
      <div v-for="(item,index) in children" class="col" :class="'col-'+widths[index]">
        <component :is="item.type" :props="item"></component>
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
  import {bus,event} from '../util/event_bus'

  // data:{widths:[4]}
  export default {
    name: 'Column',
    mixins: [mixin.style],
    props: [
      'props',
    ],
    data() {
      return {
        active: false,
      }
    },
    computed: {
      children() {
        // 儿子由widths影响, widths有几个就会显示几个,不足填充空column-item
        let t = []
        let max = this.props.data.widths.length
        for (let i = 0; i < max; i++) {
          if (i < this.props.children.length) {
            t.push(this.props.children[i])
          } else {
            t.push({type: 'row', children: []})
          }
        }

        return t
      },
      widths() {
        return this.props.data.widths
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
        this.props.data.widths = t
      }
    },
    mounted() {

    },

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
