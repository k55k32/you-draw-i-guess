<template lang="pug">
div
  mt-header(:title="`游戏名称: ${room.name}`")
    mt-button(slot="left" icon="back" @click="leavlRoom") 离开房间
    mt-button(slot="right") 房间号 {{room.id}}
  .player-waiting
    .player-item(v-for="user in userMap", :key="user.id")
      .head {{user.username.substr(0,1)}}
      .username {{user.username}}
    .player-item.empty-item(v-for="emptyUser in emptyNumber")
      .head 空
      .username 等待加入
  .begin(v-if="isRoomMaster")
    router-link(:to="{ name: 'begin' }", tag="span" v-if="canBegin")
      mt-button(size="large" type="primary") 开始游戏
    mt-button(size="large" type="primary" disabled v-else) 至少两人才能开始
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
  beforeRouteLeave (to, from, next) {
    this.$webSocket.send({}, 'leaveRoom')
    next()
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
  computed: {
    users () {
      return Object.values(this.userMap)
    },
    isRoomMaster () {
      const userId = this.$store.getters.user.id
      const firstUser = this.users[0]
      return firstUser && (firstUser.id === userId)
    },
    canBegin () {
      return this.users.length > 1
    },
    emptyNumber () {
      const users = this.users
      let number = 8
      if (this.room.playNumber) {
        number = this.room.playNumber - users.length
      }
      return number
    }
  },
  methods: {
    showBackError (data) {
      this.loaded()
      this.$router.replace('/')
      this.$message(data.message)
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
@import "~assets/less/base.less";
.player-waiting{
  padding-top: 5vw;
  display: flex;
  flex-wrap:wrap;
  text-align: center;
  @size: 40px;
  .head{
    width: 100%;
    height: 18vw;
    color: @white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10vw;
    background-color: @main-color;
  }
  .username{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    color: @main-color;
    margin: .8em 0;
  }
  .empty-item{
    .head{
      background-color: @white;
      color: @main-color;
    }
  }
}
.begin{
  padding: 0 5vw;
}
.player-item{
  width: 25%;
  padding: 2vw;
}
</style>
