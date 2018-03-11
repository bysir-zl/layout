<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
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
<style scoped lang="less">
  .hello {
    position: relative;
    &:after {
      position: absolute;
      opacity: 0;
      display: block;
      content: "+";
      width: 100%;
      height: 12px;
      bottom: -6px;
      border: 1px solid #000000;
      background-color: #111;
      border-radius: 4px;
      color: #fff;
      //content: url("/static/b.png");
    }
    &:hover:after{
      opacity: 1;
    }
  }

</style>
