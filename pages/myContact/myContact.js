const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad() {
	},
	onShow() {
		const userid = $.store('userid')
		$$.GetDeliveryAddressList(userid).then(res => {
			this.setData({ list: res })
		})
	},
	tapLi(e) {
		const { idx } = $.dataset(e)
		const { list } = this.data
		const _this = $.getPrevPage()
		if (_this.route.find('personal')) return
		_this.setData({ info: list[idx] })
		$.goBack()
	},
	goPage(e) {
		$.goPage(e)
	}
})