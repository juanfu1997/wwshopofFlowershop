const { $, $$, WxParse } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		$$.GetVipDescriptionInfo().then(res => {
			// 详情
			const content = $.url2abs(res.description)
			WxParse.wxParse('content', 'html', content, this, 5)
		})
	},
})