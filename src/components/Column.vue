<!--列组件, 也就是横向布局容器-->
<template>
  <div class="self show-border editor-padding" :style="style" :class="classes">
    <div class="pin" @click="click" @mouseenter="mouseenter" @mouseleave="mouseleave"  @dragstart="dragstart">
      <span class="pin-icon">
        <span v-if="active || preActive" class="pin-name">col</span>
      </span>
    </div>

    <div class="row">
      <div v-for="(width,index) in widths" class="col" :class="'col-'+width">
        <template v-if="params.layout.c[index] && params.items[params.layout.c[index].i]">
          <!--如果是布局组件，则使用布局组件的布局-->
          <component
            v-if="params.items[params.layout.c[index].i].type!=='layout'"
            :params="{items:params.items,layout:params.layout.c[index]}"
            :root="root"
            @remove="remove(params.layout.c[index].i)">
          </component>

        </template>
      </div>
    </div>

    <div :class="{'active':active,'pre-active':!active && preActive}" v-if="active || preActive"></div>
  </div>
</template>

<script>
  import mixin from '../base/mixin.js'
  import {bus, event} from '../util/event_bus'

  // data:{widths:[4]}
  export default {
    name: 'Column',
    mixins: [mixin.style],
    props: [
      'params',
      'root',
    ],
    data() {
      return {
        active: false,
        preActive: false,
        editConfig: [
          {
            key: 'data.widths',
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
        ],
        openPin: false,
      }
    },
    computed: {
      widths() {
        return this.item.data.widths
      },
      item() {
        return this.params.items[this.params.layout.i]
      }
    },
    methods: {
      click(e) {
        bus.$emit(event.EditorBoxOpen, {
          data: this.item,
          config: this.editConfig,
          onInput: this.onEdit,
          onSave: this.onSave,
          onClose: () => {
            this.active = false
          },
          onOpen: () => {
            this.active = true
          },
          title: 'text',
        })
      },
      dragstart(e) {
        this.$emit("dragstart",e)
      },
      mouseenter() {
        this.preActive = true
        console.log('mouseenter')
      },
      mouseleave() {
        this.preActive = false
        console.log('mouseleave')
      },
      onEdit(s) {
        this.item = s
      },
      onSave(s) {
        // todo column的数据改变,可能会影响到布局
        this.item = s
        this.root.updateItem(s)

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
        if (this.item.data && this.item.data.widths) {
          max = this.item.data.widths.length
        }
        let childrenCount = this.params.layout.c.length
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
      'item'(n, o) {
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
    padding-top: 12px;
    position: relative;
  }

  .active {
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);

    border: 1px solid #35b1eb;
  }

  .pre-active {
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);

    border: 1px dashed #35b1eb;
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

  .pin {
    position: absolute;
    left: 1px;
    top: 1px;
    z-index: 10;
    line-height: 10px;
    .pin-icon {
      display: inline-block;
      min-width: 10px;
      height: 10px;
      border-radius: 10px;
      background-color: #35b1eb;
      cursor: pointer;
      content: '';
    }
    .pin-name {
      font-size: 12px;
      color: #fff;
      padding: 0px 3px;
    }
  }

</style>
