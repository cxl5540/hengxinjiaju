// index.js
// 获取应用实例
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
//import util from "../../utils/util"
Page({
  data: {
    type:'',
    user_info:'',
    uid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:  wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    list:[
      {ti:'一键售后',del:'及时响应行业典范举世无双',img_u:'gd.png',url:'/pages/Repair/Repair'},
      {ti:'售后列表',del:'就近上门价格统一超长保质',img_u:'wx.png',url:'/pages/list/list'},
      {ti:'积分兑换商城',del:'您积分兑换商品',img_u:'mine_icon_grxx.png',url:'/pages/shop/shop'},
      {ti:'商品兑换列表',del:'您积分兑换商品明细及兑换码查看',img_u:'mx.png',url:'/pages/money_list/money_list'},
      {ti:'积分明细',del:'您积分明细查看',img_u:'jf.png',url:'/pages/jf_list/jf_list'},
      {ti:'优惠券',del:'优惠券领取分享好友兑换或线下使用',img_u:'mine_icon_xgmm.png',url:'/pages/coupon/coupon'},
      {ti:'联系客服',del:'为提供更简便的操作和购买会员，快联系我吧！',img_u:'mine_icon_lxkf.png',url:''},     
      {ti:'小程序分享',del:'把小程序恒鑫家具分享给更多需要使用的人吧！',img_u:'mine_icon_fx.png',url:''},
    ],
  },
  onLoad() {
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
  navurl(e){ //跳转
    var url=e.currentTarget.dataset.url;
    var index=e.currentTarget.dataset.index;
    if(url){
      if(index==1&&this.data.user_info.is_client==1){
        wx.showToast({
          title: '您还不是公司用户,暂不能使用该功能,请联系客服',
          duration:2000,
          icon:'none'
        })
      }else if(index==1&&this.data.user_info.is_client==2){
        wx.navigateTo({
          url: url+'?type='+this.data.user_info.type,
        })
      }else if(index==0&&this.data.user_info.is_client==1){
        wx.showToast({
          title: '您还不是公司用户,暂不能使用该功能,请联系客服',
          duration:2000,
          icon:'none'
        })
      } else{
        wx.navigateTo({
          url: url
        })
      }
      
    }
    // if(index==6){
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // }  
    // if(index==5){
    //   wx.navigateToMiniProgram({
    //     appId: 'wx78cd18d3fd086861', // 要跳转的小程序的appid
    //     path: 'pages/index/index', // 跳转的目标页面
    //         extarData: {
    //           open: 'auth'
    //         },
    //         success(res) {
    //           // 打开成功  
    //         }
    //   }) 
    // }
  },
  concat(){ //联系客服
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc5722870690518a82'
      },
      corpId: 'ww0ca5c38bf1d4d086',
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
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
          wx.setStorageSync('uid',res)
          this.getinfo()
        }               
      }
    })
  },
  getPhoneNumber: function (e) {  //电话授权
    var that = this;
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
          console.log(res)
          if(res.data.code=='200'){
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'success',
            });
            wx.setStorageSync('tel', res.data.data);
            that.setData({
              tel:res.data.data,
            })
            console.log(res.data.data)
            that.getinfo()
          }else{
            // console.log(res.data.msg)
            // wx.showToast({
            //   title: res.data.msg,
            //   duration: 2000,
            //   icon: 'none',
            // });
          }        
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  },
  getcoupon(){ //兑换优惠券
    let that=this;    
    wx.showModal({
      title: '兑换优惠券',
      placeholderText: '请输入优惠券兑换码',
      editable:true,
      success (res) {     
        if (res.confirm) {
          that.exchange_coupon(res.content)
        } else if (res.cancel) {
    
        }
      }
    })
  },
  jf_list(){
    wx.navigateTo({
      url: '/pages/jf_list/jf_list',
    })
  },
  coupon(){
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
  cl_fun(){
     util.showmodel('11','333').then(function(data){
       console.log(data)
     })
   
  }
})
