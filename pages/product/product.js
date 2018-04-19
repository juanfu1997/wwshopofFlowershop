const { $, $$, tabbar, WxParse } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
		count: 1,
	},
	onLoad(options) {
		// this.setTabbar()
		this.setInfo()
	},
	onShow(){
		this.setTabbar()
	},
	setTabbar() {
		new tabbar({
			tabs1: 'contact,cart1',
			btns: [{
				style: 1,
				text: '加入购物车',
				callback: e => {
					this.data.activeBtn = 'add2Cart'
					this.togglePopup()
				}
			}, {
				style: 4,
				text: '立即购买',
				callback: e => {
					this.data.activeBtn = 'buyNow'
					this.togglePopup()
				}
			}],
		})
	},
	tapSize(e) {
		const { size } = $.dataset(e)
		const { info } = this.data
		this.setData({ 'info.currentSize': size })
	},
	submit() {
		const { activeBtn } = this.data
		activeBtn == 'add2Cart' ? this.add2Cart() : this.buyNow()
	},
	buyNow() {
		const { info, count } = this.data
		if (!info.currentSize) {
			$.alert('请选择尺码！')
			return
		}
		const order = {
			list: [{
				id: info.id,
				checked: true,
				image: info.product_cover,
				name: info.product_name,
				price: info.price,
				color: info.color,
				size: info.currentSize,
				count,
			}],
			price: info.price * count
		}
		$.store('order', order)
		wx.navigateTo({ url: '/pages/order/order' })
	},
	add2Cart() {
		const { info, count } = this.data
		if (!info.currentSize) {
			$.alert('请选择尺码！')
			return
		}
		const cart = $.store('cart') || []
		let bool = false
		$.each(cart, (i, v) => {
			if (v.id == info.id && v.size == info.currentSize) {
				v.count = count
				bool = true
				return false
			}
		})
		if (!bool) {
			const product = {
				id: info.id,
				checked: false,
				image: info.product_cover,
				name: info.product_name,
				price: info.price,
				color: info.color,
				size: info.currentSize,
				count,
			}
			cart.unshift(product)
		}
		$.store('cart', cart)
		// 购物车红点
		this.setData({ '_tabbar_.tabs1[1].active': true })
		// 隐藏弹层
		this.togglePopup()
		// 提示
		$.toast('加入成功')
	},
	setInfo() {
		const { id } = this.options
		$$.GetWeiweiProductInfo(id).then(res => {
			res.price = parseFloat(res.price)
			res.sizeArr = res.size.split(',')
			this.setData({ info: $.fmt(res, 'product_cover') })
			// 产品详情
			const detail = $.url2abs(res.product_detail)
			WxParse.wxParse('detail', 'html', detail, this, 5)
		})
	},
	showImage(e) {
		$.showImage(e)
	},
	minus() {
		const { count } = this.data
		if (count == 1) return
		this.setData({ count: count - 1 })
	},
	plus() {
		const { count, info } = this.data
		if (count == info.stock) return
		this.setData({ count: count + 1 })
	},
	togglePopup() {
		this.setData({ showPopup: !this.data.showPopup })
	},
	onShareAppMessage() {
		const { info } = this.data
		return {
			title: info.product_name,
			imageUrl: info.product_cover,
		}
	},
})