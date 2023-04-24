// index.js
// 获取应用实例
import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    user_info:''
  },
  onLoad: function (options) {
    this.getinfo()
  },
  
  getinfo(){//获取个人信息
    http.getUserInfo({
      data:{},
      success:res=>{
        this.setData({
          user_info:res.data,
        }); 
      }
    })
  },

})