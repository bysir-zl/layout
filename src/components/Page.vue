<!--页面, 也就是纵向布局容器-->

<template>
  <row :params="params">
  </row>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  // data:{}
  export default {
    name: 'Page',
    mixins: [mixin.style],
    props: [
      'params',
    ],

    data() {
      return {}
    },
  }
</script>

<style scoped lang="less">
  .placeholder {
    padding: 20px 10px;
  }

</style>
