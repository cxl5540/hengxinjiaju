// pages/pc_set/pc_set.js
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    radio: '2',
    name:''
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  getname(event){ //真实姓名
    this.setData({
      name:event.detail
    })
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  setpass(){
    if(!this.data.name){
      wx.showToast({
        title: '请输入真实姓名',
        icon:'none'
      })
      return false;
    }
    http.user_update({
      data:{
        uid:wx.getStorageSync('uid'),
        type:this.data.radio,
        name:this.data.name
      },
      success:res=>{
        if(res.code=='200'){
          wx.showToast({
            title:res.msg,
          })
          wx.navigateBack()
        }
      }
    })
    console.log(this.data.radio)
  }
});