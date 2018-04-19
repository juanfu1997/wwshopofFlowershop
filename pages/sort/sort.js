const { $, $$, tabbar } = require('../../dist/index')

Page({
	data: {
		img: $.data.img,
	},
	onLoad(options) {
		// this.setTabbar()
		this.setSidebar()
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
	setSidebar() {
		$$.GetWeiweiTypeList().then(res => {
			res.unshift({ id: 0, weiwei_type: "所有宝贝" })
			this.setData({ sidebar: res })
			this.setProductList(this.options.id || 0)
		})
	},
	setProductList(id) {
		this.data.current = id
		parseInt(id) ? $$.GetProductListByTypeID(id).then(res => {
			this.dealRes(res)
		}) : $$.GetProductListAll().then(res => {
			this.dealRes(res)
		})
	},
	tapLi(e) {
		const { id } = $.dataset(e)
		const { current } = this.data
		if (id == current) return
		this.setProductList(id)
	},
	dealRes(res) {
		this.setData({
			current: this.data.current,
			list: $.fmt(res, 'product_cover')
		})
	},
})