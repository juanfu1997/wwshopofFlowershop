const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		const userid = $.store('userid')
		if (!userid) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
		$$.GetCouponList().then(res => {
			this.data.list = this.fmtTime(res, 'start_time,end_time')
			return $$.GetMyCouponList(userid)
		}).then(res => {
			const { list } = this.data
			$.each(list, (i, v) => {
				$.each(res, (i1, v1) => {
					if (v.id == v1.coupon_id) {
						v.status = 1
						return false
					}
				})
			})
			this.setData({ list })
		})
	},
	receive(e) {
		const { id, idx } = $.dataset(e)
		$$.SaveMyCoupon({
			userid: $.store('userid'),
			coupon_id: id
		}).then(res => {
			this.togglePopup()
			const { list } = this.data
			list[idx].status = 1
			this.setData({ list })
		})
	},
	fmtTime(res, str) {
		const arr = str.split(',')
		$.each(res, (i, v) => {
			$.each(arr, (i1, v1) => {
				v[v1] = v[v1].split('T')[0]
			})
		})
		return res
	},
	goPage(e) {
		$.goPage(e)
	},
	togglePopup() {
		this.setData({ showPopup: !this.data.showPopup })
	}
})