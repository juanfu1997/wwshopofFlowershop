const { $, $$, tabbar } = require('../../dist/index')

Page(Object.assign({}, getApp(), {
	data: {
		img: $.data.img,
		slider_id: '5,6,7',
		labelarr:[],
		tool:[
				{img:'../../image/taleOfFlower.png',text:'花花世界',page:'taleOfFlowers'},
				{img:'../../image/taleOfFlower.png',text:'花艺小班',page:'ikebana'},
				{img:'../../image/taleOfFlower.png',text:'礼品卡',page:'giftCard'},
				{img:'../../image/taleOfFlower.png',text:'定制life',page:'customized'},
		],
		label:[
        {label:'爱情专区',id:'0',bgcolor:'#FF4F05',active:''},
        {label:'爱情专区',id:'1',bgcolor:'#FFE082',active:''},
        {label:'爱情专区',id:'2',bgcolor:'#E1BEE7',active:''},
        {label:'爱情专区',id:'3',bgcolor:'#00B596',active:''},
        {label:'爱情专区',id:'4',bgcolor:'#C4A77D',active:''},
        {label:'爱情专区',id:'5',bgcolor:'#BE5211',active:''},
        {label:'爱情专区',id:'6',bgcolor:'#D8D116',active:''},
        {label:'爱情专区',id:'7',bgcolor:'#EBD6DD',active:''},
        {label:'爱情专区',id:'8',bgcolor:'#d3d3d3',active:''},
    ],
	},
	onLoad(options) {
		this.setSlider()
		this.setCoupon()
		this.setList()
		var label = this.data.label
		var labelarr = this.data.labelarr
		let id 
		if(options.id){
			id = options.labelId.split(',')
			console.log('id',id)
			$.each(label,(i,v)=>{
				$.each(id,(i2,v2) => {
					if(v.id == v2){
						labelarr.push(label[v2])
					}
				})
			})
			console.log('labelarr',labelarr)
			this.setData({
				labelarr,
			})
		}
		// this.data.tabs3[0].link[0].weiwei_type='鲜花'
		// this.data.tabs3[0].link[1].weiwei_type='永生花'
		// this.data.tabs3[0].link[2].weiwei_type='礼品'
		// this.setData({
		// 	tabs3,
		// })
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
	setSlider() {
		const { slider_id } = this.data
		$$.GetSliderCommonList(slider_id).then(res => {
			const sliders = []
			$.each(res, (i, v) => {
				const slider = $.parse(v.slider)
				sliders.push($.fmt(slider, 'silderImg'))
			})
			sliders[0][0].silderImg = 'http://seopic.699pic.com/photo/50020/3429.jpg_wh1200.jpg'
			sliders[0][1].silderImg = 'http://seopic.699pic.com/photo/50041/9871.jpg_wh1200.jpg'
			sliders[1][0].silderImg = 'http://seopic.699pic.com/photo/50020/3429.jpg_wh1200.jpg'
			sliders[2][0].silderImg = 'http://seopic.699pic.com/photo/50041/9871.jpg_wh1200.jpg'
			this.setData({ sliders })
		})
	},
	setCoupon() {
		$$.GetCouponList().then(res => {
			res = res.slice(0, 3)
			this.setData({ coupon: res })
		})
	},
	setList() {
		$$.GetWeiweiProductList().then(res => {
			console.log('res',res)
			$.each(res, (i, v) => {
				v.list = $.fmt(v.list, 'product_cover')
			})
			res[0].list[0].price = 438
			res[0].list[0].product_cover = 'http://img.hua121.com/uploadpic/images/2016121513313174471.jpg'
			res[0].list[0].product_name = '想念你----11支戴安娜粉玫瑰、11支白玫瑰、11支红玫瑰。'

			res[0].list[1].price = 278
			res[0].list[1].product_cover = 'http://img.hua121.com/uploadpic/images/2016122013502313079.jpg'
			res[0].list[1].product_name = '最好的时光----19枝白玫瑰。 配材：高山羊齿围边，火龙珠相衬。'

			res[0].list[2].price = 208
			res[0].list[2].product_cover = 'http://img.hua121.com/uploadpic/images/2016122211364276692.jpg'
			res[0].list[2].product_name = '课桌上的秘密----11枝香槟玫瑰单独包装。 配材：绿叶丰满。'

			res[0].list[2].price = 198
			res[0].list[2].product_cover = 'http://img.hua121.com/uploadpic/images/201612115141824070.jpg'
			res[0].list[2].product_name = '老婆，我爱你----11枝红玫瑰，2只可爱熊仔 配材：满天星，黄莺'

			///////////////////////////////////////////////////////////////////////////////////////////////////
			res[1].list[0].price = 438
			res[1].list[0].product_cover = 'http://img.hua121.com/uploadpic/images/2016122014121430747.jpg'
			res[1].list[0].product_name = '花样年华----9支香槟玫瑰9支大桃红玫瑰和9支戴安娜玫瑰均匀分布。'

			res[1].list[1].price = 298
			res[1].list[1].product_cover = 'http://img.hua121.com/uploadpic/images/2016121210382324560.jpg'
			res[1].list[1].product_name = '幸福的笑容----10枝白色玫瑰，6枝戴安娜玫瑰 配材：桔梗搭配，高山 积雪'

			res[1].list[2].price = 278
			res[1].list[2].product_cover = 'http://img.hua121.com/uploadpic/images/201612511132390934.jpg'
			res[1].list[2].product_name = '蒙娜丽莎----19枝精品红玫瑰.'

			res[1].list[3].price = 338
			res[1].list[3].product_cover = 'http://img.hua121.com/uploadpic/images/201612114284933697.jpg'
			res[1].list[3].product_name = '守护爱情----19枝红玫瑰'

			this.setData({ listArr: res })
		})
	},
	goToolpage(e){
		$.goPage(e)
	},
	switchLabel(){
		var labelarr = this.data.labelarr
		let labelId = ''
		$.each(labelarr,(i,v) =>{
			labelId? labelId += ','+v.id : labelId += 'labelId='+v.id
		})
		console.log(labelId)
		wx.redirectTo({
        url: "../label/label?" + labelId
    })
	}
}))