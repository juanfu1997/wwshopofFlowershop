const util = require('./util.js');

// 获取用户openid
function GetSessionKey(dataObj) {
  return util.get('/KorjoApi/GetSessionKey', dataObj)
}


function login() {
  return  new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
  })
}

function getOpenId(obj) {
   // 获取code
    login().then((res) => {
      // 获取openid
      const data = {
        id: util.data.appid,
        js_code: res.code
      }
      return GetSessionKey(data);
   }).then(res => {
      const openId = JSON.parse(res).openid;
      const unionId = JSON.parse(res).unionid;
      wx.setStorageSync(util.data.openIdStorage, openId);
      wx.setStorageSync(util.data.unionIdStorage, unionId);
      obj.success();
   })
}

function isLogin(obj, needUnionId) {
  if (needUnionId) {
    //需要获取unionid推送
    if (wx.getStorageSync(util.data.openIdStorage) && wx.getStorageSync(util.data.unionIdStorage)) {
      obj.success();
    } else {
      getOpenId(obj);
    }
  } else {
    if (wx.getStorageSync(util.data.openIdStorage)) {
      obj.success();
    } else {
      getOpenId(obj);
    }
  }
}


const authorize = {isLogin};

module.exports = {authorize};
