module.exports = { tabbar }

const $ = require('../../utils/util')
const $$ = require('../request/index')

const _tabbar_ = {
	home: {
		icon: 'i-home',
		text: '首页',
		page: 'index',
	},
	cart: {
		icon: 'i-cart',
		text: '购物车',
		page: 'cart',
	},
	contact: {
		icon: 'i-contact',
		text: '客服',
	},
	cart1: {
		icon: 'i-cart',
		text: '购物车',
		page: 'cart',
	},
	// 按钮
	sort: {
		text: '宝贝分类',
		link: [{ id: 0, weiwei_type: "所有宝贝" }],
	},
	activity: {
		text: '提醒',
		link: [
			{ weiwei_type: '新华到店', page: 'remind',id:'3' },
			{ weiwei_type: '课程提醒', page: 'remind',id:'4'  },
			{ weiwei_type: '最新优惠', page: 'remind',id:'5'  },
		],
	},
	vip: {
		text: '会员福利',
		link: [
			{ weiwei_type: '积分查询', page: 'vip' },
			{ weiwei_type: '积分兑换', page: 'exchange' },
			{ weiwei_type: '余额充值', page: 'topup' },
			{ weiwei_type: '个人中心', page: 'personal' },
			{ weiwei_type: '鲜花日历', page: 'calender' }
		],
	},
}

const fns = {
	goPage(e) {
		const { page, openType } = $.goPage(e)
		if (this.data._tabbar_.current == page && openType == 'reLaunch') return
		$.goPage(e)
	},
	noop() {
		return
	},
	tapButton(e) {
		const { idx } = $.dataset(e)
		const btn = _tabbar_.btns[idx]
		btn.callback && btn.callback(e)
	},
	tapTab(e) {
		const { idx } = $.dataset(e)
		const tabs3 = _tabbar_.tabs3
		$.each(tabs3, (i, v) => {
			if (i == idx) {
				v.show = !v.show
			} else {
				v.show = false
			}
		})
		this.setData({ '_tabbar_.tabs3': tabs3 })
	},
	setProductTypeList() {
		if ($.store('sort') && _tabbar_.current != 'index') {
			_tabbar_.sort = $.store('sort')
			return
		}
		$$.GetWeiweiTypeList().then(res => {
			const link = res.concat(_tabbar_.sort.link.slice(-1))
			link.map(v => {
				v.page = 'sort'
				v.openType = 'redirect'
			})
			_tabbar_.sort.link = link
			$.store('sort', _tabbar_.sort)
		})
	},
	setRemindTypeList(){
		console.log('activity')
		if ($.store('activity') && _tabbar_.current != 'index') {
			_tabbar_.activity = $.store('activity')
			return
		}
		const link = _tabbar_.activity
		link.map(v =>{
			v.page = 'activity'
			v,openType = 'redirect'
		})
		_tabbar_.activity.link = link
		$.store('activity',_tabbar_.activity)
	},

}


function addPrefix(name) {
	return name && $.data.img + name + '.png'
}

function setTabs1() {
	const tabs1 = _tabbar_.options.tabs1
	if (!tabs1) return
	const arr = []
	$.each(tabs1.split(','), (i, v) => {
		const tab = _tabbar_[v]
		const isCurPage = _tabbar_.current == tab.page
		tab.active = isCurPage
		tab.active = tab.page == 'cart' && $.store('cart').length > 0
		tab.img = `${$.data.img}${tab.icon}.png`
		arr.push(tab)
	})
	_tabbar_.tabs1 = arr
}

function setTabs2() {
	const tabs2 = _tabbar_.options.tabs2
	if (!tabs2) return
	const arr = []
	$.each(tabs2.split(','), (i, v) => {
		const tab = _tabbar_[v]
		const isCurPage = _tabbar_.current == tab.page
		tab.active = isCurPage
		tab.img = `${$.data.img}${tab.icon}${isCurPage ? '-active.png' : '.png'}`
		arr.push(tab)
	})
	_tabbar_.tabs2 = arr
}

function setTabs3() {
	const tabs3 = _tabbar_.options.tabs3
	if (!tabs3) return
	const arr = []
	$.each(tabs3.split(','), (i, v) => {
		const tab = _tabbar_[v]
		tab && arr.push(tab)
	})
	_tabbar_.tabs3 = arr
}

function setBtns() {
	const btns = _tabbar_.options.btns || []
	$.each(btns, (i, v) => {
		v.img = addPrefix(v.icon)
	})
	_tabbar_.btns = btns
}

function tabbar(options = {}) {
	const pages = getCurrentPages()
	const _this = pages[pages.length - 1]
	Object.assign(_tabbar_, {
		current: _this.route.split('/')[2],
		options,
		tabs1: [],
		tabs2: [],
		tabs3: [],
		btns: [],
	})
	setTabs1()
	setTabs2()
	setTabs3()
	setBtns()
	// 宝贝分类列表
	options.tabs3 && fns.setProductTypeList() && fns.setRemindTypeList()

	// 绑定数据和方法到页面
	_this.setData({ _tabbar_ })
	Object.assign(_this, fns)
}