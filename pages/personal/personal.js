const { $, $$, authorize, tabbar } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		nav: [{
			icon: 'i-bag',
			name: '待付款',
			status: 0,
		}, {
			icon: 'i-car1',
			name: '待发货',
			status: 1,
		}, {
			icon: 'i-car',
			name: '待收货',
			status: 3,
		}, {
			icon: 'i-note',
			name: '已完成',
			status: 4,
		}],
		list: [{
			icon: 'i-card',
			name: '我的会员卡',
			page: 'vip',
		}, {
			icon: 'i-card1',
			name: '联系方式',
			page: 'myContact',
		}, {
			icon: 'i-coupon',
			name: '优惠劵',
			page: 'myCoupon',
		}]
	},
	onLoad(options) {
		if (!$.store('userid')) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
		new tabbar({
			tabs2: 'home,cart',
			tabs3: 'sort,activity,vip'
		})
		this.setUser()
	},
	onShow() {
		this.setNav()
	},
	setNav() {
		const userid = $.store('userid')
		$$.GetProductOrderCommonListByUserID(userid).then(res => {
			const { nav } = this.data
			$.each(nav, (i, v) => {
				v.count = 0
				$.each(res, (i1, v1) => {
					if (v.status == v1.status) {
						v.count += 1
					}
				})
			})
			this.setData({ nav })
		})
	},
	setUser() {
		const userid = $.store('userid')
		$$.GetWeiweiUserInfo(userid).then(res => {
			this.setData({ user: res })
		})
	},
})