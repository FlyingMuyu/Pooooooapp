<template>
  <view class="competition-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="back-button" @tap="navigateBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="page-title">拉屎比拼</text>
      <view class="header-placeholder"></view>
    </view>
    
    <!-- 对战用户信息 -->
    <view class="vs-section">
      <!-- 我的信息 -->
      <view class="user-info">
        <view class="avatar-container">
          <image class="avatar" :src="'/static/avatar.svg'" mode="aspectFit"></image>
        </view>
        <text class="user-name">{{ myInfo.name }}</text>
        <text class="user-level">Lv.{{ myInfo.level }}</text>
      </view>
      
      <!-- VS标识和周期信息 -->
      <view class="vs-info">
        <text class="vs-text">VS</text>
        <text class="period-info">本期比拼</text>
        <text class="day-count">第{{ currentDay }}天</text>
      </view>
      
      <!-- 对手信息 -->
      <view class="user-info">
        <view class="avatar-container">
          <image class="avatar" :src="'/static/avatar.svg'" mode="aspectFit"></image>
        </view>
        <text class="user-name">{{ opponentInfo.name }}</text>
        <text class="user-level">Lv.{{ opponentInfo.level }}</text>
      </view>
    </view>
    
    <!-- 比拼项目 -->
    <view class="competition-items">
      <!-- 拉屎次数 -->
      <view class="item-card">
        <view class="item-header">
          <text class="item-title">拉屎次数</text>
          <text class="item-score">{{ myInfo.stoolCount }} vs {{ opponentInfo.stoolCount }}</text>
        </view>
        <view class="progress-container">
          <view class="progress-bar">
            <view class="my-progress" :style="{ width: `${myInfo.stoolCountPercent}%` }"></view>
            <view class="opponent-progress" :style="{ width: `${opponentInfo.stoolCountPercent}%` }"></view>
          </view>
        </view>
      </view>
      
      <!-- 规律性 -->
      <view class="item-card">
        <view class="item-header">
          <text class="item-title">规律性</text>
          <text class="item-score">{{ myInfo.regularityScore }}% vs {{ opponentInfo.regularityScore }}%</text>
        </view>
        <view class="progress-container">
          <view class="progress-bar">
            <view class="my-progress" :style="{ width: `${myInfo.regularityScore}%` }"></view>
            <view class="opponent-progress" :style="{ width: `${opponentInfo.regularityScore}%` }"></view>
          </view>
        </view>
      </view>
      
      <!-- 健康评分 -->
      <view class="item-card">
        <view class="item-header">
          <text class="item-title">健康评分</text>
          <text class="item-score">{{ myInfo.healthScore }} vs {{ opponentInfo.healthScore }}</text>
        </view>
        <view class="progress-container">
          <view class="progress-bar">
            <view class="my-progress" :style="{ width: `${myInfo.healthScore}%` }"></view>
            <view class="opponent-progress" :style="{ width: `${opponentInfo.healthScore}%` }"></view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 本周比拼记录 -->
    <view class="weekly-records">
      <view class="records-header">
        <text class="records-title">本周比拼记录</text>
        <text class="records-subtitle">周一至周日</text>
      </view>
      
      <!-- 星期标题 -->
      <view class="weekdays">
        <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
      </view>
      
      <!-- 我的记录 -->
      <view class="record-row">
        <text class="record-label">我的记录</text>
        <view class="record-dots">
          <view class="record-dot" v-for="(count, index) in myInfo.dailyRecords" :key="index" :class="{ 'has-record': count > 0 }">
            <text class="dot-count">{{ count }}</text>
          </view>
        </view>
      </view>
      
      <!-- 对手记录 -->
      <view class="record-row">
        <text class="record-label">{{ opponentInfo.name }}的记录</text>
        <view class="record-dots">
          <view class="record-dot" v-for="(count, index) in opponentInfo.dailyRecords" :key="index" :class="{ 'has-record': count > 0 }">
            <text class="dot-count">{{ count }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 邀请好友按钮 -->
    <view class="action-section">
      <button class="invite-button" @tap="inviteFriend">
        <text class="invite-icon">+</text>
        <text class="invite-text">邀请更多好友</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 我的信息
      myInfo: {
        name: '我',
        level: 5,
        stoolCount: 5,
        regularityScore: 68,
        healthScore: 88,
        stoolCountPercent: 62.5,
        dailyRecords: [2, 1, 2, 0, 0, 0, 0]
      },
      // 对手信息
      opponentInfo: {
        name: '王小明',
        level: 4,
        stoolCount: 3,
        regularityScore: 85,
        healthScore: 76,
        stoolCountPercent: 37.5,
        dailyRecords: [1, 1, 1, 0, 0, 0, 0]
      },
      // 当前天数
      currentDay: 3,
      // 星期数组
      weekdays: ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  
  onLoad(options) {
    // 可以通过options接收对手ID等参数
    if (options && options.opponentId) {
      this.loadOpponentData(options.opponentId);
    } else {
      // 使用默认模拟数据
      this.calculatePercentages();
    }
  },
  
  methods: {
    // 返回上一页
    navigateBack() {
      if (typeof uni !== 'undefined' && uni.navigateBack) {
        uni.navigateBack();
      } else {
        console.log('返回功能不可用');
      }
    },
    
    // 计算百分比
    calculatePercentages() {
      const totalCount = this.myInfo.stoolCount + this.opponentInfo.stoolCount;
      if (totalCount > 0) {
        this.myInfo.stoolCountPercent = Math.round((this.myInfo.stoolCount / totalCount) * 100);
        this.opponentInfo.stoolCountPercent = Math.round((this.opponentInfo.stoolCount / totalCount) * 100);
      }
    },
    
    // 加载对手数据
    loadOpponentData(opponentId) {
      // 这里应该是异步加载数据的逻辑
      // 暂时使用模拟数据
      console.log('加载对手ID:', opponentId);
      this.calculatePercentages();
    },
    
    // 邀请好友
    inviteFriend() {
      if (typeof uni !== 'undefined' && uni.scanCode) {
        uni.scanCode({
          success: (res) => {
            console.log('扫描结果:', res);
            uni.showToast({
              title: '邀请功能开发中',
              icon: 'none'
            });
          },
          fail: () => {
            uni.showToast({
              title: '扫描失败',
              icon: 'none'
            });
          }
        });
      } else {
        console.log('扫码功能不可用');
      }
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.competition-container {
  padding: 0;
  background-color: #fafafa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
}

.back-button, .more-button, .header-placeholder {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon, .more-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: bold;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

/* 对战用户信息 */
.vs-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.avatar-container {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  border: 2rpx solid #e0e0e0;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.user-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 5rpx;
}

.user-level {
  font-size: 24rpx;
  color: #a67d4f;
}

.vs-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20rpx;
}

.vs-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #a67d4f;
  margin-bottom: 10rpx;
}

.period-info {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.day-count {
  font-size: 24rpx;
  color: #a67d4f;
}

/* 比拼项目 */
.competition-items {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.item-card {
  background-color: #ffffff;
  border-radius: 15rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.item-score {
  font-size: 28rpx;
  color: #a67d4f;
  font-weight: bold;
}

.progress-container {
  width: 100%;
  height: 30rpx;
}

.progress-bar {
  width: 100%;
  height: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  overflow: hidden;
  display: flex;
  position: relative;
}

.my-progress {
  height: 100%;
  background-color: #ff6b6b;
  position: relative;
  z-index: 2;
}

.opponent-progress {
  height: 100%;
  background-color: #4ecdc4;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

/* 本周比拼记录 */
.weekly-records {
  background-color: #ffffff;
  border-radius: 15rpx;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.records-header {
  margin-bottom: 30rpx;
}

.records-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 5rpx;
  display: block;
}

.records-subtitle {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.weekdays {
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.weekday {
  font-size: 24rpx;
  color: #666;
  width: 60rpx;
  text-align: center;
}

.record-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.record-label {
  font-size: 28rpx;
  color: #333;
  width: 140rpx;
}

.record-dots {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
}

.record-dot {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.record-dot.has-record {
  background-color: #a67d4f;
}

.dot-count {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
}

/* 邀请按钮 */
.action-section {
  padding: 0 30rpx 40rpx;
}

.invite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #a67d4f;
  color: #ffffff;
  border: none;
  border-radius: 15rpx;
  padding: 30rpx;
  width: 100%;
  font-size: 32rpx;
  font-weight: bold;
}

.invite-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
}

.invite-text {
  font-size: 32rpx;
}
</style>