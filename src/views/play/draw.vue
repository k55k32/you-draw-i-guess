<template lang="jade">
div.draw-wrapper
  .draw-wrap
    canvas#draw-convas(@touchstart="start" @touchmove="move" @touchend="end")
    .operator-wrap
      color-select(@select-color = "selectColor")(v-show="selectColorShow")
      line-select(@select-line = "selectLine")(:color="setting.color" v-show="selectLineShow")
  .operator-btns.weui-flex
    div(@click="toggleSelectColor")
      .color(:style="{background: setting.color}")
    div(@click="toggleSelectLine")
      .line(:style="{height: setting.line + 'px', background: setting.color}")
      {{setting.line}}
    div
      .iconfont.icon-weibiaoti545(@click="doAction('cancel')")
    div
      .iconfont.icon-chexiao(@click="doAction('reset')")
    div
      .iconfont.icon-shanchu(@click="clear")
</template>

<script>
import colorSelect from 'color-select'
import lineSelect from 'line-width-select'
export default {
  components: { colorSelect, lineSelect },
  data () {
    return {
      lineWidth: 5,
      offsetTop: 0,
      offsetLeft: 0,
      canvasHeight: 0,
      canvasWidth: 0,
      lineCap: 'round',
      historyData: [],
      historyIndex: -2,
      selectColorShow: false,
      selectLineShow: false,
      setting: { color: '#000', line: 4 }
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
      this.cxt = cxt
      cxt.lineWidth = this.setting.line
      window.cxt = cxt
      this.offsetTop = dom.offsetTop
      this.offsetLeft = dom.offsetLeft
      this.saveData()
    })
  },
  methods: {
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
      this.cxt.lineWidth = line
      this.selectLineShow = false
    },
    selectColor (color) {
      this.setting.color = color
      this.cxt.strokeStyle = color
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
    doAction (actionName, data) {
      switch (actionName) {
        case 'start':
        case 'move':
          this.draw(data, actionName)
          break
        case 'end':
          this.cxt.closePath()
          this.saveData()
          break
        case 'clear':
          this.clearCanvas()
          this.saveData()
          break
        case 'cancel':
          this.cancelAction()
          break
        case 'reset':
          this.resetAction()
          break
        default:
          console.log('unknow actionName:', actionName)
      }
    },
    clearCanvas () {
      this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },
    saveData () {
      let data = this.cxt.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
      if (this.historyIndex === -1) {
        this.historyData = []
      } else if (this.historyIndex > -1) {
        this.historyData.splice(this.historyIndex + 1, this.historyData.length)
      }
      this.historyData.push(data)
      this.historyIndex = this.historyData.length - 1
    },
    resetAction () {
      let data = this.historyData[this.historyIndex + 1]
      if (data) {
        this.cxt.putImageData(data, 0, 0)
        this.historyIndex = this.historyIndex + 1
      }
    },
    cancelAction () {
      if (this.historyIndex > 0) {
        let data = this.historyData[this.historyIndex - 1]
        this.cxt.putImageData(data, 0, 0)
        this.historyIndex = this.historyIndex - 1
      }
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
