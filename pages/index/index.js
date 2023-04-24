// index.js
// 获取应用实例
import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    imgList:[
     {url:"jia.jpeg",id:1},
     {url:"jiaju1.jpeg",id:3},
    ],
    path:'',
    show:false,
    uid:'',
    tel:'',
    user_info:'',
    type:'',
    key:'',
    price:'',
    coupon_id:'',
    product_list:[],
    case_list:[],
    show:false
  },
  onLoad(options) {
    this.getlist();
    this.case_list();
    if(options.key){
      this.exchange_coupon(options.key,options.coupon_id);
      this.setData({
        key:options.key,
        coupon_id:options.coupon_id,
        price:options.price
      })
    }
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      });
      this.getinfo()
    }
    if(wx.getStorageSync('tel')){
      this.setData({
        tel:wx.getStorageSync('tel')
      })
    }
    
  },
  exchange_coupon(key,coupon_id){ //优惠券
    http.exchange_coupon({
      data:{
        key:key,
        coupon_id:coupon_id,
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code=='200'){
          this.setData({
            show:true
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      }
    })
  },
  mine(){ //优惠券个人中心
     wx.switchTab({
        url: '/pages/mine/mine',
      })
      this.close()
  },
  close(){ //优惠券关闭
    this.setData({
      show:false
    })
  },
  onShow(){
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      })
      this.getinfo()
    } 
    if(wx.getStorageSync('tel')){
      this.setData({
        tel:wx.getStorageSync('tel')
      })
     
    }
 
  },
 
  getinfo(){//获取个人信息
    http.getUserInfo({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code=='200'){    
          this.setData({
            tel:res.data.user_info.tel,
            type:res.data.user_info.type,
            uid:res.data.user_info.id,
            user_info:res.data.user_info
          }); 
         wx.setStorageSync('tel',res.data.user_info.tel);
         wx.setStorageSync('uid',res.data.user_info.id);
        }
        
      }
    })
  },
  getlist(){ //获取商品列表
    http.product_list({
      data:{},
      success:res=>{
        if(res.code=='200'){
          var product_list=res.data.product_list;
          for(var i=0;i<product_list.length;i++){
            product_list[i].cover=JSON.parse(product_list[i].cover)
          }
          this.setData({
            product_list:product_list.slice(0,4)
          })
        }
      }
    })
  },
  getpro_list(){//商品列表
    wx.navigateTo({
      url: '/pages/list_pro/list_pro',
    })
  },
  getcase_list(){
    wx.navigateTo({
      url: '/pages/list_cases/list_cases',
    })
  },
  case_list(){ //案例
    http.case_list({
      data:{},
      success:res=>{
        if(res.code=='200'){
          var case_list=res.data.case_list;
          this.setData({
            case_list:case_list.slice(0,2)
          })
        }
      }
    })
  },
  calse_detail(e){//案例详情
    var url=e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/vr/vr?url='+url,
    })
  },
  pro_detail(e){//产品详情
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product_detail/product_detail?id='+id,
    })
  },
  getUserProfile(e){ //授权
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        util.login(res.encryptedData,res.iv)
        util.checkLoginReadyCallback = res => {
          this.setData({
            uid: res,
          })
          wx.setStorageSync('uid',res);
          this.getinfo()
        }
       
      }
    })
  },
  getPhoneNumber: function (e) {  //电话授权
    var that = this;
    wx.showLoading({
      title: '授权中...',
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: app.globalData.url+'api/Index/apppost',
        data: {       
          js_code: e.detail.code,        
          encryptedData:e.detail.encryptedData,
          iv:e.detail.iv,
          action:'Login/bind_mobile',
          uid:wx.getStorageSync('uid')
        },
        method: "post",
        success: function (res) {
          if(res.data.code=='200'){
            setTimeout(res=>{
              wx.showToast({
                title:'手机号授权成功',
                duration: 2000,
              })
            },1000)
            wx.setStorageSync('tel', res.data.data);
            that.setData({
              tel:res.data.data,
            })        
            that.getinfo();
            if(this.data.key){
              this.exchange_coupon(this.data.key,this.data.coupon_id);
            }
           
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'none',
            });
          }        
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  },

})
