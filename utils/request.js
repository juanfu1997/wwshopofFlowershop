const util = require('./util.js');
// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}

//上传图片
function upload(filePath) {
	// util.loading();
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${util.data.host}/KorjoApi/AdminUpload`,
			name: 'file',
			formData: { "path": "golf", "type": "image" },
			filePath,
			success: (res) => {
				util.hideLoading();
				resolve(res.data);
			},
			fail: (error) => {
				reject(error);
			}
		})
	});
}

//法定节假日和周末
function GetRestDateList(yearmonth) {
	//2018-01
	return util.get('/KorjoApi/GetRestDateList', {yearmonth});
	//rest_value:2 //2法定休息//1周末休
}

function ValidateUserOpenid(unionid) {
    return util.get('/KorjoApi/ValidateUserOpenid', {unionid, wxpublic_id: util.data.appid});
}

//定时消息推送
function SaveSendMsg(sendtime, param, sendtype, openid, event_id) {
	//如果没有event_id就不需要传，event_id是保存事件返回的id
	const jsonData = JSON.stringify({
		messagejson: JSON.stringify(param),
		sendtime,
		wxpublic_id: util.data.appid,//korjo后台密钥管理id
		sendtype,//发送方式：1为小程序，2为公众号
		openid,
		event_id
	});
	console.log("SaveSendMsg: ", jsonData);
	return util.post('/KorjoApi/SaveSendMsg', {jsonData});
}

//实时消息推送
function WxMessageSend(param) {
	return util.post('/KorjoApi/WxMessageSend', {id: util.data.appid, param: JSON.stringify(param)});
}

function DeleteSendMsg(event_id) {
	return util.get('/KorjoApi/DeleteSendMsg', {event_id, wxpublic_id: util.data.appid});
}


//粉我吧科技介绍页
function GetFansIntro(wxpublic_id) {
	return util.get('/KorjoApi/GetFansIntro', {wxpublic_id});
}

function GetSuitableCrowdCommonList() {
	return util.get('/KorjoApi/GetSuitableCrowdCommonList', {projectid: 1})
}

function GetTypeNameRecommend(suitable_crowd_id) {
    return util.get('/KorjoApi/GetTypeNameRecommend', {suitable_crowd_id, projectid: 1});
}

function GetTypeCommonListByParentID() {
    return util.get('/KorjoApi/GetTypeCommonListByParentID', {parentid: 0, projectid: 1})
}

//311公共节日312现代节日323情人节324传统
function GetCalendarGongGuanList(yearmonth,typeid) {
	console.log(typeid)
    return util.get('https://www.korjo.cn/KorjoApi/GetCalendarGongGuanList', {yearmonth,typeid})
}
//节日，不一定有休息日，如双十一
function GetSingleCommonList(date) {
    return util.get('/GspaceApi/GetSingleCommonList', {date})
}

function GetCalendarUserEvent(openid,calendar_date,isdate) {
    return util.get('/KorjoApi/GetCalendarUserEvent', {openid, calendar_date, isdate})
}

function SaveUserEvent(jsonData) {
    return util.get('/KorjoApi/SaveUserEvent', {jsonData: JSON.stringify(jsonData)});
}

function  GetTodayEventListByDate(day) {
    return util.get('/KorjoApi/GetTodayEventListByDate', {day})
}

function GetTodayEventInfoByID(id) {
    return util.get('/KorjoApi/GetTodayEventInfoByID', {id})
}

//黄历
function GetIndexBgImageInfo(date) {
	//2018-03-12
	return util.get('/KorjoApi/GetIndexBgImageInfo', {date});
}


module.exports = {
    GetSessionKey,
	upload,
	GetRestDateList,
	ValidateUserOpenid,
	SaveSendMsg,
	GetFansIntro,
	WxMessageSend,
	DeleteSendMsg,
	GetSuitableCrowdCommonList,
	GetTypeNameRecommend,
	GetTypeCommonListByParentID,
	GetSingleCommonList,
	GetCalendarGongGuanList,
	GetCalendarUserEvent,
	SaveUserEvent,
	GetTodayEventListByDate,
	GetTodayEventInfoByID,
	GetIndexBgImageInfo
}
