// api.js
// 在这里面定义所有接口，一个文件管理所有接口，易于维护
// 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项
import { http } from './http'; 

// 每一个接口定义一个函数，然后暴露出去，供逻辑代码调用
// 接口请求的路由地址以及请求方法在此处传递
const app = getApp()
//var url='http://192.168.3.105/jujia/';
var url='https://hxjjht.zxhxjjdzg.com/';

function getUserInfo(params) {  //获取个人信息
  http(url+'api/Index/apppost', 'post', params,'Personal/user_info')
}
function user_update(params) {  //选择身份
  http(url+'api/Index/apppost', 'post', params,'Personal/user_update')
}
function question_list(params) {  //问题列表
  http(url+'api/Index/apppost', 'post', params,'AfterSales/question_list')
}
function question_runedit(params) {  //一键售后
  http(url+'api/Index/apppost', 'post', params,'AfterSales/question_runedit')
}
function after_sales_deal_with(params) {  //售后处理
  http(url+'api/Index/apppost', 'post', params,'AfterSales/after_sales_deal_with')
}
function question_detail(params) {  //问题详情
  http(url+'api/Index/apppost', 'post', params,'AfterSales/question_detail')
}
function after_sales_appraise(params) {  //售后评价
  http(url+'api/Index/apppost', 'post', params,'AfterSales/after_sales_appraise')
}
function my_after_sales_list(params) {  //我的售后
    http(url+'api/Index/apppost', 'post', params,'AfterSales/my_after_sales_list')
  }
  function question_edit(params) {  //我的售后详情
    http(url+'api/Index/apppost', 'post', params,'AfterSales/question_edit')
  } 
  function goods_list(params) {  //积分列表
    http(url+'api/Index/apppost', 'post', params,'Goods/goods_list')
  }
  function goods_detail(params) {  //列表详情
    http(url+'api/Index/apppost', 'post', params,'Goods/goods_detail')
  }
  function goods_exchange(params) {  //兑换
    http(url+'api/Index/apppost', 'post', params,'Goods/goods_exchange')
  }
  function goods_order_list(params) {  //兑换明细
    http(url+'api/Index/apppost', 'post', params,'Personal/goods_order_list')
  }  
  function coupon_list(params) {  //优惠券
    http(url+'api/Index/apppost', 'post', params,'Personal/coupon_list')
  } 
  function exchange_coupon(params) {  //优惠券
    http(url+'api/Index/apppost', 'post', params,'Personal/exchange_coupon')
  }  
  function product_list(params) {  //产品列表
    http(url+'api/Index/apppost', 'post', params,'Home/product_list')
  }  
  function case_list(params) {  //案例列表
    http(url+'api/Index/apppost', 'post', params,'Home/case_list')
  } 
  function product_detail(params) {  //产品详情
    http(url+'api/Index/apppost', 'post', params,'Home/product_detail')
  } 
  function integral_detail(params) {  //积分列表
    http(url+'api/Index/apppost', 'post', params,'Personal/integral_detail')
  }       
// 暴露接口
export default { 
  getUserInfo,
  user_update,
  question_list,
  question_runedit,
  after_sales_deal_with,
  question_detail,
  after_sales_appraise,
  my_after_sales_list,
  question_edit,
  goods_list,
  goods_detail,
  goods_exchange,
  goods_order_list,
  coupon_list,
  exchange_coupon,
  product_list,
  case_list,
  product_detail,
  integral_detail
}