const $ = require('../../utils/util')

module.exports = {
	/**
	 * 注册用户
	 * dataJson{ "relname", "phone", "password", "photo", "openid", "wxpublic_id"}
	 */
	SaveUserInfo(data) {
		return $.post('/TimeApi/SaveWeiweiUser', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 用户登录
	 * {phone,password}
	 */
	GetAdminOrder(data) {
		return $.get('/TimeApi/WeiweiUserLogin', data)
	},

	/**
	 * 根据用户ID获取用户信息
	 */
	GetWeiweiUserInfo(id) {
		return $.get('/TimeApi/GetWeiweiUserInfo', { id })
	},

	/**
	 * 获取优惠券列表
	 */
	GetCouponList() {
		return $.get('/TimeApi/GetCouponList', {})
	},

	/**
	 * 首页产品列表
	 */
	GetWeiweiProductList() {
		return $.get('/TimeApi/GetWeiweiProductList', {})
	},

	/**
	 * 根据产品ID获取详情
	 */
	GetWeiweiProductInfo(id) {
		return $.get('/TimeApi/GetWeiweiProductInfo', { id })
	},

	/**
	 * 保存订单
	 *dataJson{ "contact_id", "userid", "freight", "mycoupon_id", "leaving_message", "product_price", "coupon_price", "freight_price", "all_price", "wxpublic_id",” relationList” }
	 订单产品关联relationList{“product_id”,”number” }
	 */
	SaveProductOrderCommon(data) {
		return $.post('/TimeApi/SaveProductOrderCommon', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 更新订单状态
	 * {id,status}
	 * Status:-1=已删除，0=待付款，1=待发货，2=已退款，3=待收货，4=已完成,5=取消订单
	 */
	UpdateOrderStatus(data) {
		return $.get('/TimeApi/UpdateOrderStatus', data)
	},

	/**
	 * 获取我的订单列表
	 * Status:-1=已删除，0=待付款，1=待发货，2=已退款，3=待收货，4=已完成,5=取消订单
	 */
	GetProductOrderCommonListByUserID(userid) {
		return $.get('/TimeApi/GetProductOrderCommonListByUserID', { userid })
	},

	/**
	 * 根据ID获取订单信息
	 */
	GetProductOrderCommonInfo(id) {
		return $.get('/TimeApi/GetProductOrderCommonInfo', { id })
	},

	/**
	 * 保存收货地址管理信息
	 * dataJson{"userid", "contact", "phone", "address", "post_code"}
	 */
	SaveDeliveryAddress(data) {
		return $.post('/TimeApi/SaveDeliveryAddress', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 获取收货地址列表
	 */
	GetDeliveryAddressList(userid) {
		return $.get('/TimeApi/GetDeliveryAddressList', { userid })
	},

	/**
	 * 获取收货地址信息
	 */
	GetDeliveryAddressInfo(id) {
		return $.get('/TimeApi/GetDeliveryAddressInfo', { id })
	},

	/**
	 * 删除收货地址
	 */
	DeleteDeliveryAddress(id) {
		return $.get('/TimeApi/DeleteDeliveryAddress', { id })
	},

	/**
	 * 领取优惠券
	 * dataJson{"userid", "coupon_id"}
	 */
	SaveMyCoupon(data) {
		return $.post('/TimeApi/SaveMyCoupon', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 获取我的优惠券
	 */
	GetMyCouponList(userid) {
		return $.get('/TimeApi/GetMyCouponList', { userid })
	},

	/**
	 * 更新点券状态
	 * {id,status}
	 */
	UpdateMyCouponStatus(data) {
		return $.get('/TimeApi/UpdateMyCouponStatus', data)
	},

	/**
	 * 获取产品分类
	 */
	GetWeiweiTypeList() {
		return $.get('/TimeApi/GetWeiweiTypeList', {})
	},

	/**
	 * 根据分类获取产品列表
	 */
	GetProductListByTypeID(typeid) {
		return $.get('/TimeApi/GetProductListByTypeID', { typeid })
	},

	/**
	 * 获取所有产品
	 */
	GetProductListAll() {
		return $.get('/TimeApi/GetProductListAll', {})
	},

	/**
	 * 提醒发货
	 */
	UpdateOrderNotice(id) {
		return $.get('/TimeApi/UpdateOrderNotice', { id })
	},

	/**
	 * 保存充值信息
	 * dataJson{ "openid",  "total_fee", "wxpublic_id"}
	 */
	SaveRechargeInfo(data) {
		return $.post('/TimeApi/SaveRechargeInfo', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 更新用户积分
	 * userid=用户ID&integral=积分
	 */
	UpdateUserIntegral(data) {
		return $.get('/TimeApi/UpdateUserIntegral', data)
	},

	/**
	 * 获取会员权益详情
	 */
	GetVipDescriptionInfo() {
		return $.get('/TimeApi/GetVipDescriptionInfo', { wxpublic_id: $.data.appid })
	},

	/**
	 * 领取积分券
	 * dataJson{"userid", "coupon_id" }
	 */
	SaveMyIntegralCoupon(data) {
		return $.post('/TimeApi/SaveMyIntegralCoupon', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 获取积分产品列表
	 */
	GetCouponProductList(userid) {
		return $.get('/TimeApi/GetCouponProductList', { userid })
	},

	/**
	 * 充值付款-扣除余额和订单状态
	 */
	UpdateBalanceAndOrderStatus(order_id) {
		return $.get('/TimeApi/UpdateBalanceAndOrderStatus', { order_id })
	},

	/**
	 * 查询物流
	 * ShipperCode&LogisticCode
	 */
	GetOrderTracesByJson(data) {
		return $.get('/TimeApi/GetOrderTracesByJson', data)
	},

	// ==============================================================================
	// ==============================================================================
	/**
	 * 轮播图
	 */
	GetSliderCommonList(slider_id) {
		return $.get('/KorjoApi/GetSliderCommonList', { slider_id })
	},

	/**
	 * 根据用户ID获取用户信息
	 */
	GetUserInfo(userid) {
		return $.get('/KorjoApi/GetUserInfo', { userid })
	},

	/**
	 * 获取用户openid
	 */
	GetSessionKey(data) {
		return $.get('/KorjoApi/GetSessionKey', data)
	},

	/**
	 * 保存客服推送消息
	 */
	SaveDataJsonCommon(data) {
		return $.post('/KorjoApi/SaveDataJsonCommon', { dataJson: JSON.stringify(data) })
	},

	/**
	 * 上传图片
	 */
	Upload(filePath) {
		$.loading()
		return new Promise((resolve, reject) => {
			wx.uploadFile({
				url: `${$.data.host}/KorjoApi/AdminUpload`,
				name: 'file',
				formData: { "path": "order", "type": "image" },
				filePath,
				success: res => {
					$.hideLoading()
					resolve(res)
				},
				fail: e => {
					$.log(e)
				}
			})
		})
	},

	/**
	 * FAQ
	 */
	GetFansIntro() {
		return $.get('/KorjoApi/GetFansIntro', { wxpublic_id: $.data.appid })
	},

	/**
	 * 支付
	 */
	PayCommon(order_pay_id) {
		return $.post('/PayApi/PayCommon', { order_pay_id })
	},

	/**
	 * 退款
	 */
	RunCommon(order_pay_id) {
		return $.post('/PayApi/RunCommon', { order_pay_id })
	},

	/**
	 * 更新支付状态
	 */
	UpdateOrderPayStatus(data) {
		return $.post('/GolfApi/UpdateOrderPayStatus', data)
	},
}
