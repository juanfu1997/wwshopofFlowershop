const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		nav: [
			{ name: '未使用', btn: '立即\n使用', active: true, list: [] },
			{ name: '已使用', btn: '已使用', list: [] },
			{ name: '已过期', btn: '已过期', list: [] }
		],
	},
	onLoad(options) {
		this.setList()
	},
	setList() {
		const { nav } = this.data
		const userid = $.store('userid')
		$$.GetMyCouponList(userid).then(res => {
			res = this.fmtTime(res, 'start_time,end_time')
			$.each(res, (i, v) => {
				if (v.product_id && v.status == 2) {
					v.status = 0
				}
				v.btn = nav[v.status].btn
				nav[v.status].list.push(v)
			})
			this.data.nav = nav
			this.setEnabledCoupon()
		})
	},
	setEnabledCoupon() {
		const { nav } = this.data
		const _this = $.getPrevPage()
		if (_this && _this.route.find('order')) {
			const { order, product_price } = _this.data
			const arr = []
			$.each(order.list, (i, v) => {
				arr.push(v.id)
			})
			nav[0].list = nav[0].list.filter(v => {
				return (v.product_id && arr.includes(v.product_id) && product_price >= v.face_value) ||
					(!v.product_id && product_price >= v.threshold)
			})
		}
		this.setData({ nav })
	},
	tapNav(e) {
		const { idx } = $.dataset(e)
		const { nav } = this.data
		$.each(nav, (i, v) => {
			v.active = i == idx
		})
		this.setData({ nav })
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
	tapBtn(e) {
		const { item } = $.dataset(e)
		const _this = $.getPrevPage()
		if (_this.route.find('order')) {
			_this.data.coupon = item
			_this.setCoupon()
			$.goBack()
		} else {
			!item.status && wx.reLaunch({ url: '/pages/sort/sort' })
		}
	},
	goPage(e) {
		$.goPage(e)
	}
})