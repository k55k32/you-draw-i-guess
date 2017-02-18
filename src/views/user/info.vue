<template lang="pug">
div.user-info
  div.head {{firstWord}}
  div.name {{user.name}}
  div.after
    mt-button(type="primary" size="small" @click="showUpdateName" plain) 修改昵称
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      user: {
        name: '玩家001'
      }
    }
  },
  computed: {
    firstWord () {
      return this.user.name && this.user.name.substr(0, 1)
    }
  },
  methods: {
    showUpdateName () {
      MessageBox.prompt('请输入昵称', {
        inputPlaceholder: this.user.name
      }).then((data) => {
        this.changeUserName(data.value)
      })
    },
    changeUserName (v) {
      if (v) {
        this.user.name = v
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
  @base-padding: 10px;
  display: flex;
  align-items: center;
  padding: @base-padding;
  background: @white;
  .head{
    font-size: 3em;
    background-color: @main-color;
    color: @white;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name{
    color: @main-color;
    flex: 1;
    padding: @base-padding;
  }
}
</style>
