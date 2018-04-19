const util = require('../../utils/util.js')
Page({
    data: {
        img: 'https://www.korjo.cn/xcx/calendarImg/'
    },
    onLoad() {
        
    },
    goBack() {
        util.navigateBack();
    }
})
