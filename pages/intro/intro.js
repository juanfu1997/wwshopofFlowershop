// pages/article/article.js
const WxParse = require('../../lib/wxParse/wxParse.js');
const util = require('../../utils/util.js');
const request = require('../../utils/request');
Page({
    data: {
        img: util.data.img,
        host: util.data.host,
        id: 0,
        title: '',
        content: ''
    },
    onLoad: function(options) {
        var _this = this;
        this.getCurrentPageUrlWithArgs = util.getCurrentPageUrlWithArgs();
        this.share = options.share;
        // 页面初始化 options为页面跳转所带来的参数
        request.GetCalendarGongGuanList(options.ym, options.t).then((result) => {
            const holidayObj = result.find((elem) => {
                return elem.id == options.id;
            })        
            let content = util.url2abs(holidayObj.introduction);
            const pageTitle = holidayObj.holiday;
            _this.setData({
                header: {
                    title: "节日介绍"
                },
                pageTitle,
                id: options.id,
                content
            })
            var article = content;
            /**
             * WxParse.wxParse(bindName , type, data, target,imagePadding)
             * 1.bindName绑定的数据名(必填)
             * 2.type可以为html或者md(必填)
             * 3.data为传入的具体数据(必填)
             * 4.target为Page对象,一般为this(必填)
             * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
             */

             //0.2是因为css的padding设置了5%
            let imagePadding = wx.getSystemInfoSync().windowWidth * 0.05;
            WxParse.wxParse('article', 'html', article, _this, imagePadding);
            WxParse.wxParse('title1', 'html', pageTitle, _this, imagePadding);
        })

    },
    onShareAppMessage: function(res) {
        const that = this;
        return {
           title: "分享给你" + this.data.pageTitle + "的介绍",
           path: this.getCurrentPageUrlWithArgs + "&share=true",
           imageUrl: "../../images/share.jpg",
           success: function(res) {
           },
           fail: function(res) {
            // 转发失败
           }
        }
    },
    goBack: function () {
        if (this.share) {
            this.goHome();
            return;
        }
        util.navigateBack()
    },
    goHome: function () {
        wx.reLaunch({
            url: '../index/index'
        })
    }
})
