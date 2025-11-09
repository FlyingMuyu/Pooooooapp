<template>
  <view class="settings-container">
    <view class="page-header">
      <view class="back-button" @click="navigateBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="page-title">设置</text>
      <view class="empty-space"></view>
    </view>
    
    <!-- 账号设置 -->
    <view class="settings-section">
      <view class="section-title">账号设置</view>
      <view class="setting-item" @click="editProfile">
        <text class="setting-label">个人资料</text>
        <view class="setting-right">
          <text class="setting-value">点击修改</text>
          <text class="setting-arrow">›</text>
        </view>
      </view>
      <view class="setting-item" @click="changePassword">
        <text class="setting-label">修改密码</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="bindAccounts">
        <text class="setting-label">绑定账号</text>
        <view class="setting-right">
          <text class="setting-value">2/3</text>
          <text class="setting-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 通知设置 -->
    <view class="settings-section">
      <view class="section-title">通知设置</view>
      <view class="setting-item">
        <text class="setting-label">推送通知</text>
        <switch class="setting-switch" @change="toggleNotification" :checked="notificationEnabled"></switch>
      </view>
      <view class="setting-item">
        <text class="setting-label">提醒推送</text>
        <switch class="setting-switch" @change="toggleReminder" :checked="reminderEnabled"></switch>
      </view>
      <view class="setting-item">
        <text class="setting-label">好友消息</text>
        <switch class="setting-switch" @change="toggleFriendMsg" :checked="friendMsgEnabled"></switch>
      </view>
    </view>
    
    <!-- 隐私设置 -->
    <view class="settings-section">
      <view class="section-title">隐私设置</view>
      <view class="setting-item" @click="privacySetting">
        <text class="setting-label">隐私设置</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="clearCache">
        <text class="setting-label">清除缓存</text>
        <view class="setting-right">
          <text class="setting-value">12.5MB</text>
          <text class="setting-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 通用设置 -->
    <view class="settings-section">
      <view class="section-title">通用设置</view>
      <view class="setting-item" @click="themeSetting">
        <text class="setting-label">主题设置</text>
        <view class="setting-right">
          <text class="setting-value">浅色模式</text>
          <text class="setting-arrow">›</text>
        </view>
      </view>
      <view class="setting-item" @click="languageSetting">
        <text class="setting-label">语言设置</text>
        <view class="setting-right">
          <text class="setting-value">简体中文</text>
          <text class="setting-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 关于 -->
    <view class="settings-section">
      <view class="setting-item" @click="aboutUs">
        <text class="setting-label">关于我们</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="userAgreement">
        <text class="setting-label">用户协议</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="privacyPolicy">
        <text class="setting-label">隐私政策</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="feedback">
        <text class="setting-label">意见反馈</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-button" @click="logout">退出登录</button>
    </view>
    
    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">版本号: 1.0.0</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        notificationEnabled: true,
        reminderEnabled: true,
        friendMsgEnabled: true
      }
    },
    onLoad() {
      try {
        console.log('设置页面加载');
        this.loadSettings();
      } catch (error) {
        console.error('页面加载异常:', error);
      }
    },
    onShow() {
      try {
        console.log('设置页面显示');
        // 页面显示时刷新设置状态
        this.refreshSettings();
      } catch (error) {
        console.error('页面显示异常:', error);
      }
    },
    methods: {
      // 加载设置
      loadSettings() {
        try {
          // 尝试从本地存储加载设置
          const savedSettings = uni.getStorageSync('appSettings');
          if (savedSettings) {
            this.notificationEnabled = savedSettings.notificationEnabled !== undefined ? savedSettings.notificationEnabled : true;
            this.reminderEnabled = savedSettings.reminderEnabled !== undefined ? savedSettings.reminderEnabled : true;
            this.friendMsgEnabled = savedSettings.friendMsgEnabled !== undefined ? savedSettings.friendMsgEnabled : true;
          }
        } catch (error) {
          console.error('加载设置失败:', error);
        }
      },
      // 保存设置
      saveSettings() {
        try {
          const settings = {
            notificationEnabled: this.notificationEnabled,
            reminderEnabled: this.reminderEnabled,
            friendMsgEnabled: this.friendMsgEnabled
          };
          uni.setStorageSync('appSettings', settings);
          console.log('设置已保存');
        } catch (error) {
          console.error('保存设置失败:', error);
        }
      },
      // 刷新设置
      refreshSettings() {
        this.loadSettings();
      },
        navigateBack() {
        uni.navigateBack()
      },
      editProfile() {
        try {
          console.log('编辑个人资料')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('编辑个人资料功能异常:', error)
        }
      },
      changePassword() {
        try {
          console.log('修改密码')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('修改密码功能异常:', error)
        }
      },
      bindAccounts() {
        try {
          console.log('绑定账号')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('绑定账号功能异常:', error)
        }
      },
      toggleNotification(e) {
        try {
          this.notificationEnabled = e.detail.value
          console.log('推送通知:', this.notificationEnabled)
          // 切换开关时自动保存设置
          this.saveSettings();
        } catch (error) {
          console.error('切换推送通知异常:', error);
          // 恢复原来的状态
          this.notificationEnabled = !e.detail.value;
        }
      },
      toggleReminder(e) {
        try {
          this.reminderEnabled = e.detail.value
          console.log('提醒推送:', this.reminderEnabled)
          // 切换开关时自动保存设置
          this.saveSettings();
        } catch (error) {
          console.error('切换提醒推送异常:', error);
          // 恢复原来的状态
          this.reminderEnabled = !e.detail.value;
        }
      },
      toggleFriendMsg(e) {
        try {
          this.friendMsgEnabled = e.detail.value
          console.log('好友消息:', this.friendMsgEnabled)
          // 切换开关时自动保存设置
          this.saveSettings();
        } catch (error) {
          console.error('切换好友消息异常:', error);
          // 恢复原来的状态
          this.friendMsgEnabled = !e.detail.value;
        }
      },
      privacySetting() {
        try {
          console.log('隐私设置')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('隐私设置功能异常:', error)
        }
      },
      clearCache() {
        uni.showModal({
          title: '提示',
          content: '确定要清除缓存吗？',
          success: (res) => {
            if (res.confirm) {
              console.log('清除缓存')
              uni.showToast({
                title: '缓存已清除',
                icon: 'success'
              })
            }
          }
        })
      },
      themeSetting() {
        try {
          console.log('主题设置')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('主题设置功能异常:', error)
        }
      },
      languageSetting() {
        try {
          console.log('语言设置')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('语言设置功能异常:', error)
        }
      },
      aboutUs() {
        try {
          console.log('关于我们')
          uni.navigateTo({
            url: '/pages/about/about',
            fail: (err) => {
              console.error('跳转关于我们页面失败:', err)
              uni.showToast({
                title: '该功能暂未开放',
                icon: 'none'
              })
            }
          })
        } catch (error) {
          console.error('关于我们功能异常:', error)
        }
      },
      userAgreement() {
        try {
          console.log('用户协议')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('用户协议功能异常:', error)
        }
      },
      privacyPolicy() {
        try {
          console.log('隐私政策')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('隐私政策功能异常:', error)
        }
      },
      feedback() {
        try {
          console.log('意见反馈')
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        } catch (error) {
          console.error('意见反馈功能异常:', error)
        }
      },
      logout() {
        try {
          uni.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
              if (res.confirm) {
                console.log('退出登录')
                uni.navigateTo({
                  url: '/pages/login/login'
                })
              }
            }
          })
        } catch (error) {
          console.error('退出登录功能异常:', error)
        }
      }
    }
  }
</script>

<style scoped>
  .settings-container {
    padding-bottom: 50rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    background-color: #FFFFFF;
    margin-bottom: 30rpx;
  }
  
  .back-button {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-icon {
    font-size: 40rpx;
    color: #333333;
    font-weight: bold;
  }
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
  }
  
  .empty-space {
    width: 40rpx;
  }
  
  .settings-section {
    background-color: #FFFFFF;
    margin-bottom: 30rpx;
    padding: 0 30rpx;
  }
  
  .section-title {
    font-size: 28rpx;
    color: #999999;
    padding: 20rpx 0;
  }
  
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .setting-item:last-child {
    border-bottom: none;
  }
  
  .setting-label {
    font-size: 30rpx;
    color: #333333;
  }
  
  .setting-right {
    display: flex;
    align-items: center;
  }
  
  .setting-value {
    font-size: 28rpx;
    color: #999999;
    margin-right: 10rpx;
  }
  
  .setting-arrow {
    font-size: 30rpx;
    color: #CCCCCC;
  }
  
  .setting-switch {
    transform: scale(0.8);
  }
  
  .logout-section {
    padding: 0 30rpx;
    margin-bottom: 30rpx;
  }
  
  .logout-button {
    width: 100%;
    height: 90rpx;
    background-color: #FFFFFF;
    color: #F5222D;
    font-size: 32rpx;
    border: none;
    border-radius: 10rpx;
    line-height: 90rpx;
  }
  
  .version-info {
    text-align: center;
  }
  
  .version-text {
    font-size: 26rpx;
    color: #999999;
  }
</style>