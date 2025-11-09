<template>
  <view class="index-container">
    <!-- 顶部占位 -->
    <view class="top-placeholder"></view>
    
    <!-- 今日健康提示 -->
    <view class="health-tip">
      <view class="tip-header">
        <text class="tip-icon">💖</text>
        <text class="tip-title">今日健康提示</text>
      </view>
      <text class="tip-content">规律排便有助于维持肠道健康，建议每天固定时间排便，并保持充分的水分摄入。</text>
      <text class="tip-source">来源: 健康研究院</text>
      <text class="tip-more" @click="viewMore">查看详情 →</text>
    </view>
    
    <!-- 今日状态 -->
    <view class="today-status">
      <view class="status-header">
        <text class="status-icon">📅</text>
        <text class="status-title">今日状态</text>
      </view>
      <view class="status-content">
        <text class="status-label">今日拉屎次数</text>
        <text class="status-value">{{todayCount}}次</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{width: progressWidth + '%'}"></view>
        </view>
        <text class="status-hint">健康标准: 1-3次/天</text>
      </view>
      <view class="action-buttons">
        <button class="record-btn" @click="goToAddRecord">+ 记录</button>
        <button class="share-btn" @click="share">分享</button>
      </view>
    </view>
    
    <!-- 本地记录统计 -->
    <view class="friends-dynamic">
      <view class="dynamic-header">
        <text class="dynamic-title">本地记录统计</text>
        <text class="dynamic-more" @click="goToHistory">查看历史</text>
      </view>
      <view class="stats-container">
        <view class="stat-item">
          <text class="stat-number">{{totalRecords}}</text>
          <text class="stat-label">总记录数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-number">{{weekRecords}}</text>
          <text class="stat-label">本周记录</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-number">{{bestStreak}}</text>
          <text class="stat-label">最长连续</text>
        </view>
      </view>
      <text class="mode-text">* 所有数据安全存储在本地设备</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        todayCount: 0,
        progressWidth: 0,
        totalRecords: 0,
        weekRecords: 0,
        bestStreak: 0
      }
    },
    onShow() {
      // 首先检查登录状态
      if (!this.checkLoginStatus()) {
        // 如果未登录，跳转到登录页面
        uni.navigateTo({
          url: '../login/login'
        });
        return;
      }
      
      // 已登录状态下更新数据
      this.updateLocalData()
    },
    methods: {
      // 检查登录状态
      checkLoginStatus() {
        try {
          console.log('检查登录状态...');
          let userInfo = null;
          
          // 尝试使用 $localStorage 获取用户信息
          if (this.$localStorage) {
            userInfo = this.$localStorage.get('userInfo');
          }
          
          // 如果 $localStorage 不可用，使用 uni.getStorageSync
          if (!userInfo) {
            userInfo = uni.getStorageSync('userInfo');
          }
          
          // 验证用户是否已登录
          const isLoggedIn = userInfo && userInfo.isLogin === true;
          console.log('登录状态:', isLoggedIn ? '已登录' : '未登录');
          return isLoggedIn;
        } catch (error) {
          console.error('检查登录状态失败:', error);
          return false;
        }
      },
      viewMore() {
        // 可以导航到健康知识页面
        console.log('查看健康详情')
      },
      goToAddRecord() {
        uni.navigateTo({
          url: '../addRecord/addRecord'
        })
      },
      share() {
        try {
          if (this.$showToast && typeof this.$showToast === 'function') {
            this.$showToast('分享功能开发中', 'none')
          } else {
            // 使用原生API作为备用
            uni.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('显示提示失败:', error)
        }
      },
      goToHistory() {
        uni.navigateTo({
          url: '../history/history'
        })
      },
      
      // 更新本地数据统计
      updateLocalData() {
        try {
          console.log('更新本地数据统计...')
          let records = []
          
          // 统一使用 uni.getStorageSync API，与其他页面保持一致
          try {
            records = uni.getStorageSync('stoolRecords') || []
            console.log('从本地存储获取记录成功，共', records.length, '条')
          } catch (e) {
            console.error('获取本地存储失败:', e)
            records = []
          }
          
          console.log('获取到的记录数:', records.length)
          const today = new Date().toISOString().split('T')[0]
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          
          // 计算今日次数
          this.todayCount = records.filter(record => record.date === today).length
          console.log('今日次数:', this.todayCount)
          
          // 计算进度条宽度
          this.progressWidth = Math.min((this.todayCount / 3) * 100, 100)
          
          // 计算总记录数
          this.totalRecords = records.length
          
          // 计算本周记录数
          this.weekRecords = records.filter(record => {
            const recordDate = new Date(record.date)
            return recordDate >= weekAgo
          }).length
          
          // 计算最长连续天数（简化版）
          this.calculateStreak(records)
        } catch (error) {
          console.error('更新本地数据统计时出错:', error)
          // 确保数据保持在有效状态
          this.todayCount = 0
          this.progressWidth = 0
          this.totalRecords = 0
          this.weekRecords = 0
          this.bestStreak = 0
        }
      },
      
      // 计算连续天数
      calculateStreak(records) {
        if (!records.length) {
          this.bestStreak = 0
          return
        }
        
        // 按日期分组并排序
        const dateSet = new Set(records.map(r => r.date))
        const sortedDates = Array.from(dateSet).sort().reverse()
        
        let currentStreak = 1
        let maxStreak = 1
        
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i-1])
          const currDate = new Date(sortedDates[i])
          const dayDiff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
          
          if (dayDiff === 1) {
            currentStreak++
            maxStreak = Math.max(maxStreak, currentStreak)
          } else {
            currentStreak = 1
          }
        }
        
        this.bestStreak = maxStreak
      }
    }
  }
</script>

<style scoped>
  .index-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .top-placeholder {
    height: 20rpx;
    margin-bottom: 20rpx;
  }
  
  .health-tip {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .tip-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .tip-icon {
    font-size: 36rpx;
    margin-right: 10rpx;
  }
  
  .tip-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .tip-content {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
    line-height: 44rpx;
  }
  
  .tip-source {
    font-size: 24rpx;
    color: #999999;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .tip-more {
    font-size: 28rpx;
    color: #A67D4F;
    float: right;
  }
  
  .today-status {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .status-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .status-icon {
    font-size: 36rpx;
    margin-right: 10rpx;
  }
  
  .status-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .status-content {
    text-align: center;
    margin-bottom: 30rpx;
  }
  
  .status-label {
    font-size: 28rpx;
    color: #666666;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .status-value {
    font-size: 60rpx;
    color: #A67D4F;
    font-weight: bold;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .progress-bar {
    width: 80%;
    height: 20rpx;
    background-color: #F0F0F0;
    border-radius: 10rpx;
    margin: 0 auto 10rpx;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #A67D4F;
  }
  
  .status-hint {
    font-size: 24rpx;
    color: #999999;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .record-btn {
    flex: 1;
    background-color: #A67D4F;
    color: #FFFFFF;
    margin-right: 20rpx;
    border-radius: 44rpx;
  }
  
  .share-btn {
    flex: 1;
    background-color: #FFFFFF;
    color: #A67D4F;
    border: 1rpx solid #A67D4F;
    border-radius: 44rpx;
  }
  
  .friends-dynamic {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
  }
  
  .dynamic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .dynamic-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .dynamic-more {
    font-size: 28rpx;
    color: #999999;
  }
  
  .stats-container {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
  }
  
  .stat-item {
    text-align: center;
    flex: 1;
  }
  
  .stat-number {
    font-size: 48rpx;
    font-weight: bold;
    color: #A67D4F;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .stat-label {
    font-size: 24rpx;
    color: #666666;
  }
  
  .stat-divider {
    width: 1rpx;
    background-color: #F0F0F0;
    margin: 0 20rpx;
  }
  
  .mode-text {
    font-size: 24rpx;
    color: #999999;
    text-align: center;
    margin-top: 20rpx;
    padding-top: 10rpx;
    border-top: 1rpx solid #F0F0F0;
  }
  
  .dynamic-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .dynamic-item:last-child {
    border-bottom: none;
  }
  
  .friend-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    float: left;
    margin-right: 20rpx;
  }
  
  .friend-info {
    overflow: hidden;
  }
  
  .friend-name {
    font-size: 30rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 5rpx;
  }
  
  .friend-time {
    font-size: 24rpx;
    color: #999999;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .friend-content {
    font-size: 28rpx;
    color: #666666;
    line-height: 40rpx;
  }
  
  .interaction {
    margin-top: 15rpx;
  }
  
  .interaction-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 5rpx;
  }
  
  .interaction-text {
    font-size: 24rpx;
    color: #999999;
    margin-right: 20rpx;
  }
</style>
