<template lang="jade">
  div#app
    router-view
</template>

<script>
export default {
  name: 'app',
  created () {
    let token = 'token_' + new Date().getTime()
    this.login(token)
  },
  methods: {
    getParams () {
      let search = window.location.search
      search = search && search.substr(1)
      let pv = search.split('&')
      let param = {}
      pv.forEach(pvStr => {
        let p = pvStr.split('=')
        param[p[0]] = p[1]
        return param
      })
      return param
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let param = vm.getParams()
      vm.$router.replace({path: '/' + (param.page || 'room')})
    })
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
body,html,#app{
  background: #f8f8f8;
  height: 100%;
}
</style>
