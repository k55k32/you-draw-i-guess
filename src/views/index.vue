<template lang="pug">
  div.container.index
    div.user-info 用户信息
    div.room-list
      mt-loadmore(:top-method="loadTop", :bottom-method="loadBottom", :bottom-all-loaded="allLoad" ref="loadmore") 房间列表
        div(v-for="r in roomList") 房间{{r}}
</template>

<script>
export default {
  computed: {
    loadEL () {
      return this.$refs.loadmore
    }
  },
  data () {
    return {
      roomList: 50,
      allLoad: false
    }
  },
  methods: {
    loadTop () {
      this.refresh()
      this.loadEL.onTopLoaded()
    },
    loadBottom () {
      this.loadMore()
      this.loadEL.onBottomLoaded()
    },
    loadMore () {
      console.log('load-more')
      this.roomList *= 3
    },
    refresh () {
      console.log('refresh')
      this.roomList = 1
    }
  }
}
</script>

<style lang="less">
.index.container{
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-list{
    flex: 1;
    overflow: auto;
  }
}
</style>
