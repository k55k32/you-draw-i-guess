<template lang="jade">
  div.draw
    canvas#draw-convas(@touchstart="start" @touchmove="move" @touchend="end")
</template>

<script>
export default {
  mounted () {
    this.$nextTick(() => {
      let dom = document.getElementById('draw-convas')
      let wrap = dom.parentElement
      dom.setAttribute('width', wrap.clientWidth)
      window.test = wrap
      dom.setAttribute('height', wrap.clientHeight)
      let cxt = dom.getContext('2d')
      cxt.lineCap = this.lineCap
      cxt.lineJoin = this.lineCap
      this.cxt = cxt
    })
  },
  data () {
    return {
      lineWidth: 5,
      lineCap: 'round'
    }
  },
  methods: {
    draw (e, type = 'start') {
      let touch = e.touches[0]
      let x = touch.clientX
      let y = touch.clientY
      let cxt = this.cxt
      switch (type) {
        case 'start':
          cxt.beginPath()
          cxt.fill()
          let lw = this.lineWidth
          cxt.lineWidth = lw
          cxt.moveTo(x - lw / 8, y - lw / 8)
          cxt.lineTo(x, y)
          break
        case 'move':
          cxt.lineTo(x, y)
          break
      }
      cxt.stroke()
    },
    start (e) {
      this.draw(e)
    },
    move (e) {
      this.draw(e, 'move')
    },
    end (e) {
      this.cxt.closePath()
    }
  }
}
</script>

<style lang="less">
.draw{
  background: #fff;
  width: 100%;
  &>canvas{
    display: block;
  }
}
</style>
