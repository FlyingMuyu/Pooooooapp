<template>
  <view class="login-container">
    <view class="logo-section">
      <view class="logo-emoji">💩</view>
      <text class="app-name">一起拉屎</text>
      <!-- 欢迎提示 -->
      <view class="welcome-tip">
        <text class="welcome-text">欢迎使用一起拉屎</text>
      </view>
    </view>
    
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">手机号码</text>
        <input class="input-field" type="number" placeholder="请输入手机号码" v-model="phoneNumber">
      </view>
      
      <view class="input-group">
        <text class="input-label">密码</text>
        <input class="input-field" type="password" placeholder="请输入密码" v-model="password">
      </view>
      
      <view class="remember-section">
        <checkbox-group>
          <label>
            <checkbox value="remember" :checked="rememberMe" @change="rememberMe = !rememberMe"></checkbox>
            <text>记住我</text>
          </label>
        </checkbox-group>
        <text class="forgot-password" @click="forgotPassword">忘记密码?</text>
      </view>
      
      <view class="login-button" @click="login" hover-class="button-hover">登录</view>
      
      <view class="login-info">
        <text class="login-info-text">登录即同意用户协议和隐私政策</text>
      </view>
      
      <view class="register-section">
        <text>还没有账号? </text>
        <text class="register-link" @click="register" style="display: inline-block; padding: 5rpx;">立即注册</text>
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
        rememberMe: false
      }
    },
    created() {
      // 尝试从本地存储中读取已记住的登录信息
      try {
        console.log('尝试读取记住的登录信息');
        let rememberedUser = null;
        
        // 先尝试使用 $localStorage
        if (this.$localStorage) {
          rememberedUser = this.$localStorage.get('rememberedUser');
        } 
        // 如果 $localStorage 不可用，使用 uni.getStorageSync
        if (!rememberedUser) {
          rememberedUser = uni.getStorageSync('rememberedUser');
        }
        
        // 如果存在已记住的用户信息，则自动填充
        if (rememberedUser && rememberedUser.phoneNumber && rememberedUser.password) {
          console.log('找到记住的用户信息，自动填充表单');
          this.phoneNumber = rememberedUser.phoneNumber;
          this.password = rememberedUser.password;
          this.rememberMe = true;
        }
      } catch (error) {
        console.error('读取记住的登录信息失败:', error);
      }
    },
    methods: {
      validateLogin() {
        if (!this.phoneNumber) {
          uni.showToast({
            title: '请输入手机号码',
            icon: 'none'
          });
          return false;
        }
        
        if (!this.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          });
          return false;
        }
        
        return true;
      },
      
      login() {
        console.log('登录按钮被点击');
        
        try {
          // 检查 $localStorage 是否可用
          console.log('检查 $localStorage 是否可用:', this.$localStorage ? '是' : '否');
          
          // 表单验证
          if (!this.validateLogin()) {
            console.log('表单验证失败');
            return;
          }
          
          // 显示登录中提示
          uni.showLoading({
            title: '登录中...'
          });
          
          // 获取注册用户列表 - 使用备用方案
          console.log('获取注册用户列表');
          let registeredUsers = [];
          try {
            if (this.$localStorage) {
              // 尝试使用 $localStorage
              registeredUsers = this.$localStorage.get('registeredUsers') || [];
            } else {
              // 如果 $localStorage 不存在，直接使用 uni.getStorageSync
              registeredUsers = uni.getStorageSync('registeredUsers') || [];
            }
          } catch (e) {
            console.error('获取用户列表失败', e);
            // 失败则使用空数组
            registeredUsers = [];
          }
          console.log('注册用户数量:', registeredUsers.length);
          console.log('注册用户列表:', JSON.stringify(registeredUsers));
          
          // 查找用户
          console.log('查找用户，手机号:', this.phoneNumber);
          const user = registeredUsers.find(u => u.phoneNumber === this.phoneNumber);
          
          if (!user) {
            console.log('用户不存在');
            uni.hideLoading();
            uni.showToast({
              title: '用户不存在，请先注册',
              icon: 'none',
              duration: 2000
            });
            return;
          }
          
          // 验证密码
          console.log('验证密码');
          if (user.password !== this.password) {
            console.log('密码错误');
            uni.hideLoading();
            uni.showToast({
              title: '密码错误',
              icon: 'none',
              duration: 2000
            });
            return;
          }
          
          console.log('登录验证通过');
          
          // 本地存储登录信息
          const userInfo = {
            phoneNumber: this.phoneNumber,
            nickname: user.nickname,
            isLogin: true,
            loginTime: new Date().getTime()
          };
          
          // 存储用户信息到本地 - 使用备用方案
          console.log('存储用户信息到本地');
          let saveResult = false;
          try {
            if (this.$localStorage) {
              saveResult = this.$localStorage.set('userInfo', userInfo);
            } else {
              uni.setStorageSync('userInfo', userInfo);
              saveResult = true;
            }
          } catch (e) {
            console.error('保存用户信息失败', e);
            // 失败后尝试直接使用uni方法
            try {
              uni.setStorageSync('userInfo', userInfo);
              saveResult = true;
            } catch (ee) {
              saveResult = false;
            }
          }
          console.log('用户信息保存结果:', saveResult);
          
          // 如果勾选了记住我，额外存储密码（实际应用中应加密）
          if (this.rememberMe) {
            console.log('存储记住用户信息');
            try {
              if (this.$localStorage) {
                this.$localStorage.set('rememberedUser', {
                  phoneNumber: this.phoneNumber,
                  password: this.password
                });
              } else {
                uni.setStorageSync('rememberedUser', {
                  phoneNumber: this.phoneNumber,
                  password: this.password
                });
              }
            } catch (e) {
              console.error('保存记住用户信息失败', e);
            }
          } else {
            console.log('清除记住用户信息');
            try {
              if (this.$localStorage) {
                this.$localStorage.remove('rememberedUser');
              } else {
                uni.removeStorageSync('rememberedUser');
              }
            } catch (e) {
              console.error('清除记住用户信息失败', e);
            }
          }
          
          // 显示登录成功提示
          uni.hideLoading();
          uni.showToast({
            title: '登录成功，正在进入首页',
            icon: 'success',
            duration: 1500
          });
          
          // 延迟跳转
          setTimeout(() => {
            console.log('跳转到首页');
            // 尝试多种跳转方式确保成功
            uni.switchTab({
              url: '../index/index',
              success: (res) => {
                console.log('switchTab到首页成功', res);
              },
              fail: (err) => {
                console.log('switchTab失败，尝试redirectTo', err);
                uni.redirectTo({
                  url: '../index/index',
                  success: (res) => {
                    console.log('redirectTo到首页成功', res);
                  },
                  fail: (err) => {
                    console.log('redirectTo失败，尝试navigateTo', err);
                    uni.navigateTo({
                      url: '../index/index',
                      success: (res) => {
                        console.log('navigateTo到首页成功', res);
                      },
                      fail: (err) => {
                        console.error('所有跳转方式都失败', err);
                        uni.showToast({
                          title: '无法跳转到首页',
                          icon: 'none'
                        });
                      }
                    });
                  }
                });
              }
            });
          }, 1500);
        } catch (error) {
          console.error('登录过程发生错误:', error);
          uni.hideLoading();
          uni.showToast({
            title: '登录失败: ' + error.message,
            icon: 'none',
            duration: 3000
          });
        }
      },
      forgotPassword() {
        // 忘记密码逻辑
        console.log('忘记密码')
      },
      register() {
        console.log('注册按钮被点击');
        // 跳转到注册页面
        try {
          uni.navigateTo({
            url: '../register/register',
            success: (res) => {
              console.log('跳转到注册页面成功', res);
            },
            fail: (err) => {
              console.error('跳转到注册页面失败', err);
              uni.showToast({
                title: '无法跳转到注册页面',
                icon: 'none'
              });
            }
          });
        } catch (error) {
          console.error('注册跳转过程发生错误:', error);
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      }
    }
  }
</script>

<style scoped>
  .login-container {
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
    margin-bottom: 80rpx;
    margin-top: 100rpx;
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
  
  .welcome-tip {
    margin-top: 20rpx;
    padding: 15rpx;
    text-align: center;
  }
  
  .welcome-text {
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
  
  .remember-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
  }
  
  .forgot-password {
    font-size: 28rpx;
    color: #A67D4F;
  }
  
  .login-button {
    width: 100%;
    height: 88rpx;
    background-color: #A67D4F;
    color: #FFFFFF;
    font-size: 32rpx;
    border-radius: 44rpx;
    margin-bottom: 40rpx;
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
  
  .login-info {
    margin-top: 50rpx;
    text-align: center;
  }
  
  .login-info-text {
    font-size: 24rpx;
    color: #999999;
  }
  
  .register-section {
    text-align: center;
    font-size: 28rpx;
    color: #666666;
  }
  
  .register-link {
    color: #A67D4F;
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(166, 125, 79, 0.2);
    &:active {
      opacity: 0.8;
    }
  }
</style>