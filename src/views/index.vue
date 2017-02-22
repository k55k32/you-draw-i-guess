<template lang="pug">
  .index
    mt-header(title="你画我猜-游戏大厅")
      mt-button(slot="left" icon="search" @click="inputRoomNumber") 查找房间
      router-link(:to="{name:'create-room'}", slot="right")
        mt-button 创建房间
    user-info.shadow
    .room-list
      mt-loadmore(:top-method="loadTop", :bottom-method="loadBottom", :bottom-all-loaded="allLoad" ref="loadmore", :bottomDistance="50")
        div.room-item(v-for="r in roomList", :key="r.id")
          mt-header.light-header
            div.room-name(slot="left") {{r.id + ': ' + r.name}}
            div.status(slot="right", :class="{ready: r.status === 1, started: r.status === 2}") {{$const('RoomStatus')[r.status]}}
          mt-header.white-header
            div.room-play-number(slot="left") 玩家人数：{{r.joined + ' / ' + r.playNumber}}
            div.join-btn(slot="right")
              router-link(:to="{name: 'room', params: {id: r.id}}", v-if="r.status === 1")
                mt-button(size="small" type="primary" plain) 加入房间
      .no-room
        router-link(:to="{name:'create-room'}" tag="div")
          mt-button(type="primary" size="large" plain) 没有想要的房间？创建一个
        .server-info 在线人数: {{onlineUser}}
</template>

<script>
import UserInfo from './user/info'
export default {
  components: {UserInfo},
  data () {
    return {
      socketEvents: {
        roomCreated: this.insertRoom,
        roomChanged: this.roomUpdate,
        userNumber (number) {
          this.onlineUser = number
        }
      },
      onlineUser: 1,
      roomList: 50,
      allLoad: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$webSocket.send({}, 'enterIndex')
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$webSocket.send({}, 'leaveIndex')
    next()
  },
  created () {
    this.loadRoomList()
    this.$webSocket.request({}, 'userNumber').then(size => {
      this.onlineUser = size
    })
  },
  computed: {
    loadEL () {
      return this.$refs.loadmore
    },
    roomMap () {
      const roomMap = {}
      this.roomList.forEach(r => {
        roomMap[r.id] = r
      })
      return roomMap
    }
  },
  methods: {
    insertRoom (room) {
      if (this.roomMap[room.id]) {
        this.roomUpdate(room)
      } else {
        this.roomList.unshift(room)
      }
    },
    roomUpdate (room) {
      let oldRoom = this.roomMap[room.id]
      if (oldRoom) {
        this.roomList = this.roomList.map(r => {
          if (r.id === room.id) {
            return {...r, ...room}
          } else {
            return r
          }
        })
      }
    },
    loadRoomList () {
      return this.$webSocket.request({}, 'roomList').then(data => {
        this.roomList = data
      })
    },
    inputRoomNumber () {
      this.$messageBox.prompt('请输入房间号').then(({value}) => {
        if (value) {
          this.$router.push({name: 'room', params: {id: value}})
        } else {
          this.$message('请输入房间号')
        }
      })
    },
    loadTop () {
      this.refresh().then(_ => {
        this.loadEL.onTopLoaded()
      })
    },
    loadBottom () {
      this.loadMore()
      this.loadEL.onBottomLoaded()
    },
    loadMore () {
    },
    refresh () {
      return this.loadRoomList()
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.no-room{
  text-align: center;
  line-height: 2em;
  font-size: 2em;
  color: #ccc;
  padding: 15px;
}
.room-item{
  background: @white;
  margin-bottom: 1.17em;
  .mint-header{
    height: auto;
    padding: 15px;
    font-size: 1em;
  }
}
.join-room{

  padding: 15px;
}
.room-item-header{
  background: @main-color;
  color: @white;
  padding: 15px;
}
.index{
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-list{
    flex: 1;
    overflow: auto;
  }
}
.server-info{
  font-size: 15px;
}
</style>
