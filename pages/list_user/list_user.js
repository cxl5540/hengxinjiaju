import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    page:1,
    pages:0,
    list:[],
    triggered:false,
    is_data:true,
    tabHeiaght:400
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-70,
    })
    this.getlist(); 
  },
 


  

  getlist(){
    http.my_after_sales_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;
          if(this.data.is_data){       
            this.setData({
              list:list.concat(res.data.question_list),
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.question_list.length<=10){
            this.setData({
              is_data:false
            })
          }
        }else{
          wx.showToast({
            title:res.message,
            icon:'none'
          })
        }
      }
    })
  },
  getdetail(e){ //详情
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/Repair/Repair?id='+id,
    })
    
  },
 
  onPulling(e){
  
  },
  

 
  scrollToLower(e){ //上拉加载
    if(this.data.is_data){
      this.setData({
        page:this.data.page+1
      })
      this.getlist()
    }
    
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        page:1,
        is_data:true,
        list:[],
        salaryCode:0,
        type:'全部',
        status_id:'',
       
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
})