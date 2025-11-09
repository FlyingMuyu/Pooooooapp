<template>
  <view class="about-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view @click="back" class="back-icon">
        <text class="back-icon-text">‹</text>
      </view>
      <text class="nav-title">关于我们</text>
      <view class="nav-right"></view>
    </view>

    <!-- 应用信息 -->
    <view class="app-info">
      <image class="app-logo" src="../../static/app-logo.svg" mode="aspectFit"></image>
      <text class="app-name">一起拉屎</text>
      <text class="app-version">版本 {{ version }}</text>
      <text class="app-slogan">记录生活，分享快乐</text>
    </view>

    <!-- 功能介绍 -->
    <view class="features-section">
      <text class="section-title">功能介绍</text>
      <view class="feature-list">
        <view class="feature-item">
          <text class="feature-icon">📝</text>
          <text class="feature-text">记录每日生活习惯</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <text class="feature-text">数据分析与统计</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🏆</text>
          <text class="feature-text">成就徽章系统</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">👥</text>
          <text class="feature-text">好友互动与竞争</text>
        </view>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="contact-section">
      <text class="section-title">联系我们</text>
      <view class="contact-item" @click="contactEmail">
        <text class="contact-label">邮箱</text>
        <text class="contact-value">muyu@mcjmz.cn</text>
      </view>
      <view class="contact-item" @click="contactWechat">
        <text class="contact-label">Github</text>
        <text class="contact-value">FlyingMuyu</text>
      </view>
    </view>

    <!-- 协议链接 -->
    <view class="agreement-section">
      <text @click="viewPrivacy" class="agreement-link">隐私政策</text>
      <text class="divider">|</text>
      <text @click="viewTerms" class="agreement-link">用户协议</text>
    </view>

    <!-- 版权信息 -->
    <text class="copyright">© 2025 一起拉屎 版权所有</text>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        version: 'Alpha0.0.1'
      };
    },
    onLoad() {
      try {
        console.log('关于我们页面加载');
        this.loadAppInfo();
      } catch (error) {
        console.error('页面加载异常:', error);
      }
    },
    onShow() {
      try {
        console.log('关于我们页面显示');
      } catch (error) {
        console.error('页面显示异常:', error);
      }
    },
    methods: {
      // 加载应用信息 - 保留固定版本号
      loadAppInfo() {
        try {
          // 不覆盖已设置的版本号
          console.log('当前应用版本:', this.version);
        } catch (error) {
          console.error('加载应用信息失败:', error);
        }
      },
      // 返回上一页
      back() {
        try {
          uni.navigateBack();
        } catch (error) {
          console.error('返回异常:', error);
        }
      },
      
      // 联系邮箱
      contactEmail() {
        try {
          uni.showModal({
            title: '联系邮箱',
            content: 'muyu@mcjmz.cn',
            showCancel: false,
            confirmText: '复制',
            success: (res) => {
              if (res.confirm) {
                // 尝试复制到剪贴板
                uni.setClipboardData({
                  data: 'muyu@mcjmz.cn',
                  success: () => {
                    uni.showToast({
                      title: '已复制',
                      icon: 'success'
                    });
                  }
                });
              }
            }
          });
        } catch (error) {
          console.error('联系邮箱功能异常:', error);
        }
      },
      
      // 联系微信
      contactWechat() {
        try {
          uni.showModal({
            title: 'Github',
            content: 'FlyingMuyu',
            showCancel: false,
            confirmText: '复制',
            success: (res) => {
              if (res.confirm) {
                // 尝试复制到剪贴板
                uni.setClipboardData({
                  data: 'FlyingMuyu',
                  success: () => {
                    uni.showToast({
                      title: '已复制',
                      icon: 'success'
                    });
                  }
                });
              }
            }
          });
        } catch (error) {
          console.error('联系微信功能异常:', error);
        }
      },
      
      // 查看隐私政策
      viewPrivacy() {
        try {
          uni.navigateTo({
            //url: '/pages/webview/webview?url=#',
			url: '#',
            fail: (err) => {
              console.error('跳转隐私政策失败:', err);
              uni.showToast({
                title: '演示程序暂无协议',
                icon: 'none'
              });
            }
          });
        } catch (error) {
          console.error('查看隐私政策异常:', error);
        }
      },
      
      // 查看用户协议
      viewTerms() {
        try {
          uni.navigateTo({
            url: '#',
            fail: (err) => {
              console.error('跳转用户协议失败:', err);
              uni.showToast({
                title: '演示程序暂无协议',
                icon: 'none'
              });
            }
          });
        } catch (error) {
          console.error('查看用户协议异常:', error);
        }
      }
    }
  };
</script>

<style scoped>
  .about-container {
    flex: 1;
    background-color: #F5F5F5;
    padding-bottom: 60rpx;
  }
  
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120rpx;
    padding: 0 30rpx;
    background-color: #FFFFFF;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .back-icon {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-icon-text {
    font-size: 48rpx;
    color: #333333;
    font-weight: bold;
  }
  
  .nav-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333333;
  }
  
  .nav-right {
    width: 48rpx;
  }
  
  .app-info {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    margin-bottom: 30rpx;
  }
  
  .app-logo {
    width: 180rpx;
    height: 180rpx;
    border-radius: 30rpx;
    margin-bottom: 30rpx;
  }
  
  .app-name {
    font-size: 44rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 10rpx;
  }
  
  .app-version {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 20rpx;
  }
  
  .app-slogan {
    font-size: 30rpx;
    color: #666666;
  }
  
  .features-section {
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 30rpx;
  }
  
  .section-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 30rpx;
  }
  
  .feature-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30rpx;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #F9F9F9;
    border-radius: 20rpx;
  }
  
  .feature-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .feature-text {
    font-size: 30rpx;
    color: #666666;
  }
  
  .contact-section {
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 60rpx;
  }
  
  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
  }
  
  .contact-label {
    font-size: 32rpx;
    color: #333333;
  }
  
  .contact-value {
    font-size: 32rpx;
    color: #A67D4F;
  }
  
  .agreement-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .agreement-link {
    font-size: 28rpx;
    color: #A67D4F;
  }
  
  .divider {
    font-size: 28rpx;
    color: #CCCCCC;
    margin: 0 30rpx;
  }
  
  .copyright {
    display: block;
    text-align: center;
    font-size: 26rpx;
    color: #999999;
  }
</style>