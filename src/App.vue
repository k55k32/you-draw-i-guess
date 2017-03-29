<template lang="pug">
  div#app
    router-view
    a.fork-me(href="https://github.com/k55k32/you-draw-i-guess" target="_blank") Fork Me On Github - Diamond Zhou
</template>

<script>
export default {
  name: 'app',
  created () {
    if (this.isIPhone()) {
      require.ensure([], r => {
        let fastclick = require('fastclick')
        fastclick.attach(document.body)
      }, 'fastclick')
    }
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
      vm.$router.replace({path: '/' + (param.page || 'index')})
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
a{
    color: #bbb;
}
.fork-me{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    font-size: .8em;
}
</style>
