// pages/category/index.js

import {
  request
} from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  Categories: [],
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Categories = wx.getStorageSync("Categories");
    // 2 判断
    if(!Categories) {
       // 不存在  发送请求获取数据
      this.getCategories();
    } else {
      // 有旧的数据
      if(Date.now() - Categories.time > 1000 * 10 ){
        // 重新发送请求
        this.getCategories();
      } else {
        // 可以使用旧的数据
        this.Categories = Categories.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Categories.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Categories[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  /*
    获取 分类数据 
   */
  async getCategories() {

    /* request({
        url: "/categories"
      })
      .then(result => {
        this.Categories = result.data.message;

        // 把接口的数据存入到本地存储中
        wx.setStorageSync("Categories", { time: Date.now(), data: this.Categories });

        // 构造左侧的大菜单数据
        let leftMenuList = this.Categories.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Categories[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }) */
    // 1 使用es7的async await来发送请求
    const result = await request({ url: "/categories" });

    this.Categories = result;

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("Categories", { time: Date.now(), data: this.Categories });

    // 构造左侧的大菜单数据
    let leftMenuList = this.Categories.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Categories[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })

  },
  /**
   *左侧菜单点击事件 
   */
  handleItemTap(e){
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Categories[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    });
  }
})