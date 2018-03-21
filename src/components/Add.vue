<template>
  <div class="add container" :class="{'add-open':open}">
    <div v-if="!open">
      <div class="line"></div>
      <span class="tips" @click="doOpen">点我添加东西</span>
    </div>
    <div v-else>
      <div class="add-list">
        <span @click="add({type: 'row', children: []})">添加行</span>
        <span @click="add({type: 'column',data:{widths:['','','']}, children: []})">添加列</span>
        <span @click="add({type:'z-text',data:{text:'点击编辑'}})">添加文本</span>
      </div>
    </div>
  </div>
</template>

<script>
  // data:{in,index,must_be}

  import {bus,event} from '../util/event_bus'

  export default {
    name: 'Add',
    props: [
      'props',
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
        this.props.data.in.splice(this.props.data.index, 0, item)
        this.close()

        bus.$emit('edit-add', this.props.data)
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
    text-align: center;
    margin-bottom: -6px;
    margin-top: -6px;
    .line {
      position: absolute;
      top: 8px;
      width: 100%;
      background-color: #111;
      height: 6px;
      border-radius: 2px;
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
      padding: 20px 15px;
      background-color: #111;
      color: #fff;
    }
  }

</style>
