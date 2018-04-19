const { $, $$, WxParse } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		list: Array(20),
	},
	onLoad(options) {
		$$.GetFansIntro().then(res => {
			// 详情
			const content = $.url2abs(res.content)
			WxParse.wxParse('content', 'html', content, this, 5)
		})
	},
	onShareAppMessage() {
		return { title: 'FM小程序知识普及' }
	},
})