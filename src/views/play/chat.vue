<template lang="jade">
.chat-input
  form.weui-cells.weui-cells_form(@submit.prevent="sendMsg")
    .weui-cell.chat-wrap
      transition-group(name="msg-group")(enter-active-class="animated fadeInUp" tag="div")
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
      msgNumber: 0,
      receiveMsg: true
    }
  },
  methods: {
    chat (msg) {
      this.msgQueen.push(msg.from.nickname + ':' + msg.data)
      this.putMsg()
    },
    sendMsg () {
      this.send(this.msg, 'chat')
      this.msg = ''
    },
    putMsg () {
      let msg = this.msgQueen.shift()
      if (msg) {
        this.rcvMsg.push(msg)
        setTimeout(() => {
          this.shiftMsg()
        }, 2000)
      }
    },
    shiftMsg () {
      this.rcvMsg.shift()
    }
  }
}
</script>

<style lang="less">
.chat-wrap{
  height: 4em;
}
</style>
