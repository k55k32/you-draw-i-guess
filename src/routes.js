import App from './App'
export default [
  {
    path: '/',
    component: App
  },
  {
    path: '/no-page/:message',
    name: 'no-page',
    component: r => require(['src/views/no-page.vue'], r)
  },
  {
    path: '/room',
    name: 'room',
    component: r => require(['src/views/play/room.vue'], r)
  },
  {
    path: '/begin',
    name: 'begin',
    component: r => require(['src/views/play/begin.vue'], r)
  }
]
