// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

import auth from './auth.js'

let apiHost = "http://127.0.0.1:9630"
if (process.env.NODE_ENV === 'production') {
  apiHost = "http://127.0.0.1:9630"
}

let instance = axios.create({
  baseURL: apiHost+'/api',
  timeout: 15000,
})

// 添加token头
instance.interceptors.request.use(function (config) {
  config.headers['Token'] = auth.get()
  return config
}, function (error) {
  return Promise.reject(error);
});

// 出错提示与未登录跳转
instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (!error.response) {
    Vue.prototype.$message({
      type: 'error',
      message: '服务器错误'
    })
    return Promise.reject(error);
  }
  let errInfo = error.response.data
  Vue.prototype.$message({
    type: 'error',
    message: errInfo.msg
  })

  if (error.response.data.code === 401) {
    localStorage.setItem("lastVisitUrl", window.location.href)
    // 跳转到用户微信登陆
    window.location = 'http://localhost:8080/#/login'
  }
  return Promise.reject(error);
});


Vue.use(VueAxios, instance)
