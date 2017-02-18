<template lang="pug">
  div
    mt-header(title="创建房间")
      mt-button(slot="left" icon="back" @click="$router.back()") 返回
      mt-button(slot="right" @click="createRoom") 完成
    form
      mt-field(label="房间名称" placeholder="请输入房间名", :value="room.name")
      mt-radio(title="房间类型" v-model="room.type",:options="options")
        //- mt-field(label="玩家数量", v-model="room.playNumber")
      //- mt-field(label="游戏次数（没人）" v-model="room.playTimes")
</template>

<script>
export default {
  computed: {
    options () {
      const roomType = this.$const('RoomType')
      return Object.keys(roomType).map(k => {
        return {
          label: roomType[k],
          value: k
        }
      })
    }
  },
  data () {
    return {
      room: {
        name: '',
        playNumber: 8,
        type: '1',
        playTimes: 3
      }
    }
  },
  methods: {
    createRoom () {
      if (this.name) {
        this.$message('创建房间中')
      } else {
        this.$message('请输入房间名称')
      }
    }
  }
}
</script>

<style lang="css">
</style>
