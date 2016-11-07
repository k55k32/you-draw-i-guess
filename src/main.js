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
