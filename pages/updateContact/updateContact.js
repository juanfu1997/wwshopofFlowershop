const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		$$.GetDeliveryAddressInfo(options.id).then(res => {
			this.setData({
				input: res,
				region: res.region.split(' ')
			})
		})
	},
	input(e) {
		const { name, value } = $.dataset(e)
		this.data.input[name] = value
	},
	bindRegionChange: function (e) {
		this.setData({ region: e.detail.value })
	},
	submit() {
		const { input, region } = this.data
		let { contact = '', phone = '', address = '', post_code = '' } = input
		contact = contact.trim()
		phone = phone.trim()
		address = address.trim()
		if (!contact || !phone || !address) {
			$.alert('填写信息不能为空')
			return
		}
		if (phone.length < 11 || phone[0] != 1) {
			$.alert('请输入正确的手机号码')
			return
		}
		const data = {
			userid: $.store('userid'),
			id: this.options.id,
			contact,
			phone,
			region: region.join(' '),
			address,
			post_code,
		}
		$$.SaveDeliveryAddress(data).then(res => {
			$.goBack()
		})
	},
	del() {
		$$.DeleteDeliveryAddress(this.options.id).then(res => {
			if (res == '201') {
				$.alert('至少要有一条联系方式')
			} else {
				$.goBack()
			}
		})
	},
})