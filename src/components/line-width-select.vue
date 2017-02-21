<template lang="pug">
  div.lines-wrap
    div.lines-list(v-for="l in lines")(@click="selectLine(l)")
      div.line-number {{l}}
      div.line-width(:style="{height: l + 'px', background: color}")
</template>

<script>
export default {
  props: ['color'],
  data () {
    return {
      lines: [2, 4, 6, 8, 10, 12, 16, 20]
    }
  },
  methods: {
    selectLine (line) {
      this.$emit('select-line', line)
    }
  }
}
</script>

<style lang="less">
.lines-wrap{
  padding: 2vw 10vw;
}
.lines-list{
  display: flex;
  align-items: center;
  text-align: center;
  .line-number{
    width: 10vw;
  }
  .line-width{
    flex: 1;
    box-sizing: content-box;
    background: #000;
    border-radius: 50px;
    border:1px solid #eee;
  }
}
</style>
