const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		input: {},
	},
	onLoad(options) {
		if (!$.store('userid')) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
		this.setUser()
	},
	setUser() {
		const userid = $.store('userid')
		$$.GetWeiweiUserInfo(userid).then(res => {
			this.setData({ user: res })
		})
	},
	input(e) {
		const { name, value } = $.dataset(e)
		this.data.input[name] = value
	},
	topup() {
		const { input, user } = this.data
		const total_fee = parseFloat(input.total_fee) * 100
		if (!total_fee) {
			$.alert('请输入充值金额')
			return
		}
		const data = {
			openid: user.openid,
			total_fee,
			wxpublic_id: $.data.appid
		}
		$$.SaveRechargeInfo(data).then(res => {
			this.pay(parseInt(res.data))
		})
	},
	// 支付
	pay(order_pay_id) {
		$$.PayCommon(order_pay_id).then(res => {
			const data = JSON.parse(res.data)
			wx.requestPayment(Object.assign(data, {
				'success': res => {
					$.toast('充值成功')
					this.setData({ 'input.total_fee': '' })
				},
				'fail': res => {
					$.toast('充值失败')
				}
			}))
		})
	},
})