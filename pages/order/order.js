const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		freight: '免运费',
		fare: 0,
		fare2: '0.00',
		msg: '',
		coupon: {
			face_value: 0
		}
	},
	onLoad(options) {
		this.setOrder()
		this.setInfo()
		this.setCoupon()
		this.setUser()
	},
	setOrder() {
		const order = $.store('order')
		const product_price = order.price
		const product_price2 = product_price.toFixed(2)
		this.setData({ order, product_price, product_price2 })
	},
	setUser() {
		const userid = $.store('userid')
		$$.GetWeiweiUserInfo(userid).then(res => {
			this.setData({ user: res })
		})
	},
	setCoupon() {
		const { order, fare, coupon, product_price } = this.data
		const discount = coupon.face_value
		const all_price = product_price - discount + fare
		if (coupon.product_id) {
			coupon.text = '立减' + coupon.face_value
		} else {
			coupon.text = coupon.id ? '满' + coupon.threshold + '可用' : '选择优惠券'
		}
		this.setData({
			coupon,
			discount,
			discount2: discount.toFixed(2),
			all_price,
		})
	},
	togglePopup() {
		this.setData({ showPopup: !this.data.showPopup })
	},
	setInfo() {
		const userid = $.store('userid')
		$$.GetDeliveryAddressList(userid).then(res => {
			this.setData({ info: res[0] || '' })
		})
	},
	input(e) {
		this.data.msg = e.detail.value
	},
	submitOrder() {
		const { info, coupon, fare, msg, all_price, order, discount, freight } = this.data
		if (!info) {
			$.alert('请先选择收货人信息')
			return
		}
		const relationList = []
		$.each(order.list, (i, v) => {
			relationList.push({
				product_id: v.id,
				number: v.count,
				size: v.size,
			})
		})
		const data = {
			contact_id: info.id,
			userid: $.store('userid'),
			freight,
			mycoupon_id: coupon.id,
			leaving_message: msg,
			product_price: order.price,
			coupon_price: discount,
			freight_price: fare,
			all_price,
			wxpublic_id: $.data.appid,
			relationList,
		}
		// 保存订单
		$$.SaveProductOrderCommon(data).then(res => {
			// 提交成功清除购物车
			// this.clearCart()
			//更新优惠券状态
			if (coupon.id) {
				const data = { id: coupon.id, status: 1 }
				$$.UpdateMyCouponStatus(data)
			}
			this.pay(res.data)
		})
	},
	// 支付
	pay(data) {
		const order_id = data.split(',')[0]
		const order_pay_id = data.split(',')[1]
		const { all_price, user } = this.data
		if (all_price > user.balance) {
			$$.PayCommon(order_pay_id).then(res => {
				const data = JSON.parse(res.data)
				wx.requestPayment(Object.assign(data, {
					'success': res => {
						this.paySuccess()
					},
					'fail': res => {
						$.toast('支付失败')
						this.goNext()
					}
				}))
			})
		} else {
			$$.UpdateBalanceAndOrderStatus(order_id).then(res => {
				this.paySuccess()
			})
		}
	},
	paySuccess() {
		const { user, all_price } = this.data
		// 更新积分
		const data = {
			userid: $.store('userid'),
			integral: user.integral + parseInt(all_price),
		}
		$$.UpdateUserIntegral(data).then(res => {
			$.toast('支付成功')
			this.goNext()
		})
	},
	goNext() {
		setTimeout(() => {
			wx.reLaunch({ url: '../personal/personal' })
		}, 1000)
	},
	input(e) {
		this.data.msg = e.detail.value
	},
	clearCart() {
		const { order, cart } = $.store()
		$.each(order.list, (i, v) => {
			$.each(cart, (i1, v1) => {
				if (v.id == v1.id) {
					cart.splice(i1, 1)
					return false
				}
			})
		})
		$.store('cart', cart)
	},
	goPage(e) {
		$.goPage(e)
	}
})