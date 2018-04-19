const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	goPage(e) {
		$.goPage(e)
	},
	formSubmit(e) {
		let { phone = '', password = '' } = $.dataset(e).value
		phone = phone.trim()
		password = password.trim()
		if (!phone || !password) {
			$.alert('手机号码和密码不能为空！')
			return
		}
		if (phone.length < 11 || phone[0] != 1) {
			$.alert('请填写正确的手机号码！')
			return
		}
		const data = { phone, password }
		$$.GetAdminOrder(data).then(res => {
			if (res.status == 201) {
				$.alert('账号不存在或密码错误')
				return
			}
			const userid = parseInt(res.data)
			$.store({ userid })
			wx.reLaunch({ url: '../index/index' })
		})
	},
	getCode() {
		let second = 60
		this.setData({ second })
		const timer = setInterval(() => {
			second ? this.setData({ second: --second }) : clearInterval(timer)
		}, 1e3)
	}
})