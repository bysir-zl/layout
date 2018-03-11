<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>

    <div id="list--demo" class="demo">
      <button v-on:click="shuffle">Shuffle</button>
      <button v-on:click="add">Add</button>
      <button v-on:click="remove">Remove</button>
      <transition-group name="list" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-item"
    >
      {{ item }}
    </span>
      </transition-group>
    </div>


    <show-top-and-bottom>

    </show-top-and-bottom>
  </div>
</template>

<script>
  import ShowTopAndBottom from "./ShowTopAndBottom.vue"
  export default {
    name: 'HelloWorld',
    components:{
      "show-top-and-bottom":ShowTopAndBottom
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        nextNum: 10
      }
    },
    methods: {
      randomIndex: function () {
        return Math.floor(Math.random() * this.items.length)
      },
      add: function () {
        this.items.splice(this.randomIndex(), 0, this.nextNum++)
      },
      remove: function () {
        this.items.splice(this.randomIndex(), 1)
      },
      shuffle: function () {
        this.items = _.shuffle(this.items)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  /*知识点: vue使用flip的技术实现定位的移动动画, flip的原理是计算当前帧所有元素的位置, 然后添加上css再计算出所有元素的位置,
然后使用反转(Invert)偏移量去抵销第二次的位置, 让元素看起来还是在第一次的位置,
现在添加一个transition: all就能实现元素从第一个位置变换到第二个位置的过渡*/
  /*在vue中, 猜想第一帧是动画前,整个dom和css都没有修改的帧. 第二帧是 list-leave-active 和v-enter */

  /*那么在这个例子中,在添加时 第一个帧是原始list, 第二帧是添加上了v-enter的插入了新元素的帧*/
  /*在删除元素是 第一帧是原始list, 第二帧是待删除原始添加上list-leave-active的帧, 也就是absolute*/
  .list-item {
    transition: all 20s;
    display: inline-block;
    margin-right: 10px;
  }

  .list-enter, .list-leave-active {
    opacity: 0.5;
    transform: translateY(30px);
  }

  .list-leave-active {
    position: absolute;
  }

</style>
