const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img
	},
	onLoad(options) {
		if (!$.store('userid')) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
		this.setList()
	},
	setList() {
		const userid = $.store('userid')
		$$.GetCouponProductList(userid).then(res => {
			this.data.list = $.fmt(res, 'product_cover')
			return $$.GetWeiweiUserInfo(userid)
		}).then(res => {
			const { list } = this.data
			$.each(list, (i, v) => {
				v.enabled = v.threshold <= res.integral
			})
			this.setData({ list })
		})
	},
	exchange(e) {
		const { id } = $.dataset(e)
		const data = {
			userid: $.store('userid'),
			coupon_id: id,
		}
		$$.SaveMyIntegralCoupon(data).then(res => {
			this.setList()
		})
	}
})