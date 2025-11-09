<template>
  <view class="user-profile-container">
    <!-- 背景图 -->
    <view class="profile-bg">
      <image :src="userInfo.backgroundImage" mode="aspectFill" class="bg-image"></image>
      <view class="bg-overlay"></view>
    </view>
    
    <!-- 返回按钮 -->
    <view class="back-button" @click="goBack">
      <text class="back-icon">‹</text>
    </view>
    
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <!-- 用户头像 -->
      <image :src="userInfo.avatar" class="user-avatar"></image>
      
      <!-- 用户基本信息 -->
      <view class="user-basic-info">
        <text class="user-nickname">{{userInfo.nickname}}</text>
        <text class="user-title">{{userInfo.title}}</text>
        <text class="user-level">等级 {{userInfo.level}}</text>
      </view>
      
      <!-- 用户操作按钮 -->
      <view class="user-actions">
        <button class="action-btn" @click="followUser" v-if="!isFollowing">关注</button>
        <button class="action-btn followed" v-else>已关注</button>
        <button class="action-btn" @click="sendMessage">发消息</button>
      </view>
    </view>
    
    <!-- 健康度区域 -->
    <view class="health-score-section">
      <view class="health-score-circle">
        <text class="score-number">{{userInfo.healthScore}}</text>
        <text class="score-label">健康度</text>
      </view>
      <view class="health-stats">
        <view class="stat-item">
          <text class="stat-value">{{userInfo.streakDays}}</text>
          <text class="stat-label">连续天数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{userInfo.totalBadges}}</text>
          <text class="stat-label">成就徽章</text>
        </view>
      </view>
    </view>
    
    <!-- 数据统计区域 -->
    <view class="data-stats-section">
      <text class="section-title">数据统计</text>
      <view class="stats-grid">
        <view class="data-stat-item">
          <text class="data-stat-value">{{userInfo.totalRecords}}</text>
          <text class="data-stat-label">总记录数</text>
        </view>
        <view class="data-stat-item">
          <text class="data-stat-value">{{userInfo.avgDuration}}</text>
          <text class="data-stat-label">平均时长</text>
        </view>
        <view class="data-stat-item">
          <text class="data-stat-value">{{userInfo.bestStreak}}</text>
          <text class="data-stat-label">最长连续</text>
        </view>
        <view class="data-stat-item">
          <text class="data-stat-value">{{userInfo.completionRate}}</text>
          <text class="data-stat-label">完成率</text>
        </view>
      </view>
    </view>
    
    <!-- 比拼数据区域 -->
    <view class="competition-section">
      <view class="section-header">
        <text class="section-title">比拼数据</text>
        <text class="view-more" @click="viewCompetitionHistory">查看历史</text>
      </view>
      
      <view class="competition-stats">
        <view class="competition-item">
          <text class="competition-label">总比拼场次</text>
          <text class="competition-value">{{userInfo.totalCompetitions}}</text>
        </view>
        <view class="competition-item">
          <text class="competition-label">获胜场次</text>
          <text class="competition-value">{{userInfo.winCompetitions}}</text>
        </view>
        <view class="competition-item">
          <text class="competition-label">胜率</text>
          <text class="competition-value">{{userInfo.winRate}}%</text>
        </view>
      </view>
    </view>
    
    <!-- 最近活动区域 -->
    <view class="recent-activities-section">
      <text class="section-title">最近活动</text>
      <view class="activity-list">
        <view v-for="(activity, index) in userInfo.recentActivities" :key="index" class="activity-item">
          <text class="activity-icon">{{activity.icon}}</text>
          <view class="activity-content">
            <text class="activity-text">{{activity.text}}</text>
            <text class="activity-time">{{activity.time}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {
          uid: '',
          nickname: '',
          avatar: '../../static/avatar.svg',
          backgroundImage: '../../static/home.svg',
          title: '新手用户',
          level: 1,
          healthScore: 85,
          streakDays: 0,
          totalBadges: 0,
          totalRecords: 0,
          avgDuration: 0,
          bestStreak: 0,
          completionRate: 0,
          totalCompetitions: 0,
          winCompetitions: 0,
          winRate: 0,
          recentActivities: []
        },
        isFollowing: false,
        // 模拟用户数据库
        mockUserDatabase: {
          '1001': {
            uid: '1001',
            nickname: '健康达人',
            avatar: '../../static/avatar.svg',
            backgroundImage: '../../static/home_selected.svg',
            title: '排便大师',
            level: 8,
            healthScore: 92,
            streakDays: 45,
            totalBadges: 12,
            totalRecords: 256,
            avgDuration: 12,
            bestStreak: 68,
            completionRate: 95,
            totalCompetitions: 36,
            winCompetitions: 24,
            winRate: 67,
            recentActivities: [
              { icon: '🏆', text: '获得了「百日坚持」成就徽章', time: '2小时前' },
              { icon: '📊', text: '更新了今日排便记录', time: '5小时前' },
              { icon: '👥', text: '发起了一场比拼挑战', time: '昨天' }
            ]
          },
          '1002': {
            uid: '1002',
            nickname: '快乐星球',
            avatar: '../../static/avatar.svg',
            backgroundImage: '../../static/friends_selected.svg',
            title: '健康生活家',
            level: 5,
            healthScore: 85,
            streakDays: 12,
            totalBadges: 6,
            totalRecords: 134,
            avgDuration: 15,
            bestStreak: 23,
            completionRate: 88,
            totalCompetitions: 23,
            winCompetitions: 11,
            winRate: 48,
            recentActivities: [
              { icon: '📈', text: '查看了本周数据分析', time: '1小时前' },
              { icon: '💬', text: '评论了好友的记录', time: '昨天' },
              { icon: '🏆', text: '获得了「周计划完成」徽章', time: '3天前' }
            ]
          },
          '1003': {
            uid: '1003',
            nickname: '养生专家',
            avatar: '../../static/avatar.svg',
            backgroundImage: '../../static/record_selected.svg',
            title: '肠道健康顾问',
            level: 12,
            healthScore: 96,
            streakDays: 120,
            totalBadges: 21,
            totalRecords: 589,
            avgDuration: 10,
            bestStreak: 120,
            completionRate: 99,
            totalCompetitions: 78,
            winCompetitions: 65,
            winRate: 83,
            recentActivities: [
              { icon: '🌟', text: '等级提升到12级', time: '30分钟前' },
              { icon: '📊', text: '连续120天记录', time: '今天' },
              { icon: '👥', text: '接受了3个比拼挑战', time: '昨天' }
            ]
          }
        }
      }
    },
    onLoad(options) {
      try {
        console.log('用户中心页面加载，用户ID:', options.uid);
        // 从URL参数获取用户ID
        const uid = options.uid || '1001'; // 默认显示第一个用户的信息
        
        if (uid) {
          this.loadUserData(uid);
        } else {
          console.error('未提供用户ID');
          this.showError('用户信息加载失败');
        }
      } catch (error) {
        console.error('页面加载异常:', error);
        this.showError('页面加载失败');
      }
    },
    methods: {
      // 加载用户数据
      loadUserData(uid) {
        try {
          console.log('尝试加载用户ID:', uid, '的数据');
          
          // 1. 首先尝试使用模拟数据库
          let userData = this.mockUserDatabase[uid];
          
          // 2. 如果模拟数据库没有，使用默认数据
          if (!userData) {
            console.log('模拟数据库中未找到用户，使用默认数据');
            userData = {
              uid: uid,
              nickname: '未知用户',
              avatar: '../../static/avatar.svg',
              backgroundImage: '../../static/home.svg',
              title: '新用户',
              level: 1,
              healthScore: 70,
              streakDays: 0,
              totalBadges: 0,
              totalRecords: 0,
              avgDuration: 0,
              bestStreak: 0,
              completionRate: 0,
              totalCompetitions: 0,
              winCompetitions: 0,
              winRate: 0,
              recentActivities: [
                { icon: '👤', text: '刚刚加入一起拉屎', time: '未知时间' }
              ]
            };
          }
          
          // 3. 设置用户信息（深拷贝确保数据隔离）
          this.userInfo = JSON.parse(JSON.stringify(userData));
          console.log('用户数据加载成功:', this.userInfo);
          
          // 检查是否已关注
          this.checkFollowStatus(uid);
          
        } catch (error) {
          console.error('加载用户数据失败:', error);
          this.showError('用户数据加载失败');
        }
      },
      
      // 检查关注状态
      checkFollowStatus(uid) {
        try {
          // 这里应该从本地存储或服务器检查关注状态
          // 现在只是模拟
          const followingList = uni.getStorageSync('followingList') || [];
          this.isFollowing = followingList.includes(uid);
        } catch (error) {
          console.error('检查关注状态失败:', error);
        }
      },
      
      // 关注/取消关注用户
      followUser() {
        try {
          let followingList = uni.getStorageSync('followingList') || [];
          
          if (this.isFollowing) {
            // 取消关注
            followingList = followingList.filter(id => id !== this.userInfo.uid);
          } else {
            // 关注用户
            followingList.push(this.userInfo.uid);
          }
          
          // 保存关注列表
          uni.setStorageSync('followingList', followingList);
          
          // 更新状态
          this.isFollowing = !this.isFollowing;
          
          // 显示提示
          uni.showToast({
            title: this.isFollowing ? '关注成功' : '已取消关注',
            icon: 'success'
          });
          
        } catch (error) {
          console.error('关注/取消关注失败:', error);
          uni.showToast({
            title: '操作失败',
            icon: 'error'
          });
        }
      },
      
      // 发送消息
      sendMessage() {
        uni.showToast({
          title: '消息功能开发中',
          icon: 'none'
        });
      },
      
      // 查看比拼历史
      viewCompetitionHistory() {
        uni.navigateTo({
          url: '../competition/competition?uid=' + this.userInfo.uid
        });
      },
      
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      
      // 显示错误提示
      showError(message) {
        uni.showToast({
          title: message,
          icon: 'error'
        });
      }
    }
  }
</script>

<style scoped>
  .user-profile-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  /* 背景图 */
  .profile-bg {
    position: relative;
    width: 100%;
    height: 200rpx;
    overflow: hidden;
  }
  
  .bg-image {
    width: 100%;
    height: 100%;
  }
  
  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  
  /* 返回按钮 */
  .back-button {
    position: absolute;
    top: 60rpx;
    left: 30rpx;
    width: 60rpx;
    height: 60rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  
  .back-icon {
    color: #fff;
    font-size: 44rpx;
  }
  
  /* 用户信息区域 */
  .user-info-section {
    position: relative;
    padding: 0 30rpx;
    padding-top: 80rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    padding-bottom: 30rpx;
  }
  
  .user-avatar {
    position: absolute;
    top: -80rpx;
    left: 60rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    border: 6rpx solid #fff;
    background-color: #fff;
  }
  
  .user-basic-info {
    margin-left: 220rpx;
    padding-bottom: 20rpx;
  }
  
  .user-nickname {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
  }
  
  .user-title {
    font-size: 28rpx;
    color: #666;
    margin-top: 10rpx;
    display: block;
  }
  
  .user-level {
    font-size: 24rpx;
    color: #999;
    margin-top: 5rpx;
    display: block;
  }
  
  .user-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20rpx;
  }
  
  .action-btn {
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 28rpx;
    border-radius: 30rpx;
    margin-left: 20rpx;
    background-color: #007aff;
    color: #fff;
    border: none;
  }
  
  .action-btn.followed {
    background-color: #e0e0e0;
    color: #666;
  }
  
  /* 健康度区域 */
  .health-score-section {
    display: flex;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  
  .health-score-circle {
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    background-color: #f0f9ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .score-number {
    font-size: 48rpx;
    font-weight: bold;
    color: #007aff;
  }
  
  .score-label {
    font-size: 28rpx;
    color: #666;
    margin-top: 10rpx;
  }
  
  .health-stats {
    display: flex;
    margin-left: 40rpx;
    flex: 1;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
  }
  
  .stat-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .stat-label {
    font-size: 28rpx;
    color: #666;
    margin-top: 10rpx;
  }
  
  .stat-divider {
    width: 2rpx;
    background-color: #e0e0e0;
    margin: 0 30rpx;
  }
  
  /* 数据统计区域 */
  .data-stats-section {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;
  }
  
  .data-stat-item {
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 10rpx;
    text-align: center;
  }
  
  .data-stat-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #007aff;
  }
  
  .data-stat-label {
    font-size: 28rpx;
    color: #666;
    margin-top: 10rpx;
  }
  
  /* 比拼数据区域 */
  .competition-section {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .view-more {
    font-size: 28rpx;
    color: #007aff;
  }
  
  .competition-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }
  
  .competition-item {
    text-align: center;
    padding: 20rpx;
    background-color: #f0f9ff;
    border-radius: 10rpx;
  }
  
  .competition-label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .competition-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #007aff;
  }
  
  /* 最近活动区域 */
  .recent-activities-section {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 100rpx;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  
  .activity-item {
    display: flex;
    align-items: flex-start;
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 10rpx;
  }
  
  .activity-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-text {
    font-size: 28rpx;
    color: #333;
  }
  
  .activity-time {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    display: block;
  }
</style>