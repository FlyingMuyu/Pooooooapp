//  FlyingMuyu复刻和开发
import App from './App'

// 通用的本地存储方法
const localStorageHelper = {
  // 存储数据
  set(key, value) {
    try {
      uni.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('存储数据失败:', e)
      return false
    }
  },
  
  // 获取数据
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (e) {
      console.error('获取数据失败:', e)
      return defaultValue
    }
  },
  
  // 删除数据
  remove(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('删除数据失败:', e)
      return false
    }
  },
  
  // 清空所有数据
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (e) {
      console.error('清空数据失败:', e)
      return false
    }
  }
}

// 通用的初始化应用函数
function initApp() {
  // 初始化应用
  
  // 初始化注册用户存储
  if (!localStorageHelper.get('registeredUsers')) {
    localStorageHelper.set('registeredUsers', []);
  }
  
  // 检查用户登录状态
  const userInfo = localStorageHelper.get('userInfo');
  if (userInfo && userInfo.isLogin) {
    console.log('用户已登录');
    // 已登录，可以考虑跳转到首页
  } else {
    console.log('用户未登录');
  }
  
  // 初始化必要的本地存储结构
  const requiredKeys = ['userRecords', 'userSettings', 'achievements', 'friends'];
  requiredKeys.forEach(key => {
    if (!localStorageHelper.get(key)) {
      localStorageHelper.set(key, []);
    }
  });
}

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

// 全局方法
Vue.prototype.$showToast = function(title, icon = 'none') {
  uni.showToast({
    title: title,
    icon: icon,
    duration: 2000
  })
}

Vue.prototype.$showConfirm = function(title, content, successCallback) {
  uni.showModal({
    title: title,
    content: content,
    success: successCallback
  })
}

// 挂载本地存储到Vue原型
Vue.prototype.$localStorage = localStorageHelper;

// 模拟API调用（全部使用本地存储）
Vue.prototype.$api = {
  // 模拟登录
  login(params) {
    return new Promise((resolve) => {
      // 返回登录成功
      setTimeout(() => {
        resolve({
          code: 200,
          message: '登录成功',
          data: {
            token: 'local_token_' + Date.now(),
            userInfo: params
          }
        })
      }, 100)
    })
  },
  
  // 获取数据
  getData(key) {
    return new Promise((resolve) => {
      const data = localStorageHelper.get(key, [])
      setTimeout(() => {
        resolve({
          code: 200,
          message: '数据获取成功',
          data: data
        })
      }, 100)
    })
  },
  
  // 保存数据
    saveData(key, data) {
      return new Promise((resolve) => {
        const success = localStorageHelper.set(key, data)
        setTimeout(() => {
          resolve({
            code: success ? 200 : 500,
            message: success ? '数据保存成功' : '数据保存失败'
          })
        }, 100)
      })
    }
}

App.mpType = 'app'

const app = new Vue({
  ...App,
  onLaunch() {
    initApp()
  }
})
app.$mount()

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  
  // 在Vue 3中，使用app.config.globalProperties挂载全局属性
  app.config.globalProperties.$showToast = function(title, icon = 'none') {
    uni.showToast({
      title: title,
      icon: icon,
      duration: 2000
    })
  }
  
  app.config.globalProperties.$showConfirm = function(title, content, successCallback) {
    uni.showModal({
      title: title,
      content: content,
      success: successCallback
    })
  }
  
  // 挂载本地存储到Vue 3全局属性
  app.config.globalProperties.$localStorage = localStorageHelper;
  
  // 模拟API调用（全部使用本地存储）
  app.config.globalProperties.$api = {
    // 模拟登录
    login(params) {
      return new Promise((resolve) => {
        // 返回登录成功
        setTimeout(() => {
          resolve({
            code: 200,
            message: '登录成功',
            data: {
              token: 'local_token_' + Date.now(),
              userInfo: params
            }
          })
        }, 100)
      })
    },
    
    // 获取数据
    getData(key) {
      return new Promise((resolve) => {
        const data = localStorageHelper.get(key, [])
        setTimeout(() => {
          resolve({
            code: 200,
            message: '数据获取成功',
            data: data
          })
        }, 100)
      })
    },
    
    // 保存数据
    saveData(key, data) {
      return new Promise((resolve) => {
        const success = localStorageHelper.set(key, data)
        setTimeout(() => {
          resolve({
            code: success ? 200 : 500,
            message: success ? '数据保存成功' : '数据保存失败'
          })
        }, 100)
      })
    }
  }
  
  // 在Vue 3中初始化应用
  initApp()
  
  return {
    app
  }
}
// #endif