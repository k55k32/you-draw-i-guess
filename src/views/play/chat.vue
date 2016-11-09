<template lang="jade">
.chat-input
  form.weui-cells.weui-cells_form(@submit.prevent="sendMsg")
    .weui-cell.chat-wrap
      transition-group(name="msg-group")(enter-active-class="animated fadeInUp")(leave-active-class="animated fadeOutUp" tag="div")(@after-enter="afterEnter" @before-enter="beforeEnter")(@after-leave="afterLeave")
        div(v-for="msg in rcvMsg")(key="msg") {{msg}}
    .weui-cell.weui-cell_vcode
      .weui-cell__bd
        input.weui-input(v-model="msg")
      .weui-cell__ft
        a.weui-vcode-btn(@click="sendMsg") 发送
</template>

<script>
export default {
  data () {
    return {
      msg: '',
      rcvMsg: [],
      msgQueen: [],
      msgNumber: 0
    }
  },
  methods: {
    sendMsg () {
      this.msgQueen.push(this.msg)
      this.msg = ''
      this.putMsg()
    },
    putMsg () {
      if (this.msgNumber === 0) {
        let msg = this.msgQueen.shift()
        if (msg) this.rcvMsg.push(msg)
      }
    },
    beforeEnter () {
      this.msgNumber = this.msgNumber + 1
    },
    afterEnter () {
      let msg = this.rcvMsg[0]
      let timeout = msg.length / 6 * 1000
      setTimeout(() => {
        this.msgNumber = this.msgNumber - 1
        this.rcvMsg.shift()
      }, timeout)
    },
    afterLeave () {
      this.putMsg()
    }
  }
}
</script>

<style lang="less">
.chat-wrap{
  height: 2.5em;
}
</style>
