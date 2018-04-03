<!--列组件, 也就是横向布局容器-->
<template>
  <div class="self show-border editor-padding" @click="click" :style="style" :class="classes">
    <div class="row">
      <div v-for="(width,index) in widths" class="col" :class="'col-'+width">
        <component v-if="children[index]" :is="children[index].type" :params="children[index]"
                   @remove="remove(children[index].id)"></component>
      </div>
    </div>
    <div class="edit" ref="btn">edit column</div>

    <edit-box v-if="active" @close="active=false" :data="data" :config="editConfig" title="column"
              @input="onEdit" @save="onSave" @remove="$emit('remove')"></edit-box>
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
      'params',
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
              value: ['', ''],
            }]
          },
        }
      }
    },
    computed: {
      children() {
        let t = []
        if (this.params.children) {
          this.params.children.forEach((item, index) => {
            t.push(item)
          })
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
      onSave(s) {
        // todo column的数据改变,可能会影响到布局
        this.data = s

        bus.$emit(event.ItemChanged + this.data._layoutId, s)
      },
      remove(id) {
        let index = _.findIndex(this.data.children, i => i.id === id)
        if (index >= 0) {
          this.data.children.splice(index, 1)
        }
      },
      // 根据width修改儿子, 如果width大于儿子, 则需要填空.
      // 如果width小于儿子, 那么不需要删除儿子, 因为可能只是用户在预览.
      fullChildren() {
        let max = 0
        if (this.data.data && this.data.data.widths) {
          max = this.data.data.widths.length
        }
        let childrenCount = this.params.children.length
        let deleteCount = childrenCount - max

        if (deleteCount > 0) {

        } else if (deleteCount < 0) {
          // // 添加空row
          let addItems = []
          for (let i = 0; i < -deleteCount; i++) {
            addItems.push({id: 0, type: 'row'})
          }

          this.axios.post("/v1/item/multi", addItems).then(({data}) => {
            let newItems = []
            data.forEach((item) => {

              item._layoutId = this.data._layoutId
              newItems.push({id: item.id, type: 'row', data: item, children: []})
            })
            this.params.children.splice(childrenCount, 0, ...newItems)

            bus.$emit(event.LayoutChanged + this.data._layoutId)

          })
        }
      }
    },
    mounted() {
      this.fullChildren()
    },
    watch: {
      'data'(n, o) {
        if (n === o) {
          return
        }

        console.log('column data changed')
        this.fullChildren()
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
