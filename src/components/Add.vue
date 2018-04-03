<template>
  <div class="add " :class="{'add-open':open}">
    <div v-if="!open" class="hover">
      <div class="line"></div>
      <span class="tips" @click="doOpen">点我添加东西</span>
    </div>
    <div v-else>
      <div class="add-placeholder-warp">
        <div class="add-placeholder"></div>
      </div>
      <div class="add-list">
        <div class="head">
          选择组件
          <div class="button-content button-close" @click="close">
            <svg width="25" height="25" viewBox="0 0 25 25">
              <path
                d="M11.793 12.5L8.146 8.854 7.793 8.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646z"></path>
            </svg>
          </div>
        </div>
        <div class="body">

        <span @click="add({type: 'row'})">添加行</span>
        <span @click="add({type: 'column',data:{widths:['','','']}})">添加列</span>
        <span @click="add({type:'z-text',data:{text:'点击编辑'}})">添加文本</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // data:{in,index,must_be}

  import {bus, event} from '../util/event_bus'
  import util from '../util'

  export default {
    name: 'Add',
    props: [
      'index',
    ],
    data() {
      return {
        open: false,
      }
    },
    methods: {
      doOpen(e) {
        this.open = true
        bus.$emit(event.SomethingClicked, this)
        e.stopPropagation()

        bus.$once(event.SomethingClicked, (components) => {
          if (components === this) {
            return
          }
          this.open = false
        })
      },
      close() {
        this.open = false
      },
      add(item) {
        item.id = util.genId()

        let d = {id: item.id, type: item.type, data: item, children: []}
        this.$emit('add', {index:this.index,item:d})
        this.close()
      }
    },
    computed: {
      data() {
        return this.params.data ? this.params.data : {}
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .add {
    z-index: 1;
    height: 22px;
    opacity: 0;
    /*这里不使用position relative的话， 会出现鼠标移上去会闪，不知道什么原理。*/
    position: relative;
    margin-bottom: -6px;
    margin-top: -6px;
    .hover{
      text-align: center;
      .line {
        position: absolute;
        top: 8px;
        width: 100%;
        background-color: #111;
        height: 6px;
        border-radius: 2px;
        pointer-events: none;
      }
      .tips {
        cursor: pointer;
        position: absolute;
        color: #fff;
        display: inline-block;
        width: 80px;
        background-color: #111;
        padding: 2px 4px;
        font-size: 12px;
        top: 0;
        margin-left: -40px;
        border-radius: 2px;
      }
    }


    &:hover {
      opacity: 1;
    }

    &.add-open {
      opacity: 1;
      height: auto;
      margin-bottom: 0;
      margin-top: 0;
    }
    .add-list {
      color: #fff;
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 320px;
      overflow-y: auto;
      background-color: #f6f6f6;
      z-index: 100;

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
    }
  }

  .add-placeholder-warp{
    margin: 5px 0;
    /*background-color: #111;*/
    .add-placeholder{
      /*border: 1px solid #64a4ff;*/
      box-shadow: 0px 0px 20px rgba(79, 101, 174, 0.15);

      /*border-radius: 10px;*/
      height: 60px;
      border: 1px dashed #afafaf;
      /*background-color: #f1f1f1;*/
      background: url("/static/add_bg_2.jpg");
      background-size: 30%;
      /*opacity: 0.9;*/
    }
  }


</style>
