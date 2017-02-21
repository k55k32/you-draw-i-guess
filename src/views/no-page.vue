<template lang="pug">
  .no-page 没有找到改页面 {{message}}
    .back
      a(@click="back") 返回
</template>

<script>
export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  },
  beforeRouteEnter (t, f, next) {
    next(vm => {
      vm.message = t.params.message
    })
  }
}
</script>

<style lang="css">
</style>
