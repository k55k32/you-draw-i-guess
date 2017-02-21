<template lang="pug">
.chat-input
  form(@submit.prevent="sendMsg")
    .input-group
      input(type="text" placeholder="请输入要发送的消息" v-model="msg")
      button(class="mint-button mint-button--primary mint-button--normal" type="submit") 发送
  .msg-list(v-if="showList")
    p(v-for="m in msgList", :class="m.type") {{m.msg}}
</template>

<script>
export default {
  props: ['showList'],
  data () {
    return {
      msg: '',
      msgList: [],
      socketEvents: {
        receiveMsg (data) {
          this.$emit('receive', data)
          this.msgList.unshift(data)
          this.msgList.splice(4, this.msgList.length) // 只显示最新的 4 条消息
        }
      }
    }
  },
  methods: {
    send (msg) {
      this.$webSocket.send(msg, 'chatMsg')
    },
    sendMsg () {
      if (this.msg) {
        this.send(this.msg)
        this.msg = ''
      }
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.input-group{
  @children-height: 40px;
  display: flex;
  align-items: center;
  background: @white;
  border-bottom: @main-color solid 1px;
  input{
    flex: 1;
    border: 0;
    margin: 0;
    height: @children-height;
    padding: 0px 15px;
    font-size: 1.1em;
  }
  button{
    border-radius: 0;
    height: @children-height;
  }
}
.chat-input{
  display: flex;
  flex-direction: column;
}
.msg-list{
  background: @white;
  p{
    margin: .6em .8em;
  }
}
</style>
