<template lang="pug">
.begin
  .weui-cell
    .weui-cell__bd 提示词语
    .weui-cell__ft {{countTime}}
  draw
  chat
</template>

<script>
import Draw from './draw'
import Chat from './chat'
export default {
  components: { Draw, Chat },
  data () {
    return {
      countTime: 0,
      timerId: ''
    }
  },
  mounted () {
    this.startCountDown(10)
  },
  methods: {
    startCountDown (time) {
      this.stopCountDown()
      this.countTime = time
      this.countDown()
    },
    stopCountDown () {
      if (this.timerId) clearTimeout(this.timerId)
    },
    countDown () {
      if (this.countTime > 0) {
        this.timerId = setTimeout(() => {
          this.countTime = this.countTime - 1
          this.countDown()
        }, 1000)
      } else {
        this.timerId = ''
        this.countOver()
      }
    },
    countOver () {
      console.log('倒计时结束')
    }
  }
}
</script>

<style lang="css">
</style>
