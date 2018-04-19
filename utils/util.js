module.exports = {
	data: getApp().data,
			getPrevPage() {
				return getCurrentPages()[getCurrentPages().length - 2]
			},
			isTheMonth(year, month) {
			const date = new Date();
			const theYear = date.getFullYear();
			const theMonth = date.getMonth() + 1;
			if (year == theYear && month == theMonth) {
				return true;
			} else {
				return false;
			}
		},
		navigateBack() {
		  wx.navigateBack({
		    delta: 1
		  })
		},
    getCurrentPageUrlWithArgs(){
		    const pages = getCurrentPages()    //获取加载的页面
		    const currentPage = pages[pages.length-1]    //获取当前页面的对象
		    const url = currentPage.route    //当前页面url
		    const options = currentPage.options    //如果要获取url中所带的参数可以查看options   
		    //拼接url的参数
		    let urlWithArgs = url + '?'
		    for(let key in options){
		        let value = options[key]
		        urlWithArgs += key + '=' + value + '&'
		    }
		    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)    
		    return urlWithArgs
		},
		checkDaysOfMonth(mm, yyyy) {
	    var daysofmonth;
	    if ((mm == 4) || (mm ==6) || (mm ==9) || (mm == 11)){
	        daysofmonth = 30;
	    } else {
	        daysofmonth = 31;
	        if (mm == 2){
	            if (yyyy/4 - parseInt(yyyy/4, 10) != 0){
	                daysofmonth = 28;
	            } else {
	                if (yyyy/100 - parseInt(yyyy/100, 10) != 0) {
	                    daysofmonth = 29;
	                }else{
	                    if (yyyy/400 - parseInt(yyyy/400, 10) != 0) {
	                        daysofmonth = 28;
	                    }else{
	                        daysofmonth = 29;
	                    }
	                }
	            }
	        }
	    }
	    return daysofmonth;
	},
	upload(success) {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: res => {
				success(res.tempFilePaths[0])
			}
		})
	},
	dataset(e) {
		const obj = e.currentTarget.dataset
		obj.value = e.detail.value
		return obj
	},
	findItem(array, item, value) {
		let bool = false
		this.each(array, (i, v) => {
			if (v[item] == value) {
				bool = true
				return
			}
		})
		return bool
	},
	share(title) {
		const { options, route } = this.getLast(getCurrentPages())
		return {
			title,
			path: `${route}${this.param(options)}`,
		}
	},
	getLast(array) {
		return array[array.length - 1]
	},
	param(json) {
		return '?' +
			Object.keys(json).map(function (key) {
				return encodeURIComponent(key) + '=' +
					encodeURIComponent(json[key]);
			}).join('&');
	},
	store(key, data) {
		if (key instanceof Object) {
			this.each(key, (k, v) => {
				wx.setStorageSync(k, v)
			})
		} else if (typeof key == 'string') {
			return data ? wx.setStorageSync(key, data) : wx.getStorageSync(key)
		} else {
			const obj = {}
			this.each(wx.getStorageInfoSync().keys, (i, k) => {
				obj[k] = wx.getStorageSync(k)
			})
			return obj
		}
	},
	remove(...keys) {
		keys.length ? this.each(keys, (i, v) => {
			wx.removeStorageSync(v)
		}) : wx.clearStorageSync()
	},
	getUserInfo() {
		return this.promise(wx.getUserInfo)()
	},
	openSetting() {
		return this.promise(wx.openSetting)()
	},
	login() {
		return this.promise(wx.login)()
	},
	promise(fn) {
		return function (obj = {}) {
			return new Promise((resolve, reject) => {
				obj.success = res => {
					resolve(res)
				}
				obj.fail = res => {
					reject(res)
				}
				fn(obj)
			})
		}
	},
	repeat(json, length) {
		return Array(length).fill(0).map(v => this.clone(json))
	},
	clone(json) {
		return JSON.parse(JSON.stringify(json))
	},
	parse(param) {
		return typeof param == 'string' ? JSON.parse(param) : param
	},
	toast(title, callback) {
		wx.showToast({
			icon: 'success',
			title,
			duration: 1e3,
			// mask: true,
			success() {
				callback && callback()
			}
		})
	},
	getArrayItems(arr, num) {
		var temp_array = new Array()
		for (var index in arr) {
			temp_array.push(arr[index])
		}
		var return_array = new Array()
		for (var i = 0; i < num; i++) {
			if (temp_array.length > 0) {
				var arrIndex = Math.floor(Math.random() * temp_array.length)
				return_array[i] = temp_array[arrIndex]
				temp_array.splice(arrIndex, 1)
			} else {
				break
			}
		}
		return return_array
	},
	each(object, callback) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined

		if (isObj) {
			for (name in object) {
				if (callback.call(object[name], name, object[name]) === false) {
					break
				}
			}
		} else {
			for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
		}
		return object
	},
	confirm(content, callback) {
		wx.showModal({
			content,
			success: res => {
				if (res.confirm) {
					callback && callback()
				}
			}
		})
	},
	alert(content, callback) {
		wx.showModal({
			title: '提示',
			content,
			showCancel: false,
			success: function (res) {
				callback && callback()
			}
		})
	},
	loading() {
		if (wx.showLoading) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
		} else {
			wx.showToast({
				title: "加载中...",
				icon: "loading",
				duration: 100000
			})
		}
	},
	hideLoading() {
		if (wx.showLoading) {
			wx.hideLoading()
		} else {
			wx.hideToast()
		}
	},
	getText(str) {
		return str.replace(/&#39;/ig, "'").replace(/<\/?[^>]*>|&[^;]*;/ig, '')
	},
	unique(array) {
		const res = []
		const json = {}
		for (let i = 0; i < array.length; i++) {
			if (!json[array[i]]) {
				res.push(array[i])
				json[array[i]] = 1
			}
		}
		return res
	},
	log: console.log,
	extend(target, options) {
		for (let name in options) {
			target[name] = options[name]
		}
		return target
	},
	formatNumber(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	},
	formatTime(date) {
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()

		var hour = date.getHours()
		var minute = date.getMinutes()
		var second = date.getSeconds()

		return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
	},
	url2abs(str) {
		str = str || ''
		const host = this.data.host
		// const host = this.data.host.replace('https:', 'http:')
		return str
		.replace(/<img.*?src="\//gi, `<img src="${host}/`)
		.replace(/&#39;/gi, "'")
		.replace(/<video.*?src="\//gi, `<video src="${host}/`)
		.replace(/<source.*?>/gi, '')
	},

	goPage(e) {
		const data = e.currentTarget.dataset,
			{ page, openType = 'navigate' } = data,
			param = data.param ? `?${data.param}` : '',
			url = `/pages/${page}/${page}${param}`,
			obj = {
				navigate() {
					wx.navigateTo({ url })
				},
				redirect() {
					wx.redirectTo({ url })
				},
				reLaunch() {
					wx.reLaunch({ url })
				},
				back() {
					wx.navigateBack({ delta: 1 })
				}
			}
		page && obj[openType]()
	},
	goBack() {
		wx.navigateBack({ delta: 1 })
	},
	fmt(res, keys) {
		const arr = keys.split(',')
		const host = this.data.host
		// const host = this.data.host.replace('https:', 'http:')

		if (res.length) {
			this.each(res, (i, v) => {
				this.each(arr, (idx, key) => {
					v[key] = v[key].find('http') ? v[key] : host + v[key]
				})
			})
		} else {
			this.each(arr, (idx, key) => {
				res[key] = res[key].find('http') ? res[key] : host + res[key]
			})
		}
		return res
	},
	request(url, data, method,cb) {
		this.loading()
		return new Promise((resolve, reject) => {
			wx.request({
				url: url.find('https://') ? url : this.data.host + url,
				data,
				method,
				header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
				dataType: 'json',
				success: res => {
					console.log('success',res,url,data)
					resolve(res.data);
					this.hideLoading()
				},
				fail: res => {
					console.error('request fail:' + url)
					console.error(res)
				}
			})
		})
	},
	get(url, data) {
		return this.request(url, data, 'GET')
	},
	post(url, data) {
		return this.request(url, data, 'POST')
	},
	showImage(e) {
		const { url } = e.currentTarget.dataset
		url && wx.previewImage({ urls: [url] })
	},
}

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

String.prototype.find = function (str) {
	return this.indexOf(str) > -1
}

String.prototype.trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "")
}

Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
}