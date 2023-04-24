import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    status_id:'2',
    status_type:'已处理',
    id:'',
    invoice_type_list:['已处理','未处理'],
    fileList: [],
    picLlist:[],
    question_info:'',
    question_pic_url:[],
    after_sales_pic_url:[],
    formData:{
      money:'',remarks:''
    }
  },
  onLoad: function (options) {
    this.setData({
      id:options.id,
    })
    this.getdata();
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
  change_type(e){ //切换
    var status_id=Number(e.detail.value)+2;
        this.setData({
          status_id:status_id,
          status_type:status_id==2?'已处理':'无法处理',
        });
  },
  delImg (file) {
    var index=file.detail.index;
    var fileList=this.data.fileList;
    var picLlist=this.data.picLlist;
    let that=this;
    util.showmodel('提示','是否确定删除?').then(function (data) {
      if(data){
        fileList.splice(index,1);
        picLlist.splice(index,1);
      }
      that.setData({
        fileList:fileList,
        picLlist:picLlist
      })
    })
  },
  afterRead(event) {
    const { file } = event.detail;   
    var that = this
    const fileList = that.data.fileList
    //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
    const thisNum = file.length 
    const beforeNum = fileList.length 
    const totalNum = thisNum + beforeNum
    //还没上传时将选择的图片的上传状态设置为加载    
    for (let j = 0; j < thisNum; j++) {
      file[j].status='uploading'
      fileList.push(file[j])
    }
    that.setData({ fileList })
    // console.log('fileList',that.data.fileList)
    // console.log('file',file)
    //上传服务器
    for (let i = beforeNum; i < totalNum; i++) {
          that.uploadImg(i,that.data.fileList[i].url )
    }
  },
  uploadImg(fileListIndex,fileURL) {
    var that = this
    //上传文件
    const filePath = fileURL // 小程序临时文件路径
    wx.uploadFile({
      url: app.globalData.url+'api/Index/apppost',
      filePath: filePath,
      name: 'pic',
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: { 
        action:'AfterSales/upload',
        fileType:'image',
        reName:'true',
        thumbnail:'true'
      },
      success(res) {
      var tem = JSON.parse(res.data);
     // console.log(tem)
      // 上传完成需要更新 fileList
      that.setData({
        [`fileList[${fileListIndex}].url`]:app.globalData.url+tem.data,
        [`fileList[${fileListIndex}].status`]: 'done',
        [`picLlist[${fileListIndex}].url`]:tem.data,
      })
      wx.showToast({ title: '上传成功', icon: 'none' })
      console.log(that.data.picLlist)
      },
     
      fail: function (res) {
        console.log("file upload fail")
      },
    })
  },
  inputWacth(e){
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    formData[item] = e.detail.value;
    this.setData({
      formData:formData
      }); 
  },
  submit(){ //提交
    for(var i in this.data.formData){
      if(!this.data.formData[i]){
        wx.showToast({
          title: '请填写完信息再提交',
          icon:'none'
        })
        return false;
      }
    }
    if(this.data.picLlist.length!==3){
      wx.showToast({
        title: '请上传三张图片',
        icon:'none'
      })
      return false;
    }
    http.after_sales_deal_with({
      data:{
        money:this.data.formData.money,
        remarks:this.data.formData.remarks,
        status_id:this.data.status_id,
        question_id:this.data.id,
        uid:wx.getStorageSync('uid'),
        after_sales_pic_url:JSON.stringify(this.data.picLlist) 
      },
      success: res => {
        if(res.code=='200'){
          wx.showToast({
            title:res.msg,
          })
          setTimeout(res=>{
            wx.navigateBack()
          },500)
        }
        wx.showToast({
          title:res.msg,
          icon:'none'
        })
      }
    })
  }
})