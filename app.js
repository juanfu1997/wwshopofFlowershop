// var aldstat = require("./utils/ald-stat.js");
App({
	data: {
		img: 'https://www.korjo.cn/xcx/wwshopImg/',
		host: 'https://www.korjo.cn',
		openid: null,
    unionid: null,
		appid: 87,
	},
	onShareAppMessage() {
		return { title: '薇薇小商店' }
	},
	getOpenId: function (success) {
        var self = this
        const appid = this.data.appid
        const openid = wx.getStorageSync('calendarUserid')
        const unionid = wx.getStorageSync('unionid')
        if (openid && unionid) {
            self.data.openid = openid
            self.data.unionid = unionid
        }
        if (self.data.openid) {
            success()
        } else {
            // 获取code
            wx.login({
                success: function (data) {
                    // 获取openid
                    wx.request({
                        url: 'https://www.korjo.cn/KorjoApi/GetSessionKey?id=' + appid + '&js_code=' + data.code,
                        success: function (res) {
                            const data = JSON.parse(res.data)
                            const openid = data.openid
                            const unionid = data.unionid
                            self.data.openid = openid
                            self.data.unionid = unionid
                            wx.setStorageSync('calendarUserid', openid)
                            wx.setStorageSync('unionid', unionid)
                            success()
                        },
                        fail: function (res) {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                        }
                    })
                },
                fail: function (err) {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                }
            })
        }
    },
    goBack: function () {
        wx.navigateBack({ delta: 1 })
    },
    goHome: function () {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    }
})