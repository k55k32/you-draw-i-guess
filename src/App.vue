<template lang="jade">
  div#app
    router-view
</template>

<script>
export default {
  name: 'app'
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
