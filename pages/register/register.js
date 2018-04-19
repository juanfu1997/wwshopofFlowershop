const { $, $$, authorize } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	goPage(e) {
		$.goPage(e)
	},
	formSubmit(e) {
		let { username = '', phone = '', password = '' } = $.dataset(e).value
		username = username.trim()
		phone = phone.trim()
		password = password.trim()
		if (!username || !phone || !password) {
			$.alert('输入值不能为空！')
			return
		}
		if (phone.length < 11 || phone[0] != 1) {
			$.alert('请填写正确的手机号码！')
			return
		}
		// 授权
		authorize.getUser({
			success: () => {
				const data = $.store('userInfo')
				data.relname = username
				data.phone = phone
				data.password = password
				$$.SaveUserInfo(data).then(res => {
					if (res.status == 201) {
						$.alert('用户已存在!')
						return
					}
					$.remove('userInfo')
					$.alert('注册成功！', () => {
						wx.reLaunch({ url: '../login/login' })
					})
				})
			},
			fail: () => {
				$.alert('请先授权完成注册')
			}
		})
	},
})