// pages/list.js
const util = require('../../utils/util');
const notification = require('../../utils/notification');
const authorize = require('../../dist/authorize/index.js');
const {$} = require('../../dist/index')
const request = require('../../utils/request');

Page({
  data: {
    labelArray: [{
      label: "推荐鲜花"
    },{
      label: "今日事件",
      bg: "active"
    }],
    histroyArray: [],
    submitTitle: ["添加新事件", "修改事件"],
    chosen: 1,
    date: "",
    adding: "adding",
    qualified: "",
    isAddEventsHidden: true,
    isConformMessageHidden: true,
    listArray: [],
    switchStatus: "on",
    
    recommend:[
        {img:'../../image/taleOfFlower2.png',name:'厕所',lineClamp:'-webkit-line-clamp: 3;',intro:'然后就是猫砂，猫厕所，猫窝，猫抓架子（建议买实木的）容易打扫，还有些鸡零狗碎的东西，其实并不贵，我不用猫笼，但是如果公寓没有纱窗防盗，建议买个大点的猫笼，免得猫跑出去'},
        {img:'../../image/taleOfFlower2.png',name:'厕所',lineClamp:'-webkit-line-clamp: 3;',intro:'然后就是猫砂，猫厕所，猫窝，猫抓架子（建议买实木的）容易打扫，还有些鸡零狗碎的东西，其实并不贵，我不用猫笼，但是如果公寓没有纱窗防盗，建议买个大点的猫笼，免得猫跑出去'},
        {img:'../../image/taleOfFlower2.png',name:'猫砂',lineClamp:'-webkit-line-clamp: 3;',intro:'然后就是猫砂，猫厕所，猫窝，猫抓架子（建议买实木的）容易打扫，还有些鸡零狗碎的东西，其实并不贵，我不用猫笼，但是如果公寓没有纱窗防盗，建议买个大点的猫笼，免得猫跑出去'},
        {img:'../../image/taleOfFlower2.png',name:'猫砂',lineClamp:'-webkit-line-clamp: 3;',intro:'然后就是猫砂，猫厕所，猫窝，猫抓架子（建议买实木的）容易打扫，还有些鸡零狗碎的东西，其实并不贵，我不用猫笼，但是如果公寓没有纱窗防盗，建议买个大点的猫笼，免得猫跑出去'},
    ],
  },
  onLoad: function (options) {
    console.log(getCurrentPages())
    const that = this;
    this.calenderTypes = options.t;
    this.isLunar = options.lunar;
    this.formatedDate = options.year + "-" + options.month + "-" + options.day;
    let listArray = [];
    const yearMonth = options.year + "-" + util.formatNumber(options.month);
    this.yearMonth = yearMonth;
    this.day = options.day;
    const monthDay = util.formatNumber(options.month) + "-" + util.formatNumber(options.day);
    request.GetTodayEventListByDate(monthDay).then((res) => {
      that.setData({
         histroyArray: res
      });
    })
    request.GetCalendarGongGuanList(yearMonth, options.t).then((res) => {
      for (let one of res) {
        let aDay = one.calendar_date.split(" ")[0].split("/")[2];
        if (options.day == aDay) {
          listArray.push({
            title: one.holiday,
            typeId: one.typeid,
            holidayId: one.id,
            isShowArrow: one.introduction ? true : false
          })
        }
      }
      request.GetTypeCommonListByParentID().then((result) => {
        // 如果有选择黄历，显示黄历
        if (this.isLunar) {
            this.lunarObj = result.find((elem) => {
              return elem.typename == "黄历";
            })
        }
        for (let i of listArray) {
          for (let ii of result) {
            if (i.typeId == ii.id) {
              i.bgColor = "#" + ii.namecolor;
              if (ii.typename == "公众假期") {
                i.isHoliday = true;
              }
            }
          }
        }
        const date =  options.year + "年" + options.month + "月" + options.day + "日";
        // 授权
        authorize.getUser({
          success: () => {
            const calendarUserid = wx.getStorageSync('userInfo').openid;
            that.makeUserEvents(calendarUserid, listArray, date);
          },
          fail: () => {
            util.alert('登录失败！')
            that.showAllData(date, listArray);
          }
        }, false)
      })
    })
  },
  makeUserEvents(calendarUserid, listArray, date) {
      this.fetchUserEvents(calendarUserid, listArray).then((data) => {
        let listArray = data;
        if (this.lunarObj) {
          request.GetIndexBgImageInfo(this.formatedDate).then((res) => {
            listArray.unshift({
              title: res.nongli,
              typeId: this.lunarObj.id,
              bgColor: "#" + this.lunarObj.namecolor
            })
            this.showAllData(date, listArray);  
          });
        } else {
          this.showAllData(date, listArray);  
        }   
      })       
  },
  fetchUserEvents(calendarUserid, listArray) {
    return request.GetCalendarUserEvent(calendarUserid,this.yearMonth, false).then((response) => {
      this.userAdded = [];
      if (response.length) {
        for (let iii of response) {
          let aDay = iii.calendar_date.split(" ")[0].split("/")[2];
          const timeArray = iii.calendar_date.split(" ")[1].split(":");
          if (this.day == aDay) {
            //如果是个人事件，有id，无typeId, 以便点击时区分
            this.userAdded.push({
              isShowArrow: true,
              beTime: `${timeArray[0]}:${timeArray[1]}`,
              title: iii.user_event,
              new: "new",
              id: iii.id,
              bgColor: "#7d6b86"
            })
          }
        }
        listArray = listArray.concat(this.userAdded);
      }
      return listArray;
    });
  },
  showAllData(date, listArray) {
    this.setData({
      date,
      listArray
    })
    if (!listArray.length) {
      this.setData({
        noContent: true
      })
    }
  },
  checkList: function(e) {
    const index = e.currentTarget.dataset.index;
    const chosen = this.data.chosen;
    const labelArray = this.data.labelArray;
    labelArray[chosen].bg = "";
    labelArray[index].bg = "active";
    this.setData({
      labelArray: labelArray,
      chosen: index
    })

  },
  getTime: function() {
      const date = new Date();
      const hour = date.getHours() + 1;
      const beTime = util.formatNumber(hour) + ":00";
      return beTime;
  },
  chooseBeTime: function(e) {
    this.setData({
      beTime: e.detail.value
    })
  }, 
  turnOnMessage(e) {
      let switchStatus = this.data.switchStatus;
      if (switchStatus == "on") {
          switchStatus = "";
      } else {
          switchStatus = "on";
      }
      //用户是否接受推送的接口---保存到本地
      wx.setStorageSync("deniedCalenderMessages", switchStatus == "on" ? "" : true);
      this.setData({
          switchStatus
      })
  },
  addEvent: function(e) {
    this.eventValue = "";
    if (this.userAdded && this.userAdded.length >= 5) {
       wx.showModal({
          title: "提示",
          content: "每个日期只可添加5个自定义事件",
          showCancel: false
       });
       return;
    }
    const beTime = this.getTime();
    this.setData({
      beTime,
      eventValue: this.eventValue,
      submitType: 0,
      isAddEventsHidden: false
    })
  },
  eventInput: function(e) {
    if (e.detail.value.trim()) {
      this.eventValue = e.detail.value;
    } else {
      this.eventValue = "";
    }
    this.setData({
      eventValue: this.eventValue
    })
  },
  goEvent: function(e) {
    const index = e.currentTarget.dataset.index;
    const event = this.data.listArray[index];
    if (!event.isShowArrow) {
      return;
    }
    if (!event.typeId) {
      //用户自定义的事件
      this.eventValue = event.title;
      this.setData({
        beTime: event.beTime,
        eventValue: event.title,
        submitType: 1,
        event_id: event.id,
        isAddEventsHidden: false
      })
    }
  },
  goIntro(e) {
    const event = this.data.listArray[e.currentTarget.dataset.index];
    var labelArray = this.data.labelArray
    labelArray[1].bg = "";
    labelArray[0].bg = "active";
    this.setData({
      chosen:0,
      labelArray,
    })
    // wx.navigateTo({
    //   url: "../intro/intro?id=" + event.holidayId + "&t=" + event.typeId + "&ym=" + this.yearMonth
    // })
  },
  goCalender: function() {
    util.navigateBack();
  },
  goFollow() {
    wx.navigateTo({
      url: "../follow/follow"
    })
  },
  cancel: function(e) {
    this.setData({
      isAddEventsHidden: true,
      isAddNoticeHidden: true
    })
  },
  goQrcode: function(e) {
    wx.navigateTo({
      url: "../qrcode/qrcode"
    })
  },
  cancleMessage: function(e) {
    this.setData({
      isConformMessageHidden: true
    })
  },
  updateUserEvents(openid) {
    let listArray = this.data.listArray;
    //删除事件，只有事件有id
    listArray = listArray.filter((elem) => {
      return !elem.id
    })
    this.fetchUserEvents(openid, listArray).then(res => {
      util.toast("提交成功");
      this.setData({
        listArray: res,
        noContent: false,
        isAddEventsHidden: true,
        adding: "adding"
      })
    })
  },
  saveUserEvent(jsonData, formId) {
    const that = this;
    // 授权,true表示需unionid
    authorize.getUser({
        success: () => {
            jsonData.openid = wx.getStorageSync('userInfo').openid;
            request.SaveUserEvent(jsonData).then((res) => {
                console.log("save user event: ", res);
                let id = JSON.parse(res.replace(/[()]/g,'')).data;
                const switchStatus = that.data.switchStatus;
                if (!switchStatus) {
                    //不推送      
                } else {
                    if (!id) {
                      id = jsonData.id;
                    }
                    that.sendMessage(id, formId)
                }
                that.updateUserEvents(wx.getStorageSync('userInfo').openid);                    
            })
        },
        fail: () => {
          util.alert('登录失败！')
        }
    }, true)
  },
  sendMessage(id, formId) {
    const sendtime = this.formatedDate + " " + this.data.beTime + ":00";
    this.sendMessageUsingTwoTypes(id, formId, sendtime);
  },
  sendMessageUsingTwoTypes(id, formId, sendtime) {
    //如果事件时间在未来，可以提醒;
    //但如果大于7天但用户无关注公众号，不可以提醒;
    const that = this;
    let openid = wx.getStorageSync('userInfo').openid;
    const unionid = wx.getStorageSync(util.data.unionIdStorage);//推送
    const today = new Date().getFullYear() + "-" + (new Date().getMonth() + 1 ) + "-" + new Date().getDate();
    const now = new Date().getTime();
    const sendtype = notification.conformSendType(sendtime, openid, unionid);
    const eventDate = this.data.date + this.data.beTime;
    if (now < util.formatDate(sendtime).getTime()) {
      if (sendtype == 2 && !unionid) {
          return;
      }
    } else {
      util.alert("无法设置过去时间的提醒");
      return;
    }
    let param = {};
    if (sendtype == 1) {
        param = notification.eventMessage(eventDate, that.eventValue, formId, openid);
    } else if (sendtype == 2 && unionid){
        openid = unionid;
        param = notification.sendMessageUsingPlatform(eventDate, that.eventValue);
    }
    request.SaveSendMsg(sendtime, param, sendtype, openid, id).then((res) => {
        console.log("SaveSendMsg: ", res)
        util.toast("已提交提醒");
        that.setData({
          isAddNoticeHidden: true
        })        
    })
  },
  send: function(e) {
    if (!this.eventValue) {
      util.alert("请填写事件内容");
      return
    }          
    const jsonData = {
        calendar_date: this.formatedDate + " " + this.data.beTime,
        user_event: this.eventValue,
        wxpublic_id: util.data.appid
    }
    if (this.data.submitType == 1) {
        //修改事件
        jsonData.id = this.data.event_id;
        //不管是否之前有推送这个事件，都先尝试删除推送
        request.DeleteSendMsg(jsonData.id).then((response) => {
            console.log("删除推送：", response);
            //保存用户事件
            this.saveUserEvent(jsonData, e.detail.formId);
        })
    } else {
      //保存用户事件
      this.saveUserEvent(jsonData, e.detail.formId);
    }
    
  },
  makeNotice(e) {
      this.eventValue = this.data.holidayForNotice;
      this.sendMessage(undefined, e.detail.formId);
  },
  delete: function() {
    this.setData({
      isConformMessageHidden: false
    })
  },
  no: function() {
    this.setData({
      isConformMessageHidden: true
    })
  },
  yes: function(e) {
    //删除事件

  },
  goArticle: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
       url: "../article/article?id=" + id
    })
  },
  showMoreIntro(e){
    var recommend = this.data.recommend
    var index = e.currentTarget.dataset.index
    recommend[index].lineClamp = ''
    this.setData({
      recommend,
    })
  }
})
