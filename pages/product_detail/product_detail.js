import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    id:'',
    product_info:'',
    swiperCurrent:0,
  },
  onLoad: function (options) {
    this.setData({
     id:options.id
    })
    this.getdata()
  },
  previewImage(e){ //点击预览
    var cover=this.data.product_info.cover;
    var index=this.data.swiperCurrent;
    wx.previewImage({
     current:cover[index],
      urls:cover
    }) 
  },
  getdata(){
    http.product_detail({
      data:{
        product_id:this.data.id
      },
      success: res => {
        if(res.code=='200'){
          res.data.product_info.specification =res.data.product_info.specification.replace(/\<img/gi, '<img class="richImg" style="max-width:100%" ');
          var product_info=res.data.product_info;
          product_info.cover=JSON.parse(product_info.cover);
          for(var i=0;i<product_info.cover.length;i++){
            product_info.cover[i]=app.globalData.url+product_info.cover[i]
          }
         this.setData({
          product_info:product_info
         })
        }else{
          wx.showToast({
            title:res.message,
            icon:'none'
          })
        }
        
      }
    })
  },
  //轮播图的切换事件  
  swiperChange: function (e) { 
    console.log( e.detail.current ); 
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },
})