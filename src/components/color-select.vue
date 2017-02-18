<template lang="pug">
  div.color-select
    div(v-for="c, index in colors")
      span.color-item(:style="{background: c, border: getBorder(c)}")(:class="{selected: index === currentColor}")(@click="selectColor(index)")
</template>

<script>
export default {
  data () {
    return {
      currentColor: 12,
      colors: [
        '#F44336', '#E91E63', '#9C27B0', '#2196F3', '#48C6FF', '#4CAF50',
        '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#795548', '#607D8B',
        '#000', '#666', '#999', '#BBB', '#DDD', '#FFF'
      ]
    }
  },
  methods: {
    getBorder (color) {
      if (color === '#FFF') return '1px solid #ccc'
      return ''
    },
    selectColor (index) {
      this.currentColor = index
      this.$emit('select-color', this.colors[index])
    }
  }
}
</script>

<style lang="less">
.color-select{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 5vw;
  padding-bottom: 0;
  &>div{
    width: 100 / 6%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5vw;
  }
  @item-size:10vw;
  .color-item{
    width: @item-size;
    height: @item-size;
    display: block;
    border-radius: 50%;
    &.selected{

    }
  }
}
</style>
