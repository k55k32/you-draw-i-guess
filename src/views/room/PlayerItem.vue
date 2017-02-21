<template lang="pug">
.player-item
  .head {{user.username.substr(0,1)}}
    .score(v-if="user.score >= 0") {{user.score}}分
  .username {{user.username}}
</template>

<script>
export default {
  props: ['user']
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.player-item{
  @size: 40px;
  .head{
    position: relative;
    width: 100%;
    height: 18vw;
    color: @white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10vw;
    background-color: @main-color;
  }
  .score{
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    padding: 2px 4px;
    background: @white;
    color: @main-color;
  }
  .username{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    color: @main-color;
    font-size: .8em;
    margin-top: .2em;
  }
  &.empty-item{
    .head{
      background-color: @white;
      color: @main-color;
    }
  }

  .head{
    &:before{
      position: absolute;
      left: 0;
      top: 0;
      color: @main-color;
      background: @white;
      padding: 2px 4px;
      font-size: 10px;
    }
    &:after{
      position: absolute;
      left: 0;
      top: 0;
      color: @main-color;
      background: @white;
      padding: 2px 4px;
      font-size: 10px;
    }
  }

  &.me{
    .head{
      &:after{
        content: "我";
      }
    }
  }

  &.leave{
    .head{
      background: #eee;
      &:before{
        content: '掉'
      }
    }
  }

  &.draw {
    .head{
      background: darken(@main-color, 20%);
      &:before{
        content: "画"
      }
      &:after{
        left: 20px;
      }
    }
  }
  &.master{
    .head{
      &:before{
        content: "主";
      }
      &:after{
        left: 20px;
      }
    }
  }
}
</style>
