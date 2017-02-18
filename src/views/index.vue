<template lang="pug">
  div.index
    mt-header(title="你画我猜-游戏大厅")
      mt-button(slot="left" icon="search" @click="inputRoomNumber") 查找房间
      router-link(:to="{name:'create-room'}", slot="right")
        mt-button 创建房间
    user-info
    div.room-list
      mt-loadmore(:top-method="loadTop", :bottom-method="loadBottom", :bottom-all-loaded="allLoad" ref="loadmore") 房间列表
        div(v-for="r in roomList") 房间{{r}}
</template>

<script>
import UserInfo from './user/info'
export default {
  components: {UserInfo},
  computed: {
    loadEL () {
      return this.$refs.loadmore
    }
  },
  data () {
    return {
      roomList: 50,
      allLoad: false,
      user: {
        name: '玩家 001'
      }
    }
  },
  methods: {
    inputRoomNumber () {
      this.$messageBox.prompt('请输入房间号').then(({value}) => {
        this.$message('正在查找房间号' + value)
      })
    },
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
      this.roomList *= 2
    },
    refresh () {
      console.log('refresh')
      this.roomList = 1
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.index{
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-list{
    flex: 1;
    overflow: auto;
  }
}
</style>
