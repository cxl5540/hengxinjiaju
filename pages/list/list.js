import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    status: 0,
    type_p:1,
    page:1,
    pages:0,
    cityArray :[{name:'全部', value:0},{name:'未处理', value:1},{ name:'已处理',value:2},{ name:'无法处理',value:3}],
    status_id:'',
    type:'全部',
    Salary_type:'全部',
    list:[],
    triggered:false,
    is_data:true,
    tabHeiaght:400
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-70,
      type_p:options.type
    })
    this.getlist(); 
  },
 
  change_Salarytype(e){ //切换薪资类型
    var index=e.detail.value;
    var Salarylist=this.data.Salarylist;
    this.setData({
      Salary_type:Salarylist[index].salaryName,
      salaryCode:Salarylist[index].salaryCode,
      page:1,
      list:[],
      is_data:true
    })
    this.getlist();   
  },
  change_type(e){ //切换
    var status_id=e.detail.value;
        this.setData({
          status_id:status_id,
          type:status_id==0?'全部':status_id==1?'未处理':status_id==2?'已处理':'无法处理',
          page:1,
          list:[],
          is_data:true
        });
     this.getlist();   
  },
  choose_date(e){ //选时间
    this.setData({
      input_time:e.detail.value.substring(0,4),
      page:1,
      list:[],
      is_data:true
    })
    this.getlist();
  },
  getlist(){
    http.question_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
        status_id:this.data.status_id
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
    var status=e.currentTarget.dataset.status;
    
    if(status==1&&this.data.type_p==3){
      wx.navigateTo({
        url: '/pages/handle/handle?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/detail/detail?id='+id,
      })
    }
    
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