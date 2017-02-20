<template lang="pug">
div.draw-wrapper#draw-wrapper
  .draw-wrap
    canvas#draw-convas(@touchstart="start" @touchmove="move" @touchend="end" v-if="canDraw")
    canvas#draw-convas(v-else)
    .operator-wrap(v-if="canDraw")
      color-select(@select-color = "selectColor" v-show="selectColorShow")
      line-select(@select-line = "selectLine" v-show="selectLineShow", :color="setting.color")
  .operator-btns.flex(v-if="canDraw")
    div(@click="toggleSelectColor")
      .color(:style="{background: setting.color}")
    div(@click="toggleSelectLine")
      .line(:style="{height: setting.line + 'px', background: setting.color}")
      div {{setting.line}}
    div
      .iconfont.icon-weibiaoti545(@click="doAction('undo')")
    div
      .iconfont.icon-chexiao(@click="doAction('redo')")
    div
      .iconfont.icon-shanchu(@click="clear")
</template>

<script>
import colorSelect from 'color-select'
import lineSelect from 'line-width-select'
export default {
  components: { colorSelect, lineSelect },
  props: ['canDraw', 'imageData'],
  data () {
    return {
      socketEvents: {
        drawAction (data) {
          this.setting = data.setting
          this.doAction(data.actionName, data.data, false)
        },
        drawImage: this.drawImage
      },
      lineWidth: 5,
      offsetTop: 0,
      offsetLeft: 0,
      canvasHeight: 0,
      canvasWidth: 0,
      lineCap: 'round',
      historyData: [],
      historyIndex: -1,
      selectColorShow: false,
      selectLineShow: false,
      setting: { color: '#000', line: 4 },
      receiveMsg: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      let dom = document.getElementById('draw-convas')
      let wrap = dom.parentElement
      this.canvasHeight = wrap.clientHeight
      this.canvasWidth = wrap.clientWidth
      dom.setAttribute('width', wrap.clientWidth)
      dom.setAttribute('height', wrap.clientHeight)
      let cxt = dom.getContext('2d')
      cxt.lineCap = this.lineCap
      cxt.lineJoin = this.lineCap
      cxt.lineWidth = this.setting.line
      this.canvas = dom
      this.cxt = cxt
      this.countOffset(dom)
      this.saveData()
      this.$watch('imageData', v => {
        console.log(this.imageData)
        this.$nextTick(_ => {
          this.drawImage(v)
        })
      })
    })
  },
  watch: {
    setting: {
      handler (val) {
        this.cxt.lineWidth = val.line
        this.cxt.strokeStyle = val.color
      },
      deep: true
    },
    historyIndex () {
      if (!this.canDraw) return
      let data = this.historyData[this.historyIndex]
      if (data) this.sendImage(data)
    }
  },
  computed: {
    canUndo () {
      return this.historyIndex > 0
    },
    canRedo () {
      return this.historyIndex < this.historyData.length - 1
    }
  },
  methods: {
    drawImage (data) {
      this.clearCanvas()
      var img = new window.Image()
      img.onload = () => {
        this.cxt.drawImage(img, 0, 0)
      }
      img.src = data.dataUrl
    },
    countOffset (dom) {
      if (dom) {
        this.offsetTop = this.offsetTop + dom.offsetTop
        this.offsetLeft = this.offsetLeft + dom.offsetLeft
        this.countOffset(dom.offsetParent)
      }
    },
    toggleSelectLine () {
      this.selectLineShow = !this.selectLineShow
      this.selectColorShow = false
    },
    toggleSelectColor () {
      this.selectColorShow = !this.selectColorShow
      this.selectLineShow = false
    },
    selectLine (line) {
      this.setting.line = line
      this.selectLineShow = false
    },
    selectColor (color) {
      this.setting.color = color
      this.selectColorShow = false
    },
    draw ({ x, y }, type = 'start') {
      let cxt = this.cxt
      switch (type) {
        case 'start':
          cxt.beginPath()
          cxt.fill()
          let lw = this.lineWidth
          cxt.moveTo(x - lw / 16, y - lw / 16)
          cxt.lineTo(x, y)
          break
        case 'move':
          cxt.lineTo(x, y)
          break
      }
      cxt.stroke()
    },
    doAction (actionName, data, sync = true) {
      switch (actionName) {
        case 'start':
        case 'move':
          this.draw(data, actionName)
          if (sync) this.sendAction({ actionName, data, setting: this.setting })
          break
        case 'end':
          this.cxt.closePath()
          this.saveData()
          break
        case 'clear':
          this.clearCanvas()
          this.saveData()
          break
        case 'undo':
          this.undo()
          break
        case 'redo':
          this.redo()
          break
        default:
          console.log('unknow actionName:', actionName)
      }

      if (sync && actionName !== 'move' && actionName !== 'start') {
      }
    },
    sendImage (data) {
      this.canDraw && this.$webSocket.send({
        dataUrl: data
      }, 'drawImage')
    },
    sendAction (action) {
      this.canDraw && this.$webSocket.send(action, 'drawAction')
    },
    clearCanvas () {
      this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },
    saveData () {
      if (!this.canDraw) return
      this.historyData.splice(this.historyIndex + 1, this.historyData.length)
      this.historyData.push(this.canvas.toDataURL())
      this.historyIndex = this.historyData.length - 1
    },
    undo () {
      this.canUndo && this.historyIndex --
    },
    redo () {
      this.canRedo && this.historyIndex ++
    },
    getPoint (e) {
      let touch = e.touches[0]
      let x = touch.clientX - this.offsetLeft
      let y = touch.clientY - this.offsetTop
      return { x, y }
    },
    start (e) {
      this.doAction('start', this.getPoint(e))
    },
    move (e) {
      this.doAction('move', this.getPoint(e))
    },
    end () {
      this.doAction('end')
    },
    clear () {
      this.doAction('clear')
    }
  }
}
</script>

<style lang="less">
@import "../../assets/css/iconfont/iconfont.css";
@operator-color: #eee;
.operator-btns{
  padding:10px 0;
  &>div{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .color{
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }
  .line{
    width: 5vw;
    margin-right: 1vw;
    text-align: center;
  }
  .iconfont{
    font-size: 25px;
  }
}
.draw-wrap{
  background: #fff;
  width: 100%;
  height: 300px;
  position: relative;
  .operator-wrap{
    box-shadow: 0 0 5vw #ccc;
    position: absolute;
    width: 100%;
    bottom:0;
    background: #fff;
  }
  &>canvas{
    display: block;
  }
}
</style>
