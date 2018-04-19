const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		nav: [{
			name: '全部',
		}, {
			name: '待付款',
		}, {
			name: '待发货',
		}, {
			name: '待收货',
		}, {
			name: '已完成',
		}],
		current: 0,
		status: { 0: '待付款', 1: '待发货', 2: '已退款', 3: '待收货', 4: '已完成', 5: '已取消' },
	},
	onLoad(options) {
		this.setData({ current: options.current })
		this.setList()
	},
	setUser() {
		const userid = $.store('userid')
		$$.GetWeiweiUserInfo(userid).then(res => {
			this.setData({ user: res })
		})
	},
	setList() {
		this.setUser()
		// 重置list
		const { nav, status } = this.data
		$.each(nav, (i, v) => {
			v.list = []
		})
		const userid = $.store('userid')
		$$.GetProductOrderCommonListByUserID(userid).then(res => {
			$.each(res, (i, v) => {
				// 商品名称
				v.productList = $.fmt(v.productList, 'product_cover')
				// 状态
				v.statusText = status[v.status]
				// 订单列表
				$.each(nav, (i1, v1) => {
					if (v.statusText == v1.name) {
						v1.list.push(v)
						return false
					}
				})
			})
			// 全部订单
			nav[0].list = res
			this.setData({ nav })
		})
	},
	// 点击导航
	tapNav(e) {
		const { idx } = $.dataset(e)
		this.setData({ current: idx })
	},
	// 点击按钮
	tapBtn(e) {
		const { id, status, order_pay_id, all_price } = $.dataset(e)
		this.data.order_id = id
		if (status == 1) {
			// 支付
			this.data.all_price = all_price
			this.pay(order_pay_id)
		} else if (status == 6) {
			// 提醒发货
			this.notice()
		} else if (status == 2) {
			// 退款
			this.refund(order_pay_id)
		} else {
			const data = { id, status }
			$$.UpdateOrderStatus(data).then(res => {
				if (status == 5) {
					// 取消订单
					const content = res == 201 ? '商家已发货，订单不能取消！' : '订单已取消'
					$.alert(content)
				} else if (status == -1) {
					$.alert('订单已删除')
				}
				this.setList()
				// { 0: '待付款', 1: '待发货', 2: '已退款', 3: '待收货', 4: '已完成', 5: '已取消' }
			})
		}
	},
	// 提醒发货
	notice() {
		$$.UpdateOrderNotice(this.data.order_id).then(res => {
			this.toggleSuccess1()
		})
	},
	// 退款
	refund(order_pay_id) {
		const { order_id } = this.data
		$$.GetProductOrderCommonInfo(order_id).then(res => {
			if (res.status > 2) {
				$.alert('商家已发货，不能退款')
				this.setList()
			} else {
				$$.RunCommon(order_pay_id).then(res => {
					const data = { id: order_pay_id, status: 2 }
					$$.UpdateOrderPayStatus(data).then(res => {
						$.alert('退款成功')
						this.setList()
					})
				})
			}
		})
	},
	// 支付
	pay(order_pay_id) {
		const { all_price, user, order_id } = this.data
		if (all_price > user.balance) {
			$$.PayCommon(order_pay_id).then(res => {
				const data = JSON.parse(res.data)
				wx.requestPayment(Object.assign(data, {
					'success': res => {
						this.paySuccess()
					},
					'fail': res => {
						$.toast('付款失败')
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
			this.setList()
			$.toast('付款成功')
		})
	},
	// 订单完成弹层
	toggleSuccess() {
		this.setData({ showSuccess: !this.data.showSuccess })
	},
	// 提醒发货成功弹层
	toggleSuccess1() {
		this.setData({ showSuccess1: !this.data.showSuccess1 })
	},
	goPage(e) {
		$.goPage(e)
	}
})