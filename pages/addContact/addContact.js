const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		input: {},
		region: ['广东省', '广州市', '天河区'],
	},
	onLoad(options) {
		const _this = $.getPrevPage()
		const isOrderFrom = _this.route.find('order')
		this.data.isOrderFrom = isOrderFrom
	},
	bindRegionChange: function (e) {
		this.setData({ region: e.detail.value })
	},
	input(e) {
		const { name, value } = $.dataset(e)
		this.data.input[name] = value
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
			contact,
			phone,
			region: region.join(' '),
			address,
			post_code,
		}
		$$.SaveDeliveryAddress(data).then(res => {
			const _this = $.getPrevPage()
			if (this.data.isOrderFrom) {
				const info = data
				data.id = res.data
				_this.setData({ info })
			}
			$.goBack()
		})
	},
	goPage(e) {
		$.goPage(e)
	}
})