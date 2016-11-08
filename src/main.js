import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'

require('weui') // 加载微信样式

Vue.use(VueRouter)

const router = new VueRouter({ routes })
console.log(router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

document.addEventListener('touchmove', e => {
  e.preventDefault()
}, false)

require.ensure([], r => {
  let fastclick = require('fastclick')
  fastclick.attach(document.body)
}, 'fastclick')
