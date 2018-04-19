const $ = require('../../utils/util.js')
Page({
  data: {
    few: "",
    time: "",
    typesArray: [],
    img: getApp().data.img,
    isTagHidden: true
  },
  onLoad: function (options) {
    getApp().getOpenId(() => {
        })
    //默认日期
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    this.month = month;
    this.year = year;
    this.typeids = options.t;
    const query = options.t.split(",");
    const typesArray = [];
    this.getData(month, year, options.t);
    this.setData({
      time: year + "年" + (month < 10 ? "0" + month : month) + "月"
    })
    this.GetTypeCommonListByParentID(result => {
      for (let item of result) {
        for (let one of query) {
          if (item.id == Number(one)) {
            typesArray.push({
              id: item.id,
              type: item.typename,
              bgColor: '#' + item.namecolor,
              active: true
            })
          }
        }
      }
      this.setData({
        typeids: options.t,
        tyeQuery: options.t,
        typesArray: typesArray,
        time: year + "年" + (month < 10 ? "0" + month : month) + "月"
      })
      this.getData(month, year, options.t);
    })
  },
  // onShow: function() {
  //   const newUserAdded = wx.getStorageSync('newUserAdded');
  //   //如果从list返回的，并且加了自定义事件，刷新数据
  //   if (this.data.fromList && newUserAdded.length) {
  //     let allDays = this.data.allDays;
  //     for (let value of allDays) {
  //       if (value.id == this.data.fromDay) {
  //           console.log("id", value.id);
  //           for (let v of newUserAdded) {
  //             value.holidays.push({
  //               user: 'user',
  //               name: v.title,
  //               bgColor: "#7d6b86"
  //             })
  //           }
  //       }
  //     }
  //     this.setData({
  //       allDays: allDays
  //     })
  //   }
  // },
  getData: function(mm, yyyy, type) {
      if (!type) {
        type = 0;
      }
      const that = this;
      var allDays = [];
      var daysOfMonth = this.checkDaysOfMonth(mm, yyyy);
      const yearMonth = yyyy + "-" + (mm > 9 ? mm: "0" + mm);
      for (var i = 0; i < daysOfMonth; i +=1) {
            allDays[i] = {
                id: i + 1,
                off: false,
                holidays: []
            }
      }
      this.setData({
        allDays,
      })
      console.log(allDays)
      this.GetSingleCommonList(yearMonth).then(res => {
        console.log('res',res)
        const holidaysData = that.populateData(res, [], that.data.typesArray);
        that.GetRestDateList(yearMonth).then(data => {
          console.log('22',data)
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
          that.getUserEvents(allDays, daysOfMonth,data)    
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
        if (day.holidays.length == 2 && holiday.name.length >= 7) {
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
  getUserEvents: function( allDays, daysOfMonth) {
    const that = this;

      //最后一行剩下的空间与一号前面也需要有边框
      allDays= that.reArangeHolidays(allDays);
      const weekDay = new Date(yyyy, mm - 1, 1).getDay();
      for (var v = 0; v < weekDay; v += 1) {
        allDays.unshift({});
      }
      var totalSpots = daysOfMonth + weekDay;
      allDays = that.getMoreSpots(totalSpots, allDays);
      allDays = that.setRestDays(allDays);
      //法定节假日显示休字
      const holiday17Days = [[1,2,27,28,29,30,31], [1,2], [], [2,3,4,29,30],[1,28,29,30],[],[],[],[],[1,2,3,4,5,6,7,8],[],[]];
      if (yyyy == 2017) {
        for (let d of allDays) {
          d.off = false;
          for (let h of holiday17Days[mm - 1]) {
            if (h == d.id) {
              d.off = true
            }
          }
        }
      }
      that.setData({
          allDays: allDays
      })
      $.hideLoading();  
  },
  setRestDays: function(allDays) {
    //确定周末
    //如果是2018，暂未确定法定节假日休息，暂定显示周末休息   
    for (let d = 0, max = allDays.length; d < max; d += 1) {
      if (allDays[d].id) {
         allDays[d].weekend = '';
         if (d === 0) {
           allDays[d].weekend = 'weekend';
         }
         if ((d + 1) % 7 === 0 || d % 7 === 0) {
           allDays[d].weekend = 'weekend';
         }
         if(!allDays[d].off && this.year == 2017) {
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
    //日历限制为2017年--2018年
    if (this.year === 2017 && this.month === 1) {
      isLeftHidden = true;
    }
    if (this.year === 2018 && this.month === 12) {
      isRightHidden = true;
    }
    this.getData(this.month, this.year, this.data.typeids);
    this.setData({
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
    wx.setStorageSync("typeids", this.data.typeids);
    this.getData(this.month, this.year, this.data.typeids);
  },
  goRec: function(e) {
    wx.navigateTo({
      url: "../recommend/recommend"
    })
  },
  goList: function(e) {
    const index = e.currentTarget.dataset.index;
    const allDays = this.data.allDays;
    const fromDay = allDays[index].id;
    if(!allDays[index].id) {
      return;
    }
    allDays[index].active = "active";
    //fromList,fromDay记录是否去了list页，以便在onShow里更新用户事件
    this.setData({
      allDays: allDays,
      fromDay: fromDay,
      fromList: true
    })
    wx.navigateTo({
      url: "../list/list?year=" + this.year + "&month=" + this.month + "&day=" + allDays[index].id + "&t=" + this.data.tyeQuery
    })
  },
  // onShareAppMessage: function(res) {
  //     const that = this;
  //     return {
  //        title: "",
  //        path: "/pages/calender/calender?t=" + that.data.typeids,
  //        success: function(res) {
  //        },
  //        fail: function(res) {
  //         // 转发失败
  //        }
  //     }
  // },
  checkDaysOfMonth: function(mm, yyyy) {
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
  //接口
  GetTypeCommonListByParentID(callback) {
    $.get('/KorjoApi/GetTypeCommonListByParentID', {parentid: 0, projectid: 1}, callback)
  },
  GetSingleCommonList(date,callback) {

    return $.get('/GspaceApi/GetSingleCommonList', {date}, callback)
  },
  GetRestDateList(yearmonth, callback) {
     return $.get('/KorjoApi/GetRestDateList', {yearmonth}, callback)
  },
  GetCalendarUserEvent(openid,calendar_date,isdate,callback) {
    $.get('/KorjoApi/GetCalendarUserEvent', {openid, calendar_date, isdate}, callback)
  }
})      