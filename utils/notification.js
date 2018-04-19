const util = require("./util");
const request = require('./request');

function getType(time, openid, unionid) {
    var now = new Date().getTime();
    var sendtime = util.formatDate(time).getTime();
    //七天前移1小时
    if ((sendtime - now) < 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000) {
        return { sendtype: 1, id: openid}
    } else {
        return { sendtype: 2, id: unionid}
    }
}

function conformSendType(sendtime, openid, unionid) {
    const sendtype = getType(sendtime, openid, unionid).sendtype;
    return sendtype;
}

function sendMessageUsingPlatform(eventDate, value) {
    let param = {
        "touser": "",
        "template_id": "hkakNBfzkzfApiL-1tfE-KTHd3JHHe-P0jDE3C97rN4",//公众号后台申请的模板消息id
        "miniprogram": {
            "appid": "wx17330c622e0bb138",//小程序appId
            "pagepath": "/pages/index/index"
        },
        "data": {
            "first": {
                "value": "KORJO公关小牛历提醒您有以下计划",
                "color": "#173177"
            },
            "keyword1": {
                "value": value,
                "color": "#19b955"
            },
            "keyword2": {
                "value": "无",
                "color": "#173177"
            },
            "keyword3": {
                "value": eventDate,
                "color": "#19b955"
            },
            "remark": {
                "value": "日历事件提醒",
                "color": "#173177"
            }
        }
    }
    return param;
}

function eventMessage(eventDate, value, form_id, touser) {
    const data = {
        "keyword1": {
            "value": '日历事件提醒',
            "color": "#c0272d"
        },
        "keyword2": {
            "value": eventDate,
            "color": "#999999"
        },
        "keyword3": {
            "value": value,
            "color": "#c0272d"
        }
    };
    const param = {
        touser,
        template_id: "TFX5CFcBIn_WUEzWb3rcCzaTtJkrhw14jhqcZMjJYag",//小程序模板id
        page: "/pages/index/index",
        form_id,
        data
    }
    return param
}


module.exports = {
    getType,
    conformSendType,
    sendMessageUsingPlatform,
    eventMessage
};
