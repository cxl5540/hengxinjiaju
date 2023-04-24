import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    tabs: [],
    activeTab:0,
    activeNames: ['1'],
    list_1:[],
    list_2:[],
    list_3:[],
    coupon_id:'',
  },
  onLoad: function (options) {
    const titles = ['未使用', '已使用', '已过期']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
    this.getlist()
  },
  getlist(){
    http.coupon_list({
      data:{
        uid:wx.getStorageSync('uid'),
        page:1,
        limit:100
      },
      success:res=>{
        if(res.code==200){
          var list=res.data.coupon_list;
          var list_1=this.data.list_1,list_2=this.data.list_2,list_3=this.data.list_3;
          for(var i=0;i<list.length;i++){
            if(list[i].status==1){
              list_1.push(list[i])
            }else if(list[i].status==2){
              list_2.push(list[i])
            }else{
              list_3.push(list[i])
            }
          }
          this.setData({
            list_1:list_1,
            list_2:list_2,
            list_3:list_3,
          })
        }
      }
    })
  },
  onTabCLick(e) {//操作方式
    const index = e.detail.index
    this.setData({activeTab: index})
  },

  onChange(e) {  //操作方式
    const index = e.detail.index
    this.setData({activeTab: index})
  },

  getrules(e){ //未使用
    var index=e.currentTarget.dataset.index;
    var list_1=this.data.list_1;
    list_1[index].show=!list_1[index].show;
    this.setData({
      list_1:list_1
    })
  },
  getrules1(e){ //已使用
    var index=e.currentTarget.dataset.index;
    var list_2=this.data.list_2;
    list_2[index].show=!list_2[index].show;
    this.setData({
      list_2:list_2
    })
  },
  getrules2(e){ //已过期
    var index=e.currentTarget.dataset.index;
    var list_3=this.data.list_3;
    list_3[index].show=!list_3[index].show;
    this.setData({
      list_3:list_3
    })
  },
  onShareAppMessage(res){
    var id=res.target.dataset.id;
    var key=res.target.dataset.key;
    var price=res.target.dataset.price;
    return {
      title: '分享优惠券',
      desc: '分享优惠券给好友，券码：'+key+',券额：￥'+price,
      path: '/pages/index/index?coupon_id='+id+'&key='+key +'&price='+price// 路径，传递参数到指定页面。
     }
  }

})