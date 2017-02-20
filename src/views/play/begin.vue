<template lang="pug">
.game-begin
  mt-header
    div(slot="left") {{isCurrentPlay ? '请画出: ' : '提示: '}} {{gameData.key}}
    div(slot="right") {{countTime}}
  draw(:can-draw="isCurrentPlay", :image-data="gameData.imageData")
  chat
</template>

<script>
import Draw from './draw'
import Chat from './chat'
export default {
  components: { Draw, Chat },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loading()
      vm.$webSocket.request({id: parseInt(to.params.id)}, 'gameData').then((gameData) => {
        vm.gameData = gameData
        vm.countTime = gameData.time
        vm.loaded()
      }).catch(e => {
        vm.$message(e.msg)
        vm.$router.replace('/')
        vm.loaded()
      })
    })
  },
  data () {
    return {
      socketEvents: {
        timeout (time) {
          this.countTime = time
        }
      },
      gameData: {},
      countTime: 60,
      timerId: ''
    }
  },
  computed: {
    isCurrentPlay () {
      return this.$store.getters.user.id === this.gameData.player
    }
  },
  methods: {
    countOver () {
      console.log('倒计时结束')
    }
  }
}
</script>

<style lang="css">
</style>
