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
 
  getlist(){ //获取商品列表
    http.product_list({
      data:{
        page:this.data.page,
        limit:10,
      },
      success:res=>{
        if(res.code=='200'){
          for(var i=0;i<res.data.product_list.length;i++){
            res.data.product_list[i].cover=JSON.parse(res.data.product_list[i].cover)
          }
          var list=this.data.list;
          if(this.data.is_data){       
            this.setData({
              list:list.concat(res.data.product_list),
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.product_list.length<=10){
            this.setData({
              is_data:false
            })
          }
        }
      }
    })
  },
  pro_detail(e){//产品详情
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product_detail/product_detail?id='+id,
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