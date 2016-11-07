<template lang="jade">
  div#app
    draw
</template>

<script>
import Draw from './views/play/draw'

export default {
  name: 'app',
  components: {
    Draw
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
body,html,#app{
  height: 100%;
}
#app {
  background-color: #000;
}
</style>
