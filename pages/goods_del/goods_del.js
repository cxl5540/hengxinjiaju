import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    id:'',
    goods_info:'',
    activ:0,
    disabled:false,
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdata(options.id)
  },
  getdata(id){  //获取数据   
    http.goods_detail({
      data:{
        goods_id:id,
      },
      success:res=>{
        if(res.code==200){
         // res.data.commodity_info.detail =res.data.commodity_info.detail.replace(/\<img/gi, '<img class="richImg" ');
          this.setData({
            goods_info:res.data.goods_info,
          })
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      }     
    })
  },

  submit(){
    http.goods_exchange({
      data:{
        goods_id:this.data.id,
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code=='200'){
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/money_list/money_list',
                })
              }
            }
          })
        }else{
          wx.showToast({
            title:res.msg,
            icon:"none"
          })
        }
      }
    })
  },
 
})