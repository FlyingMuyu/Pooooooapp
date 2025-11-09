<template>
  <view class="webview-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view @click="back" class="back-icon">
        <text class="icon-text">‹</text>
      </view>
      <text class="nav-title">{{ pageTitle }}</text>
      <view @click="refresh" class="refresh-icon">
        <text class="icon-text">🔄</text>
      </view>
    </view>

    <!-- web-view组件 -->
    <web-view 
      id="webview"
      :src="webUrl" 
      @message="onMessage" 
      @onLoad="onWebLoad" 
      @onError="onWebError"
      :progress="showProgress"
    ></web-view>

    <!-- 加载进度条 -->
    <view class="progress-bar" v-if="showProgress">
      <view class="progress" :style="{ width: progressWidth + '%' }"></view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        webUrl: '',
        pageTitle: '',
        showProgress: false,
        progressWidth: 0,
        progressTimer: null
      };
    },
    onLoad(options) {
      // 从页面参数获取URL
      if (options.url) {
        this.webUrl = decodeURIComponent(options.url);
        // 根据URL设置页面标题
        this.setPageTitleFromUrl();
        // 显示加载进度条
        this.showProgressBar();
      } else {
        // 如果没有URL参数，显示错误信息
        uni.showToast({
          title: '缺少URL参数',
          icon: 'none'
        });
      }
    },
    onUnload() {
      // 清除定时器
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
      }
    },
    methods: {
      // 返回上一页
      back() {
        try {
          uni.navigateBack();
        } catch (error) {
          console.error('返回异常:', error);
        }
      },
      
      // 刷新页面
      refresh() {
        try {
          // 重新加载web-view
          this.showProgressBar();
          // 使用reload方法刷新
          const webview = this.$mp?.page?.selectComponent('#webview');
          if (webview && typeof webview.reload === 'function') {
            webview.reload();
          } else {
            console.error('无法获取web-view组件或没有reload方法');
            // 简单的替代方案：重新设置url
            const tempUrl = this.webUrl;
            this.webUrl = '';
            setTimeout(() => {
              this.webUrl = tempUrl;
            }, 100);
          }
        } catch (error) {
          console.error('刷新页面异常:', error);
          // 失败后隐藏进度条
          setTimeout(() => {
            this.showProgress = false;
          }, 1000);
        }
      },
      
      // 设置页面标题
      setPageTitleFromUrl() {
        // 简单的标题设置逻辑，可以根据实际需求调整
        if (this.webUrl.includes('privacy')) {
          this.pageTitle = '隐私政策';
        } else if (this.webUrl.includes('terms')) {
          this.pageTitle = '用户协议';
        } else {
          this.pageTitle = '网页浏览';
        }
        // 设置顶部导航栏标题
        uni.setNavigationBarTitle({
          title: this.pageTitle
        });
      },
      
      // 显示加载进度条
      showProgressBar() {
        this.showProgress = true;
        this.progressWidth = 0;
        
        // 清除之前的定时器
        if (this.progressTimer) {
          clearInterval(this.progressTimer);
        }
        
        // 模拟加载进度
        this.progressTimer = setInterval(() => {
          this.progressWidth += Math.random() * 20;
          if (this.progressWidth > 90) {
            this.progressWidth = 90; // 进度条最高到90%
          }
        }, 300);
      },
      
      // 网页加载完成
      onWebLoad(e) {
        try {
          console.log('网页加载完成', e);
          // 清除定时器
          if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
          }
          // 进度条完成
          this.progressWidth = 100;
          setTimeout(() => {
            this.showProgress = false;
          }, 500);
        } catch (error) {
          console.error('处理网页加载完成事件异常:', error);
        }
      },
      
      // 网页加载失败
      onWebError(e) {
        try {
          console.error('网页加载失败', e);
          // 清除定时器
          if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
          }
          this.showProgress = false;
          
          uni.showModal({
            title: '加载失败',
            content: '无法加载网页，是否重试？',
            success: (res) => {
              if (res.confirm) {
                this.refresh();
              } else {
                uni.navigateBack();
              }
            }
          });
        } catch (error) {
          console.error('处理网页加载失败事件异常:', error);
        }
      },
      
      // 接收来自网页的消息
      onMessage(e) {
        console.log('收到网页消息', e.detail);
        const message = e.detail.data[0];
        
        // 处理不同类型的消息
        switch (message.type) {
          case 'setTitle':
            this.pageTitle = message.data;
            uni.setNavigationBarTitle({
              title: this.pageTitle
            });
            break;
          case 'navigateBack':
            uni.navigateBack();
            break;
          case 'navigateTo':
            uni.navigateTo({
              url: message.data
            });
            break;
          case 'reload':
            this.refresh();
            break;
        }
      }
    }
  };
</script>

<style scoped>
  .webview-container {
    flex: 1;
    display: flex;
    flex-direction: column;
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
  
  .back-icon,
  .refresh-icon {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-text {
    font-size: 36rpx;
    color: #333333;
  }
  
  .back-icon .icon-text {
    font-size: 48rpx;
    font-weight: bold;
  }
  
  .nav-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333333;
    flex: 1;
    text-align: center;
    margin: 0 30rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .progress-bar {
    position: absolute;
    top: 120rpx;
    left: 0;
    right: 0;
    height: 4rpx;
    background-color: #F0F0F0;
    z-index: 9999;
  }
  
  .progress {
    height: 100%;
    background-color: #A67D4F;
    transition: width 0.3s ease;
  }
</style>