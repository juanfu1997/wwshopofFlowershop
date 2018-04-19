const {$} = require('../../dist/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    chooseenNum:0,
    labelId:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var label = this.data.label
    // if(label,length > 6){
    //   label[6].label = '更多'
    //   label.bgcolor = '#d3d3d3'
    // }
    var label = this.data.label
    if(options.labelId){
      let labelId = options.labelId.split(',')
      $.each(label,(i,v) => {
        $.each(labelId,(i2,v2) => {
          if(v.id == v2){
            v.active = 'active'
          }
        })
      })
      this.setData({
        label,
        chooseenNum:labelId.length,
      })
    }
  
  },
  getLabel(e){
    var chooseenNum = this.data.chooseenNum
    var index = e.currentTarget.dataset.index
    var label = this.data.label
    if(label[index].active){
      label[index].active = ''
      chooseenNum -= 1
    }else{
      if(chooseenNum === 2){
        wx.showModal({
            title: "提示",
            content: "最多2个，请取消选中的标签后再加",
            showCancel: false
         });
        return;
      }
      label[index].active = 'active'
      chooseenNum += 1
    }
    this.setData({
      label,
      chooseenNum,
    })
    // $.each(label,(i,v)=>{
    //   v.active
    // })
    console.log(e,index)
  },
  submitLable(){
    var label = this.data.label
    var labelId = this.data.labelId
    $.each(label,(i,v) => {
      if(v.active == 'active'){
        labelId.length? labelId+=','+v.id : labelId += 'labelId='+v.id
      }
    })
    this.setData({
      labelId,
    })
    console.log(labelId)
    //记住用户标签
      wx.setStorageSync("labelId", labelId);
    //用户下次进入直接进入首页
      wx.setStorageSync("label", true);
    wx.redirectTo({
        url: "../index/index?" + labelId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})