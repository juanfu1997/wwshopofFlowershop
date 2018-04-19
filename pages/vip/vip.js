const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		list: [{
			icon: 'i-coin',
			name: '剩余积分',
			value: '0',
		}, {
			icon: 'i-wallet',
			name: '卡内余额',
			value: '0',
		}, {
			icon: 'i-gift',
			name: '积分兑换',
			page: 'exchange',
		}, {
			icon: 'i-card',
			name: '会员卡充值',
			page: 'topup',
		}, {
			icon: 'i-cal',
			name: '会员权益',
			page: 'vipDesc',
		}]
	},
	onLoad(options) {
		if (!$.store('userid')) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
	},
	onShow() {
		this.setUser()
	},
	setUser() {
		const userid = $.store('userid')
		$$.GetWeiweiUserInfo(userid).then(res => {
			this.setData({
				user: res,
				'list[0].value': res.integral,
				'list[1].value': res.balance
			})
		})
	},
	goPage(e) {
		$.goPage(e)
	}
})