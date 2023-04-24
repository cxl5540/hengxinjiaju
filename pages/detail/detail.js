import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    id:'',
    value:0,
    question_info:'',
    question_pic_url:[],
    after_sales_pic_url:[],
    appraise_content:''
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdata();
  },
  onChange(event) {
    this.setData({
      value: event.detail,
    });
  },
  getdata(){
    http.question_detail({
      data:{
        question_id:this.data.id,
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code=='200'){
          var question_pic_url=JSON.parse(res.data.question_info.question_pic_url) ;
          var after_sales_pic_url=JSON.parse(res.data.question_info.after_sales_pic_url);
          for(var i=0;i<question_pic_url.length;i++){
            question_pic_url[i].url=app.globalData.img_url+question_pic_url[i].url
          }
          this.setData({
            question_info:res.data.question_info,
            question_pic_url:question_pic_url
          })
         
          if(after_sales_pic_url){
            for(var i=0;i<after_sales_pic_url.length;i++){
              after_sales_pic_url[i].url=app.globalData.img_url+after_sales_pic_url[i].url
            }
            this.setData({
              after_sales_pic_url:after_sales_pic_url
            })
          }
        }
      }
    })
  },
  inputWacth(e){
    this.setData({
      appraise_content:e.detail.value
      }); 
  },
  submit(){ //提交
   http.after_sales_appraise({
     data:{
      star_rating:this.data.value,
      appraise_content:this.data.appraise_content,
      uid:wx.getStorageSync('uid'),
      question_id:this.data.id
     },
     success:res=>{
       if(res.code=='200'){
         wx.showToast({
           title: res.msg,
         })
         setTimeout(res=>{
          wx.navigateBack()
        },500)
       }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
       }
     }
   })
  }
})