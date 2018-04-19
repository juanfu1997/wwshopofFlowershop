const { $, $$, authorize, tabbar } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		if (!$.store('userid')) {
			wx.reLaunch({ url: '../login/login' })
			return
		}
		this.setList()
		this.setTabbar()
	},
	onShow(){
		this.setTabbar()
	},
	setTabbar() {
		new tabbar({
			tabs2: 'home,cart',
			tabs3: 'sort,activity,vip'
		})
	},
	// 商品列表
	setList() {
		const cart = $.store('cart') || []
		this.data.list = cart
		this.setData({ list: cart, showTip: !cart.length, checked: this.isChecked() })
		this.calcPrice()
		this.setTitle()
	},
	// 头部标题
	setTitle() {
		wx.setNavigationBarTitle({ title: `购物车（${this.data.list.length}）` })
	},
	// 选择商品
	selectProduct(e) {
		const { idx } = $.dataset(e)
		const { list } = this.data
		list[idx].checked = !list[idx].checked
		this.setData({ list, checked: this.isChecked() })
		this.calcPrice()
	},
	// 全选
	selectAll() {
		const { list, checked } = this.data
		$.each(list, (i, v) => {
			v.checked = !checked
		})
		this.setData({ list, checked: !checked })
		this.calcPrice()
	},
	// 判断是否全选
	isChecked() {
		const { list } = this.data
		let checked = true
		$.each(list, (i, v) => {
			if (!v.checked) {
				checked = false
				return false
			}
		})
		return checked
	},
	// 删除商品
	delProduct(e) {
		const { idx } = $.dataset(e)
		const { list } = this.data
		$.confirm('确认要删除该商品吗？', () => {
			list.splice(idx, 1)
			this.setData({ list, showTip: !list.length })
			this.calcPrice()
			this.saveCart()
			this.setTitle()
		})
	},
	// 计算价格
	calcPrice() {
		const { list } = this.data
		let price = 0
		$.each(list, (i, v) => {
			if (v.checked) {
				price += v.price * v.count
			}
		})
		this.setData({ price })
	},
	// 数量-1
	minus(e) {
		const { idx } = $.dataset(e)
		const { list } = this.data
		if (list[idx].count == 1) return
		list[idx].count -= 1
		this.setData({ list })
		this.calcPrice()
		this.saveCart()
	},
	// 数量+1
	plus(e) {
		const { idx } = $.dataset(e)
		const { list } = this.data
		list[idx].count += 1
		this.setData({ list })
		this.calcPrice()
		this.saveCart()
	},
	// 保存购物车
	saveCart() {
		const { list } = this.data
		const cart = $.clone(list)
		$.each(cart, (i, v) => {
			v.checked = false
		})
		$.store('cart', cart)
	},
	// 提交订单
	submit() {
		const { list, price } = this.data
		const order = { list: [], price }
		$.each(list, (i, v) => {
			v.checked && order.list.push(v)
		})
		if (order.list.length == 0) {
			$.alert('您还没有选择商品')
			return
		}
		$.store('order', order)
		wx.navigateTo({ url: `/pages/order/order` })
	},
})