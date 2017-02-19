<template lang="pug">
div.user-info
  div.head {{firstWord}}
  div.name {{user.username}}
  div.after
    mt-button(type="primary" size="small" @click="showUpdateName" plain) 修改昵称
    router-link(tag="span", :to="{name: 'create-room'}")
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    firstWord () {
      const user = this.user
      return user.username && user.username.substr(0, 1)
    }
  },
  methods: {
    showUpdateName () {
      MessageBox.prompt('请输入昵称', {
        inputPlaceholder: this.user.username
      }).then((data) => {
        this.changeUserName(data.value)
      })
    },
    changeUserName (v) {
      if (v) {
        this.$store.dispatch('change-user', {
          username: v
        })
        this.$webSocket.send({username: v}, 'changename')
      } else {
        this.$message('你没有输入昵称哦！')
      }
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.user-info{
  @base-padding: 5px;
  display: flex;
  align-items: center;
  padding: @base-padding;
  background: @white;
  .head{
    font-size: 3em;
    background-color: @main-color;
    color: @white;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name{
    color: @main-color;
    overflow: hidden;
    flex: 1;
    padding: @base-padding;
  }
}
</style>
