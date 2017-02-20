<template lang="pug">
div
  mt-header(:title="room.name")
    mt-button(slot="left" icon="back" @click="leavlRoom") 离开房间
    mt-button(slot="right") 房间号 {{room.id}}
  .player-waiting
    .player-item(v-for="user,index in users", :key="user.id", :class="{master: index === 0, me: me.id === user.id}")
      .head {{user.username.substr(0,1)}}
      .username {{user.username}}
    .player-item.empty-item(v-for="emptyUser in emptyNumber")
      .head 空
      .username 等待加入
  .begin(v-if="isRoomMaster")
    mt-button(size="large" type="primary", :disabled="!canBegin", @click="beginGame") {{canBegin ? '开始游戏' : '至少两人才能开始'}}
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
      vm.$webSocket.request({id: to.params.id}, 'enterRoom').then(vm.enterSuccess)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'begin') {
      this.$webSocket.send({}, 'leaveRoom')
    }
    next()
  },
  data () {
    return {
      socketEvents: {
        roomClose: this.showBackError,
        roomFull: this.showBackError,
        userEnter (data) {
          this.refreshUser(data)
        },
        gameBegin ({id}) {
          this.$router.replace({name: 'begin', params: {id: id}})
        },
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
    me () {
      return this.$store.getters.user
    },
    users () {
      return Object.values(this.userMap)
    },
    isRoomMaster () {
      const userId = this.me.id
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
    beginGame () {
      this.$webSocket.send(null, 'beginGame')
    },
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
  display: flex;
  flex-wrap:wrap;
  text-align: center;
  @size: 40px;
  .head{
    position: relative;
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
    font-size: .8em;
    margin-top: .2em;
  }
  .empty-item{
    .head{
      background-color: @white;
      color: @main-color;
    }
  }
  .me{
    .head{
      &:after{
        position: absolute;
        left: 0;
        top: 0;
        content: "我";
        color: @main-color;
        background: @white;
        padding: 2px 4px;
        font-size: 10px;
      }
    }
  }
  .master{
    .head{
      &:before{
        position: absolute;
        left: 0;
        top: 0;
        content: "主";
        color: @main-color;
        background: @white;
        padding: 2px 4px;
        font-size: 10px;
      }
      &:after{
        left: 20px;
      }
    }
  }
}
.begin{
  padding: 0 2vw;
  margin-bottom: 2vw;
}
.player-item{
  width: 25%;
  padding: 2vw;
}
</style>
