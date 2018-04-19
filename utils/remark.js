function store() {
	//设置
	$.store('a', 1)
	$.store({ b: 2, c: 3 })
	// 获取
	$.log($.store('a'))
	$.log($.store())
	// 移除
	$.remove('a')
	$.remove('a', 'b')
	$.remove()
}

function clone() {
	// [].concat(arr)
	// arr.slice(0)
}

function getText(str) {
	// html提取纯文本
	return str.replace(/<\/?[div|section|p].*?>|<\/?section.*?>|<\/?p.*?>|<img.*?>|<br.*?\/>|&nbsp;|<\/?span.*?>|<\/?a.*?>|<\/?em.*?>|<\/?strong.*?>|<\/?ul.*?>|<\/?li.*?>|<\/?dl.*?>|<\/?dt.*?>|<\/?dd.*?>|<\/?b.*?>|<\/?h\d.*?>/gi, '').replace(/&#39;/ig, "'")
}

function log(...s) {
	console.log(s.length > 1 ? s : s[0])
}

function goPage() {
	!openType && wx.navigateTo({ url })
	openType == 'redirect' && wx.redirectTo({ url })
	openType == 'reLaunch' && wx.reLaunch({ url })
	openType == 'back' && wx.navigateBack({ delta: 1 })
}

function param(json) {
	const arr = []
	each(json, (i, v) => {
		arr.push(`${i}=${v}`)
	})
	return arr.join('&')
}

function SaveDataJsonCommon() {
	$$.SaveDataJsonCommon({
		wxpublic_id: $.data.appid,
		datajson: JSON.stringify({
			"touser": "",
			"msgtype": "link",
			"link": {
				"title": "粉我吧科技",
				"description": "关注粉我吧科技公众号，接收订单状态更新通知",
				"url": "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA4Nzc0Nzk3Mg==&scene=124#wechat_redirect",
				"thumb_url": $.data.img+'fans-me.jpg'
			}
		})
	}).then(res => {

	})
}
