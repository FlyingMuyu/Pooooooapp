<template>
  <view class="register-container">
    <view class="logo-section">
      <view class="logo-emoji">💩</view>
      <text class="app-name">一起拉屎</text>
      <!-- 注册提示 -->
      <view class="register-tip">
        <text class="register-text">创建账号，开始记录健康生活</text>
      </view>
    </view>
    
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">手机号码</text>
        <input class="input-field" type="number" placeholder="请输入手机号码" v-model="phoneNumber" maxlength="11">
      </view>
      
      <view class="input-group">
        <text class="input-label">密码</text>
        <input class="input-field" type="password" placeholder="请设置6-20位密码" v-model="password">
      </view>
      
      <view class="input-group">
        <text class="input-label">确认密码</text>
        <input class="input-field" type="password" placeholder="请再次输入密码" v-model="confirmPassword">
      </view>
      
      <view class="input-group">
        <text class="input-label">昵称</text>
        <input class="input-field" type="text" placeholder="请输入昵称" v-model="nickname">
      </view>
      
      <view class="register-button" @click="register" hover-class="button-hover">注册</view>
      
      <view class="login-section">
        <text>已有账号? </text>
        <text class="login-link" @click="goToLogin" style="display: inline-block; padding: 5rpx;">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        nickname: ''
      }
    },
    methods: {
      validateForm() {
        // 手机号验证
        if (!this.phoneNumber || !/^1[3-9]\d{9}$/.test(this.phoneNumber)) {
          uni.showToast({
            title: '请输入正确的手机号码',
            icon: 'none'
          });
          return false;
        }
        
        // 密码验证
        if (!this.password || this.password.length < 6 || this.password.length > 20) {
          uni.showToast({
            title: '密码长度应为6-20位',
            icon: 'none'
          });
          return false;
        }
        
        // 确认密码
        if (this.password !== this.confirmPassword) {
          uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
          });
          return false;
        }
        
        // 昵称验证
        if (!this.nickname || this.nickname.length < 2 || this.nickname.length > 20) {
          uni.showToast({
            title: '昵称长度应为2-20位',
            icon: 'none'
          });
          return false;
        }
        
        // 检查用户是否已存在 - 使用备用方案
        try {
          console.log('检查用户是否已存在');
          let existingUsers = [];
          
          // 首先尝试使用 $localStorage
          if (this.$localStorage) {
            try {
              existingUsers = this.$localStorage.get('registeredUsers') || [];
            } catch (e) {
              console.error('使用 $localStorage.get 失败', e);
              // 失败则使用直接方法
              existingUsers = uni.getStorageSync('registeredUsers') || [];
            }
          } else {
            // 如果 $localStorage 不存在，直接使用 uni.getStorageSync
            existingUsers = uni.getStorageSync('registeredUsers') || [];
          }
          
          const userExists = existingUsers.some(user => user.phoneNumber === this.phoneNumber);
          if (userExists) {
            uni.showToast({
              title: '该手机号已注册',
              icon: 'none'
            });
            return false;
          }
        } catch (error) {
          console.error('检查用户是否存在时出错:', error);
          // 如果检查失败，暂时允许注册，避免因存储问题阻止用户
          uni.showToast({
            title: '无法检查用户是否已存在，请继续',
            icon: 'none'
          });
        }
        
        return true;
      },
      
      register() {
        console.log('注册按钮被点击');
        
        try {
          // 检查 $localStorage 是否可用
          console.log('检查 $localStorage 是否可用:', this.$localStorage ? '是' : '否');
          
          if (!this.$localStorage) {
            throw new Error('本地存储功能不可用');
          }
          
          // 表单验证
          if (!this.validateForm()) {
            console.log('表单验证失败');
            return;
          }
          
          // 显示注册中提示
          uni.showLoading({
            title: '注册中...'
          });
          
          // 获取现有用户列表 - 使用备用方案
          console.log('获取现有用户列表');
          let existingUsers = [];
          try {
            // 尝试使用 $localStorage
            existingUsers = this.$localStorage.get('registeredUsers') || [];
          } catch (e) {
            console.error('使用 $localStorage 失败，尝试直接使用 uni.getStorageSync', e);
            // 备用方案：直接使用 uni.getStorageSync
            try {
              existingUsers = uni.getStorageSync('registeredUsers') || [];
            } catch (ee) {
              console.error('uni.getStorageSync 也失败', ee);
              // 如果都失败，使用空数组
              existingUsers = [];
            }
          }
          console.log('现有用户数量:', existingUsers.length);
          
          // 创建新用户
          const newUser = {
            phoneNumber: this.phoneNumber,
            password: this.password,  // 实际应用中应该加密存储
            nickname: this.nickname,
            createTime: new Date().getTime()
          };
          
          // 添加到用户列表
          existingUsers.push(newUser);
          
          // 存储用户数据 - 使用备用方案
          console.log('保存新用户到本地存储');
          let saveResult = false;
          try {
            // 尝试使用 $localStorage
            saveResult = this.$localStorage.set('registeredUsers', existingUsers);
          } catch (e) {
            console.error('使用 $localStorage 失败，尝试直接使用 uni.setStorageSync', e);
            // 备用方案：直接使用 uni.setStorageSync
            try {
              uni.setStorageSync('registeredUsers', existingUsers);
              saveResult = true;
            } catch (ee) {
              console.error('uni.setStorageSync 也失败', ee);
              saveResult = false;
            }
          }
          console.log('保存结果:', saveResult);
          
          if (!saveResult) {
            throw new Error('保存用户数据失败');
          }
          
          // 模拟延时
          setTimeout(() => {
            uni.hideLoading();
            
            uni.showToast({
              title: '注册成功，正在跳转到登录页面',
              icon: 'success',
              duration: 1500
            });
            
            // 注册成功后跳转到登录页面
            setTimeout(() => {
              this.goToLogin();
            }, 1500);
          }, 1000);
        } catch (error) {
          console.error('注册过程发生错误:', error);
          uni.hideLoading();
          uni.showToast({
            title: '注册失败: ' + error.message,
            icon: 'none',
            duration: 3000
          });
        }
      },
      
      // 移除自动登录功能，注册成功后直接跳转到登录页面
      
      
      goToLogin() {
        console.log('跳转到登录页面');
        // 确保明确跳转到登录页面，而不是简单的返回
        // 尝试多种跳转方式以确保成功
        try {
          // 首先尝试navigateTo到登录页面
          uni.navigateTo({
            url: '/pages/login/login',
            success: (res) => {
              console.log('navigateTo到登录页面成功', res);
            },
            fail: (err) => {
              console.log('navigateTo失败，尝试redirectTo', err);
              // 如果navigateTo失败，尝试redirectTo
              uni.redirectTo({
                url: '/pages/login/login',
                success: (res) => {
                  console.log('redirectTo到登录页面成功', res);
                },
                fail: (err) => {
                  console.log('redirectTo失败，尝试switchTab', err);
                  // 如果redirectTo也失败，尝试switchTab（假设登录页面在tabBar中）
                  uni.switchTab({
                    url: '/pages/login/login',
                    success: (res) => {
                      console.log('switchTab到登录页面成功', res);
                    },
                    fail: (err) => {
                      console.error('所有跳转方式都失败', err);
                      uni.showToast({
                        title: '无法跳转到登录页面',
                        icon: 'none'
                      });
                    }
                  });
                }
              });
            }
          });
        } catch (error) {
          console.error('跳转过程发生错误:', error);
        }
      }
    }
  }
</script>

<style scoped>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 40rpx;
    background-color: #FFFFFF;
    min-height: 100vh;
  }
  
  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
    margin-top: 80rpx;
  }
  
  .logo-emoji {
    font-size: 160rpx;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    font-size: 48rpx;
    color: #A67D4F;
    font-weight: bold;
  }
  
  .register-tip {
    margin-top: 20rpx;
    padding: 15rpx;
    text-align: center;
  }
  
  .register-text {
    font-size: 28rpx;
    color: #666666;
  }
  
  .form-section {
    width: 100%;
  }
  
  .input-group {
    margin-bottom: 30rpx;
  }
  
  .input-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .input-field {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 10rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
  }
  
  .register-button {
    width: 100%;
    height: 88rpx;
    background-color: #A67D4F;
    color: #FFFFFF;
    font-size: 32rpx;
    border-radius: 44rpx;
    margin-bottom: 40rpx;
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 10;
  }
  
  .button-hover {
    opacity: 0.8;
    background-color: #8B6914;
  }
  
  .login-section {
    text-align: center;
    font-size: 28rpx;
    color: #666666;
  }
  
  .login-link {
    color: #A67D4F;
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(166, 125, 79, 0.2);
    &:active {
      opacity: 0.8;
    }
  }
</style>