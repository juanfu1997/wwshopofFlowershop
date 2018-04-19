const $ = require('../../utils/util')
const $$ = require('../request/index')
let success, fail

module.exports = {
	getUser,
	getOpenID,
}

function getUser(data) {
	success = data.success
	fail = data.fail
	console.log('getUser',data)
	// 是否获取到userid
	if ($.store('userid')) {
		success()
	} else if ($.store('openid')) {
		getUserInfo()
	} else {
		getOpenID()
	}
}

function getOpenID() {
	// 获取code
	$.login().then(res => {
		// 获取openid
		const data = {
			id: $.data.appid,
			js_code: res.code,
		}
		return $$.GetSessionKey(data)
	}).then(res => {
		const { openid, unionid } = JSON.parse(res)
		$.store({ openid })
		unionid && $.store({ unionid })
		// 获取用户信息
		getUserInfo()
	})
}

function getUserInfo() {
	if ($.store('userInfoRefuse')) {
		// 打开授权设置
		$.openSetting().then(res => {
			if (res.authSetting["scope.userInfo"]) {
				return $.getUserInfo()
			} else {
				fail()
			}
		}).then(res => {
			getUserInfoSuccess(res.userInfo)
		})
	} else {
		// 获取用户信息
		$.getUserInfo().then(res => {
			getUserInfoSuccess(res.userInfo)
		}, res => {
			fail()
			$.store('userInfoRefuse', true)
		})
	}
}

function getUserInfoSuccess(userInfo) {
	// 保存用户信息
	const data = {
		wxpublic_id: $.data.appid,
		openid: $.store('openid'),
		photo: userInfo.avatarUrl,
	}
	$.store('userInfo', data)
	$.remove('openid', 'userInfoRefuse')
	console.log('data',data)
	success()
}