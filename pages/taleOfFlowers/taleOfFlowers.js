// pages/taleOfFlowers/taleOfFlowers.js
const { $ } = require('../../dist/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      labelArray: [{
        label: "花语"
      },{
        label: "养护指示",
        bg: "active"
      }],
      fqa:[
       {q:'新花到家应该怎么有效养护？',a:'鲜花刚买回来后，如不做保鲜的措施，鲜花的寿命会很短。'},
      ],
      category:[
          {img:'taleOfFlower.png',name:'爱情专区'},
          {img:'taleOfFlower.png',name:'爱情专区'},
          {img:'taleOfFlower.png',name:'爱情专区'},
          {img:'taleOfFlower.png',name:'爱情专区'},
      ],
      flowerList:[
          {img:'https://img01.hua.com/uploadpic/newpic/9010741.jpg',name:'99朵红色康乃馨'},
          {img:'https://img01.hua.com/uploadpic/newpic/9010741.jpg',name:'99朵红色康乃馨'},
          {img:'https://img01.hua.com/uploadpic/newpic/9010741.jpg',name:'99朵红色康乃馨'},
          {img:'https://img01.hua.com/uploadpic/newpic/9010741.jpg',name:'99朵红色康乃馨'},
      ],
      chosen: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  checkList: function(e) {
    console.log(e)
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
  getCategoryData(e){
    const that = this
    const idnex = e.currentTarget.dataset.index
    const category = that.data.category
  },
  getTableOfFlowers(e){
    $.goPage(e)
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