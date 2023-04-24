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
      tabHeiaght:wx.getSystemInfoSync().windowHeight-0,
    })
    this.getlist(); 
  },
 
  getlist(){ //获取案例列表
    http.case_list({
      data:{
        page:this.data.page,
        limit:10,
      },
      success:res=>{
        if(res.code=='200'){
          var list=this.data.list;
          if(this.data.is_data){       
            this.setData({
              list:list.concat(res.data.case_list),
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.case_list.length<=10){
            this.setData({
              is_data:false
            })
          }
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
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
})