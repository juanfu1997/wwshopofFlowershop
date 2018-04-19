const { $, $$ } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		$$.GetProductOrderCommonInfo(options.id).then(res => {
			this.setData({ couriername: res.couriername })
			return $$.GetOrderTracesByJson({
				ShipperCode: res.abbreviation,
				LogisticCode: res.express
			})
		}).then(res => {
			this.setData({ info: res })
		})
	},
})