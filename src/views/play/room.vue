<template lang="jade">
  div
    .title
      .weui-panel
        .weui-panel__bd
          a.weui-media-box.weui-media-box_appmsg
            div.weui-media-box__hd
              img.weui-media-box__thumb(src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==")
            .weui-media-box__bd
              h4.weui-media-box__title 标题一
              p.weui-media-box__desc 房间名称
    .player-waiting.weui-cells
      .waiting-wrap.weui-flex
        .player-item(v-for="i in playerNumber")
          .weui-btn.weui-btn_primary 玩家{{i}}
      .begin
        router-link.weui-btn.weui-btn_primary(:to="{ name: 'begin' }") 开始游戏
    .chat-input
      form.weui-cells.weui-cells_form(@submit.prevent="sendMsg")
        .weui-cell {{rcvMsg}} &nbsp;
        .weui-cell.weui-cell_vcode
          .weui-cell__bd
            input.weui-input(v-model="msg")
          .weui-cell__ft
            a.weui-vcode-btn(@click="sendMsg") 发送
    .function-menu 功能菜单
</template>
<!-- 进入房间后自动坐下，房主可开始游戏 -->
<script>
export default {
  data () {
    return {
      playerNumber: 8,
      msg: '',
      rcvMsg: []
    }
  },
  methods: {
    sendMsg () {
      this.rcvMsg.push(this.msg)
      this.msg = ''
    }
  }
}
</script>

<style lang="less">
.player-waiting{
  padding:5vw 0;
  .waiting-wrap{
    text-align: center;
    flex-wrap:wrap;
  }
  .begin{
    padding: 5vw 5vw;
  }
}
.player-item{
  width: 25%;
  padding: 2vw;
}
</style>
