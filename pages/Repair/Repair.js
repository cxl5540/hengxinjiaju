import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    fileList: [],
    picLlist:[],
    id:'',
    question_info:'',
    formData:{ adress:'',content:''}
  },
  onLoad: function (options) {
    this.getinfo()
    // this.setData({
    //   id:options.id,
    // })
    // this.getdetail(options.id)
  },
  getinfo(){//获取个人信息
    http.getUserInfo({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code=='200'){
          this.setData({
            question_info:res.data.user_info
        })
        }
      }
    })
  },
  getdetail(question_id){
    http.question_edit({
        data:{
            question_id:question_id
        },
        success:res=>{
            if(res.code=='200'){
                this.setData({
                    question_info:res.data.question_info
                })
            }
        }
    })
  },
  delImg (file) {
    var index=file.detail.index;
    var fileList=this.data.fileList;
    var picLlist=this.data.picLlist;
    let that=this;
    console.log(fileList)
    console.log(picList)
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
      console.log(that.data.fileList)
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
      console.log(this.data.formData)
  },
  submit(){ //提交
    if(this.data.picLlist.length!==3){
      wx.showToast({
        title: '请上传三张图片',
        icon:'none'
      })
      return false;
    }
    http.question_runedit({
      data:{
        name:this.data.question_info.name,
        tel:this.data.question_info.tel,
        salesperson:this.data.question_info.salesperson?this.data.question_info.salesperson:'',
        address:this.data.question_info.address?this.data.question_info.address:'',
        describe:this.data.formData.content,
        uid:wx.getStorageSync('uid'),
        question_pic_url:JSON.stringify(this.data.picLlist) 
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