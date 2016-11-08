<template lang="jade">
  div.lines-wrap
    div.lines-list(v-for="l in lines")
      div.line-number {{l}}
      div.line-width(:style="{height: l + 'px', background: color}")

</template>

<script>
export default {
  props: ['color'],
  data () {
    return {
      lines: [2, 4, 6, 8, 10, 12, 14, 16]
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
    background: #000;
    border-radius: 50px;
  }
}
</style>
