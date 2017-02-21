# you-draw-i-guess

> a game you can play

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
# 游戏设计
## 大厅功能
**个人信息显示**   
顶部显示个人昵称，可以修改   
暂时不支持上传头像，头像用昵称第一个字母做圆形头像   
暂时使用 `localStorage` 储存个人信息   

**创建游戏房间**   
房间名称:
房间人数: 最少2人，最大8人 默认最大人数   
绘画次数: 最少1次，最大5次，默认3次   
房间类型：公开，私有   

**加入房间**   
公开房间加入： 直接在房间列表里面点击加入即可   
私密房间加入： 扫秒二维码或者输入房间号 （二维码由客户端使用js生成）   
房间人满后不可加入   
房间游戏开始后不可加入   
后期可加入观战功能   

**显示房间列表**   
显示字段 `name`, `count`, `joined`, `status`, `playTimes`   
显示所有公开的房间，默认按缺少人数排序，下拉加载更多房间   
> 例如：一个房间可加入8个人，已经加入了7个人，那么排在前面。如果缺少人数相同，则根据房间总人数，在相同则根据创建时间排序

房间数据结构:
```js
{
  id: '房间id，房间号',
  name: '名称',
  playNumber: '可加入人数',  
  joined: '已加入人数',
  type: '房间类型 1.公开 2.私有',
  status: '房间状态 1.准备中 2.已开始 3.已结束',
  playTimes: '每人绘画次数，默认3次',
  createTime: '创建时间'，
  gameTime: '每轮游戏时间 60s'
}
```

## 进入房间
房间内可聊天
房间内，创建人可开始游戏（2人或以上才可以开始）
创建人退出后，如果房间还有人，房间移交给下一人，如果没人了，下一个第一个加入该房间的人，就是房主（房间永久储存）
