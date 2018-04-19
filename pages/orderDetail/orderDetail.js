const { $, $$, tabbar } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad() {
		// this.setTabbar()
		this.setInfo()
	},
	setInfo() {
		$$.GetProductOrderCommonInfo(this.options.id).then(res => {
			res.productList = $.fmt(res.productList, 'product_cover')
			res.addtime = res.addtime.replace('T',' ')
			this.setData({ info: res, detail: res.DeliveryAddress })
		})
	},
	goPage(e) {
		$.goPage(e)
	},
	setTabbar() {
		new tabbar({
			btns: [{
				style: 2,
				text: '取消订单',
				callback: e => {
					$.log(1)
				}
			}, {
				style: 3,
				text: '付款',
				callback: e => {
					$.log(2)
				}
			}],
		})
	},
})