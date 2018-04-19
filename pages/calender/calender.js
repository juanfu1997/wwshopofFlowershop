const util = require('../../utils/util.js');
const authorize = require('../../dist/authorize/index.js');
const request = require('../../utils/request');
const {show_lunar_calendar} = require('../../utils/lunar.js');

Page({
  data: {
    few: "",
    time: "",
    typesArray: [],
    img:'../../image/',
    // img: util.data.img,
    isTagHidden: true,
  },
  onLoad: function (options) {
    //默认日期
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    this.month = options.month || month;
    this.year = options.year || year;
    // this.typeids = options.t;
    // const query = options.t.split(",");
    const typesArray = [];
    const isTheMonth = util.isTheMonth(this.year, this.month);
    // request.GetTypeCommonListByParentID().then((result) => {
    //   for (let item of result) {
    //     for (let one of query) {
    //       if (item.id == Number(one)) {
    //         typesArray.push({
    //           id: item.id,
    //           type: item.typename,
    //           bgColor: '#' + item.namecolor,
    //           active: true
    //         })
    //       }
    //     }
    //   }
    //   this.setData({
    //     isTheMonth,
    //     typeids: options.t,
    //     tyeQuery: options.t,
    //     typesArray: typesArray,
    //     time: this.year + "年" + (this.month < 10 ? "0" + this.month : this.month) + "月"
    //   })
    //   this.getData(this.month, this.year, options.t);
    // })
      this.setData({
          time: this.year + "年" + (this.month < 10 ? "0" + this.month : this.month) + "月"
      })
    this.getData(this.month, this.year);
  },
  onShow() {
      if (this.data.isFromList) {
        // isFromList,  如果是从list page过来，需要更新用户事件
        const pages = getCurrentPages();
        const currentPage = pages[pages.length-1];
        const options = currentPage.options;
        const yymmArray = wx.getStorageSync("yymmArray");
        options.year = yymmArray[0];
        options.month = yymmArray[1];
        this.onLoad(options);
      }
  },
  getData: function(mm, yyyy, type) {
      if (!type) {
        type = 0;
      }

      const that = this;
      var allDays = [];
      var daysOfMonth = util.checkDaysOfMonth(mm, yyyy);
      const yearMonth = yyyy + "-" + (util.formatNumber(mm));
      request.GetCalendarGongGuanList(yearMonth,type='311,312,323,324').then((res) => {
        const holidaysData = that.populateData(res, [], that.data.typesArray);
        request.GetRestDateList(yearMonth).then((data) => {
          that.isRestDaysShow = data.length > 0 ? true : false;
          const offDays = [];
          for (let value of data) {
            let offDay = value.rest_date.split(" ")[0].split("/")[2];
            offDays.push(offDay);
          }
          for (var i = 0; i < daysOfMonth; i +=1) {
            allDays[i] = {
                id: i + 1,
                off: false,
                holidays: []
            }
            for (let vv of holidaysData) {
              if (i + 1 == vv.id) {
                allDays[i] = vv;
              }
            }
            if (data.length > 0) {
              for (let vvv of offDays) {
                if (i + 1 == vvv) {
                  allDays[i].off = true;
                }
              }
            }
          }
          //highlight today
          if (yyyy === new Date().getFullYear() && mm === new Date().getMonth() + 1) {
            allDays[new Date().getDate() - 1].theDay = "theDay";
          }
          authorize.getUser({
            success: () => {
              console.log(0)
              let calendarUserid = wx.getStorageSync('openid');
              that.getUserEvents(calendarUserid, mm, yyyy, allDays, daysOfMonth,data);
            },
            fail: () => {
              util.alert('登录失败！')
            }
          })      
          // authorize.isLogin({
          //   success: () => {
          //     let calendarUserid = wx.getStorageSync(util.data.openIdStorage);
          //     that.getUserEvents(calendarUserid, mm, yyyy, allDays, daysOfMonth,data);
          //   },
          //   fail: () => {
          //     util.alert('登录失败！')
          //   }
          // })
          
        })
    })

  },
  populateData: function(res, holidaysData, typesArray) {
    for (let v of res) {
        let aDay = v.calendar_date.split(" ")[0].split("/")[2];
        let index = "";
        let typeId = v.typeid;
        let bgColor = "";
        function findTheSameDay(everyday, idx) {
          index = idx;
          return everyday.id == aDay;
        }
        for (let t of typesArray) {
          if (t.id == typeId) {
            bgColor = t.bgColor;
          }
        }
        if (holidaysData.length > 0 && holidaysData.find(findTheSameDay)) {
          let findRes = holidaysData.find(findTheSameDay);
          holidaysData[index].holidays.push({
            name: v.holiday,
            type: typeId,
            bgColor: bgColor
          });
        } else {
          holidaysData.push({
            id: Number(aDay),
            holidays: [{
              name: v.holiday,
              type: typeId,
              bgColor: bgColor
            }]
          })
        }
    }
    return holidaysData;
  },
  reArangeHolidays: function(allDays) {
    let few = "few";
    const LongHolidaysLength = allDays.filter(function(day) {
        return day.holidays.length >= 4;
    })
    //如果事件超过4个，.holidays的高度，否则.few的高度
    if (LongHolidaysLength.length > 0) {
       few = "";
    }
    for (let day of allDays) {
      for (let holiday of day.holidays) {
        //当日期下只有1个或以内的时候，且内容为7个字以上，读取前7/8个字
        if (day.holidays.length == 1 && holiday.name.length >= 7) {
          holiday.name = holiday.name.slice(0, 8)
        } else {
          //默认显示节日的前四个字
          holiday.name = holiday.name.slice(0, 4);
        }
      }
      //当内容超出6个时，第六个显示为更多
      if (day.holidays.length > 4) {
        day.holidays[3] = {
           name: "更多",
           type: "",
           bgColor: "#d3d3d3"
        };
        day.holidays.splice(4);
      }
    }
    this.setData({
      few: few
    })
    return allDays;
  },
  getUserEvents: function(userId, mm, yyyy, allDays, daysOfMonth) {
    const that = this;
    const typesArray = this.data.typesArray;
    let isLunar = false;
    request.GetCalendarUserEvent(userId,yyyy + "-" + util.formatNumber(mm), false).then((response) => {
      //如果选择了黄历, 加上农历
      const lunarObj = typesArray.find((elem) => {
          return elem.type == "黄历";
      })
      if (lunarObj) {
          isLunar = true;
          for (let i = 0, max = allDays.length; i < max; i +=1) {
            allDays[i].holidays.unshift({
              name: show_lunar_calendar(new Date(that.year, that.month -1, i + 1)),
              type: lunarObj.id,
              bgColor: lunarObj.bgColor
            })
          }
      }
      if (response.length) {
        for (let v of response) {
          let aDay = v.calendar_date.split(" ")[0].split("/")[2];
          for (let value of allDays) {
            if (aDay == value.id) {
              value.holidays.push({
                user: 'user',
                name: v.user_event,
                bgColor: "#7d6b86"
              })
            }
          }
        }
      }
      //最后一行剩下的空间与一号前面也需要有边框
      allDays= that.reArangeHolidays(allDays);
      const weekDay = new Date(yyyy, mm - 1, 1).getDay();
      for (var v = 0; v < weekDay; v += 1) {
        allDays.unshift({});
      }
      var totalSpots = daysOfMonth + weekDay;
      allDays = that.getMoreSpots(totalSpots, allDays);
      allDays = that.setRestDays(allDays);
      that.setData({
          allDays,
          isLunar
      })
    })
  },
  setRestDays: function(allDays) {
    //确定周末, 周末且如果没上班是红色字体
    for (let d = 0, max = allDays.length; d < max; d += 1) {
      if (allDays[d].id) {
         allDays[d].weekend = '';
         if (d === 0) {
           allDays[d].weekend = 'weekend';
         }
         if ((d + 1) % 7 === 0 || d % 7 === 0) {
           allDays[d].weekend = 'weekend';
         }
         if(!allDays[d].off && this.isRestDaysShow) {
           allDays[d].weekend = '';
         }
      }
    }
    return allDays;
  },
  getMoreSpots: function(totalSpots, allDays) {
    if (totalSpots > 28 && totalSpots <= 35) {
        var moreContainerNum = 35 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    } else if (totalSpots > 35) {
        var moreContainerNum = 42 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    }
    return allDays;
  },
  chooseDate: function(e) {
    var dir = e.currentTarget.dataset.dir;
    var isLeftHidden = false;
    var isRightHidden = false;
    var thisYear = new Date().getFullYear();
    //往左减少日期，vice versa
    if (dir == "left") {
      if (this.month === 1) {
        this.month = 12;
        this.year -= 1;
      } else {
        this.month -= 1;
      }
    } else {
      if (this.month === 12) {
        this.month = 1;
        this.year += 1;
      } else {
        this.month += 1;
      }
    }
    //日历限制为今年跟明年
    if (this.year === thisYear && this.month === 1) {
      isLeftHidden = true;
    }
    if (this.year === thisYear + 1 && this.month === 12) {
      isRightHidden = true;
    }
    this.getData(this.month, this.year, this.data.typeids);
    const isTheMonth = util.isTheMonth(this.year, this.month);
    this.setData({
      isTheMonth,
      isLeftHidden: isLeftHidden,
      isRightHidden: isRightHidden,
      time: this.year + "年" + (this.month < 10 ? "0" + this.month : this.month) + "月"
    })
  },
  tapAll: function(e) {
    var more = "",
        isTagHidden = this.data.isTagHidden;
    if (!isTagHidden) {
      more = "";
      isTagHidden = true;
    } else {
      more = "more";
      isTagHidden = false;
    }
    this.setData({
      more: more,
      isTagHidden: isTagHidden
    })
  },
  tapIt: function(e) {
    const index = e.currentTarget.dataset.index;
    const typesArray = this.data.typesArray;
    const allTypes = [];
    if (typesArray[index].active) {
      typesArray[index].active = false;
    } else {
      typesArray[index].active = true;
    }
    for (let one of typesArray) {
      if (one.active) {
        allTypes.push(one.id);
      }
    }
    this.setData({
      typesArray: typesArray,
      typeids: allTypes.join(",")
    })
    
    this.getData(this.month, this.year, this.data.typeids);
  },
  goRec: function(e) {
    wx.redirectTo({
      url: "../recommend/recommend"
    })
  },
  goList: function(e) {
    const index = e.currentTarget.dataset.index;
    const allDays = this.data.allDays;
    const tyeQuery = this.data.tyeQuery;
    const isLunar = this.data.isLunar;
    if(!allDays[index].id) {
      return;
    }
    allDays[index].active = "active";
    // isFromList,  如果是从list page过来，call onShow
    this.setData({
      isFromList: true,
      allDays: allDays
    })
    wx.setStorageSync("yymmArray", [this.year, this.month]);
    let query = "year=" + this.year + "&month=" + this.month + "&day=" + allDays[index].id + "&t=311,312,323,324";
    if (isLunar) {
      query += "&lunar=true";
    }
    wx.navigateTo({
      url: "../list/list?" + query
    })
  },
  onShareAppMessage: function(res) {
      const that = this;
      let query = "t=" + that.data.typeids;
      query += "&year=" + that.year + "&month="+ that.month;
      return {
          title: "一键掌握" + that.year + "年" + that.month + "月的牛历",
          path: "/pages/calender/calender?" + query,
          imageUrl: "../../images/share.jpg",
          success: function(res) {
          },
          fail: function(res) {
           // 转发失败
          }
      }
  }
})
