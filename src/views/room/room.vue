<template lang="pug">
div
  mt-header(:title="room.name")
    mt-button(slot="left" icon="back" @click="leavlRoom") 离开房间
    mt-button(slot="right") 房间号 {{room.id}}
  .player-waiting
    player-item(v-for="user,index in users", :key="user.id", :user="user", :class="{master: index === 0, me: me.id === user.id}")
      .head {{user.username.substr(0,1)}}
      .username {{user.username}}
    .player-item.empty-item(v-for="emptyUser in emptyNumber")
      .head 空
      .username 等待加入
  .begin(v-if="isRoomMaster")
    mt-button(size="large" type="primary", :disabled="!canBegin", @click="beginGame") {{canBegin ? '开始游戏' : '至少两人才能开始'}}
  chat(showList="1")
</template>
<!-- 进入房间后自动坐下，房主可开始游戏 -->
<script>
import PlayerItem from './PlayerItem'
import Chat from '~/views/play/chat'
export default {
  components: { Chat, PlayerItem },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loading()
      vm.$webSocket.request({id: to.params.id}, 'enterRoom').then(vm.enterSuccess).catch(e => {
        vm.$message(e.msg)
        vm.$router.replace('/')
      })
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
      this.$router.replace('/')
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
