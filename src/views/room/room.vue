<template lang="pug">
div
  mt-header(:title="`游戏名称: ${room.name}`")
    mt-button(slot="left" icon="back" @click="leavlRoom") 离开房间
    mt-button(slot="right") 房间号 {{room.id}}
  .player-waiting.weui-cells
    .waiting-wrap.weui-flex
      .player-item(v-for="user in userMap")
        .weui-btn.weui-btn_primary 玩家{{user.username}}
    .begin
      router-link.weui-btn.weui-btn_primary(:to="{ name: 'begin' }") 开始游戏
  chat
</template>
<!-- 进入房间后自动坐下，房主可开始游戏 -->
<script>
import Chat from '~/views/play/chat'
export default {
  components: { Chat },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loading()
      vm.$webSocket.request({id: vm.$route.params.id}, 'enterRoom').then(vm.enterSuccess)
    })
  },
  mounted () {
    this.socketEvents['enterRoom'] = this.enterSuccess
  },
  data () {
    return {
      socketEvents: {
        roomClose: this.showBackError,
        roomFull: this.showBackError,
        userEnter: this.refreshUser,
        userLeave ({id}) {
          delete this.userMap[id]
          this.userMap = {...this.userMap}
        }
      },
      room: {},
      userMap: {},
      playerNumber: 8
    }
  },
  methods: {
    showBackError (data) {
      this.loaded()
      this.$router.replace('/')
      this.$messageBox.alert(data.message)
    },
    enterSuccess (data) {
      this.room = data
      this.loaded()
    },
    refreshUser (users) {
      const userMap = {}
      users.forEach(u => {
        userMap[u.id] = u
      })
      this.userMap = userMap
    },
    leavlRoom () {
      this.$webSocket.send({}, 'leaveRoom')
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.player-waiting{
  padding:5vw 0;
  .waiting-wrap{
    text-align: center;
    flex-wrap:wrap;
  }
  .begin{
    padding: 5vw 5vw;
  }
}
.player-item{
  width: 25%;
  padding: 2vw;
}
</style>
