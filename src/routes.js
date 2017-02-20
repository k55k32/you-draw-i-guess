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
    path: '/index',
    name: 'index',
    component: r => require(['src/views/index.vue'], r)
  },
  {
    path: '/room/:id',
    name: 'room',
    component: r => require(['src/views/room/room.vue'], r)
  },
  {
    path: '/begin/:id',
    name: 'begin',
    component: r => require(['src/views/play/begin.vue'], r)
  },
  {
    path: '/create-room',
    name: 'create-room',
    component: r => require(['src/views/room/create.vue'], r)
  }
]
