<template lang="pug">
.game-begin
  mt-header
    div(slot="left") {{isCurrentPlay ? '请画: ' : '提示: '}} {{gameData.key}} {{typeName}}
    div(slot="right") {{countTime}}
  draw(:can-draw="isCurrentPlay", :image-data="gameData.imageData", ref="draw")
    .fiexd-msg-list(slot="ondraw" ref="msgScroll", :style="{opacity:messageListShow ? 1 : 0}")
      .msg-auto-scroll
        .msg-list-all(ref="msgList")
          span(v-for="msg in msgList", :class="msg.type") {{msg.msg}}
  chat(@receive="showMessage" v-show="!isCurrentPlay" ref="chat")
  .player-list-wrap
    .player-list(:style="{width:users && users.length * 25 + '%'}")
      player-item(v-for="user in users", :user="user", :class="{me: user.id === currentUser, draw: user.id === currentPlay, leave: isOffline(user.id)}")
  mt-popup(v-model="isShowAnswerCard")
    .answer-card(@click="hideAnswerCart")
      div
        span 答案是:
        span.answer {{this.currentAnswer}}
      .quick-send 点击快捷发送:
        p(v-for="msg in quickSend" @click="sendMsg(msg)") {{msg}}
  mt-popup(v-model="isShowGameOver")
    .answer-card
      .quick-send
        p(v-for="u,index in gameOverData") 第{{index+1}}名: {{u.username}} {{u.score}}分
      mt-button(size="large" type="primary" @click="goBackToRoom") 返回房间
</template>

<script>
import Draw from './draw'
import Chat from './chat'
import PlayerItem from '../room/PlayerItem'
export default {
  components: { Draw, Chat, PlayerItem },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getGameData()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.stopAutoScroll()
    next()
  },
  data () {
    return {
      socketEvents: {
        timeout (time) {
          this.countTime = time
        },
        typeHints (type) {
          this.typeName = type
        },
        countScore (userScore) {
          const users = this.gameData.users
          if (users) {
            users.forEach(u => {
              u.score = userScore[u.id] || u.score
            })
          }
        },
        thisOver (data) {
          this.currentAnswer = data.key
          this.isShowAnswerCard = true
          this.gameData.player = ''
        },
        changeGamer () {
          this.isShowAnswerCard = false
          this.typeName = ''
          this.gameData.imageData = ''
          this.getGameData()
        },
        userOffline ({id}) {
          this.offlineUser[id] = 1
          this.offlineUser = {...this.offlineUser}
        },
        userOnline ({id}) {
          delete this.offlineUser[id]
          this.offlineUser = {...this.offlineUser}
        },
        gameOver (data) {
          this.isShowAnswerCard = false
          this.isShowGameOver = true
          this.gameOverData = this.gameData.users.sort((u1, u2) => {
            return u1.score < u2.score
          })
        }
      },
      quickSend: [
        '666666666',
        '哈哈哈哈哈',
        '这画的什么鬼',
        '???????????',
        '简直无法直视',
        '你的画工和颜值成正比',
        '.................'
      ],
      isShowGameOver: false,
      isShowAnswerCard: false,
      offlineUser: {},
      currentAnswer: '',
      typeName: '',
      gameData: {},
      countTime: 60,
      msgList: [],
      speed: 10,
      userScore: {},
      scrollInterval: '',
      messageListShow: false,
      gameOverData: []
    }
  },
  watch: {
    currentPlay (val) {
      if (this.isCurrentPlay) {
        this.$message('你来画')
      } else {
        this.users.every(u => {
          if (u.id === this.currentPlay) {
            this.$message(u.username + '作画')
            return false
          }
          return true
        })
      }
    }
  },
  computed: {
    users () {
      const users = this.gameData.users
      return users
    },
    currentUser () {
      return this.$store.getters.user.id
    },
    currentPlay () {
      return this.gameData.player
    },
    isCurrentPlay () {
      return this.currentUser === this.currentPlay
    }
  },
  methods: {
    isOffline (id) {
      return this.offlineUser[id]
    },
    hideAnswerCart () {
      this.isShowAnswerCard = false
    },
    sendMsg (msg) {
      this.$refs.chat.send(msg)
    },
    getGameData () {
      const vm = this
      vm.loading()
      vm.$webSocket.request({id: parseInt(this.$route.params.id)}, 'gameData').then((gameData) => {
        vm.gameData = gameData
        vm.countTime = gameData.time
        vm.loaded()
      }).catch(e => {
        if (e.type === 'gameOver') {
          this.goBackToRoom()
        } else {
          vm.$router.replace('/')
        }
        vm.loaded()
      })
    },
    goBackToRoom () {
      this.$router.replace({name: 'room', params: this.$route.params})
    },
    startAutoScroll () {
      this.messageListShow = true
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval)
      }
      this.scrollInterval = setInterval(_ => {
        try {
          this.$refs.msgScroll.scrollLeft++
          if (this.$refs.msgScroll.scrollLeft >= this.$refs.msgList.clientWidth + this.$refs.msgScroll.clientWidth) {
            this.stopAutoScroll()
          }
        } catch (e) {
          console.error(e)
          this.stopAutoScroll()
        }
      }, this.speed)
    },
    stopAutoScroll () {
      this.messageListShow = false
      clearInterval(this.scrollInterval)
      this.$refs.msgScroll.scrollLeft = 0
      this.msgList = []
    },
    showMessage (msg) {
      this.msgList.push(msg)
      this.startAutoScroll()
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.answer-card{
  width: 100vw;
  padding: 2vw;
  text-align: center;
}
.answer{
  color: @main-color;
  font-size: 1.2em;
  margin-left: 10px;
}
.quick-send{
  p{
    margin: .2em;
    border: 1px solid @main-color;
    padding: 10px;
  }
}
.player-list{
  width: 100%;
  overflow: auto;
  .player-item{
    width: 25vw;
    display: inline-block;
    padding: 2vw;
  }
}
.fiexd-msg-list{
  position: absolute;
  bottom: 0;
  min-width: 100%;
  background: rgba(0, 0, 0, 0.13);
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  transition: all .5s;
  font-size: .9em;
}
.msg-auto-scroll{
  width: 10000%;
  margin-left: 80%;
  .msg-list-all{
    display: inline-block;
    span + span{
      padding-left: 30vw;
    }
  }
}
</style>
