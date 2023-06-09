const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function showmodel(title, content) {
  return new Promise(function (resolve, reject) {
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        var fa = ''
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      }
    })
  })
}

function copy(text) { //复制
  wx.setClipboardData({
    data: text,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          // data console.log(res.data)
          wx.showToast({
            title: '复制成功，分享给好友或自己使用',
            icon: 'none'
          })
        }
      })
    }
  })
}

function changedate(shijianchuo, type) {
  var date = new Date(shijianchuo * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if (type == 1) {
    return Y + '年' + M + '月' + D + '日';
  } else {
    return Y + M + D;
  }

}

function chooseWxImage(type) {
  var that = this;
  wx.chooseImage({
    sizeType: ['original', 'compressed'],
    sourceType: [type],
    success: function (res) {
      console.log(res);
      // tempFilePath可以作为img标签的src属性显示图片
      //  img: res.tempFilePaths[0],
      if (res.tempFilePaths[0]) {
        if (that.checkRes) {
          that.checkRes(res.tempFilePaths);
        }
      }
    }
  })
}

function login(encryptedData,iv) {
  let that = this;
  wx.showLoading({
    title: '授权中...',
  });
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        wx.getSetting({
          success: res1 => {
            if (res1.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: res2 => { //获取信息  
                  var data = {
                    action: 'Login/login',
                    js_code: res.code,
                    encryptedData:encryptedData,
                    iv:iv
                  };
                  wx.request({ //传后台
                    url:app.globalData.url+'api/Index/apppost',
                    method: 'POST',
                    // contentType : 'application/json;charset=UTF-8',
                    header: {
                      'content-type': 'application/json; charset=UTF-8'
                    },
                    data: JSON.stringify(data),
                    success: res3 => {
                      if (res3.data.code == '200') {
                        if (that.checkLoginReadyCallback) {
                          that.checkLoginReadyCallback(res3.data.data.userInfo.uid);
                        }
                        wx.setStorageSync('uid',res3.data.data.userInfo.uid);
                        wx.showToast({
                          title:'授权成功',
                          duration: 2000,
                        })
                      } else {
                        wx.showToast({
                          title: res3.data.msg,
                          duration: 2000,
                          icon: 'none',
                        })
                      }
                    },
                    complete: function () {
                      wx.hideLoading();
                    }
                  })
                }
              })
            }
          }
        })
      }
    },
  })

}
module.exports = {
  formatTime,
  showmodel,
  copy,
  login,
  chooseWxImage,
  changedate
}