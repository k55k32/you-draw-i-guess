export default [
  {
    path: '/room',
    component: r => require(['src/views/play/room.vue'], r)
  },
  {
    path: '/begin',
    name: 'begin',
    component: r => require(['src/views/play/begin.vue'], r)
  }
]
