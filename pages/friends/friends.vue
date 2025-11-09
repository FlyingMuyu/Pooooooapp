<template>
  <view class="friends-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <text class="search-icon">🔍</text>
      <input type="text" placeholder="搜索好友..." v-model="searchText" class="search-input">
    </view>
    
    <!-- 好友标签页 -->
    <view class="friends-tabs">
      <text class="friends-tab" :class="{ 'active': friendsTab === 'friends' }" @click="switchTab('friends')">好友</text>
      <text class="friends-tab" :class="{ 'active': friendsTab === 'invite' }" @click="switchTab('invite')">邀请</text>
    </view>
    
    <!-- 好友列表 -->
    <view v-if="friendsTab === 'friends'" class="friends-list">
      <view class="friend-item" v-for="friend in filteredFriends" :key="friend.id">
            <view class="friend-avatar" @click="viewUserProfile(friend.id)">
              <text class="avatar-emoji">{{friend.avatar || '👤'}}</text>
            </view>
        <view class="friend-info">
          <view class="friend-name-row">
            <text class="friend-name" @click="viewUserProfile(friend.id)">{{friend.name}}</text>
            <text class="friend-level">{{friend.level}}</text>
          </view>
          <text class="friend-status" :class="{ 'active': friend.isOnline }">
            {{friend.isOnline ? '活跃' : '最近活跃'}}
          </text>
          <text class="friend-last-time">{{friend.lastRecordTime}}</text>
        </view>
        <button class="compete-btn" @click="competeWith(friend.id)">比拼</button>
        <button class="record-btn" @click="recordFor(friend.id)">记录</button>
      </view>
    </view>
    
    <!-- 邀请页面 -->
    <view v-if="friendsTab === 'invite'" class="invite-view">
      <text class="invite-hint">邀请好友一起记录，增加互动乐趣！</text>
      <button class="invite-btn" @click="shareInvite">分享邀请链接</button>
      <button class="scan-btn" @click="scanQRCode">扫描二维码</button>
      <view class="invite-qrcode">
        <view class="qrcode-placeholder">
          <text class="qrcode-icon">📱</text>
          <text class="qrcode-placeholder-text">二维码位置</text>
        </view>
        <text class="qrcode-tip">扫一扫添加好友</text>
      </view>
    </view>
    
    <!-- 排行榜 -->
    <view class="rank-section">
      <view class="rank-header">
        <text class="rank-title">拉屎之王排行榜</text>
        <text class="rank-more" @click="viewAllRank">查看全部</text>
      </view>
      <view class="rank-list">
        <view class="rank-item" v-for="(user, index) in rankList" :key="user.id">
          <text class="rank-number" :class="{ 'top3': index < 3 }">
            {{index + 1}}
          </text>
          <image :src="user.avatar" class="rank-avatar"></image>
          <text class="rank-name">{{user.name}}</text>
          <text class="rank-level">{{user.level}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
        return {
          searchText: '',
          friendsTab: 'friends',
          friendList: [],
          rankList: [],
          filteredFriends: [] // 用于搜索过滤后的好友列表
        }
      },
    onShow() {
      // 每次页面显示时从本地存储加载数据
      this.loadLocalData()
      this.filterFriends() // 初始化过滤后的好友列表
    },
    methods: {
      // 查看用户中心
      viewUserProfile(uid) {
        uni.navigateTo({
          url: '../userProfile/userProfile?uid=' + uid
        });
      },
      switchTab(tab) {
        this.friendsTab = tab
      },
      competeWith(friendId) {
        uni.navigateTo({
          url: `../competition/competition?friendId=${friendId}`
        })
      },
      recordFor(friendId) {
        // 跳转到记录页面，并带上好友ID参数
        uni.navigateTo({
          url: `../addRecord/addRecord?friendId=${friendId}`
        })
      },
      shareInvite() {
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
      scanQRCode() {
        try {
          uni.scanCode({
            success: res => {
              console.log('扫描结果:', res)
            },
            fail: err => {
              console.error('扫描失败:', err)
              try {
                if (this.$showToast && typeof this.$showToast === 'function') {
                  this.$showToast('扫描失败', 'none')
                } else {
                  uni.showToast({
                    title: '扫描失败',
                    icon: 'none'
                  })
                }
              } catch (e) {
                console.error('显示提示失败:', e)
              }
            }
          })
        } catch (error) {
          console.error('扫描功能出错:', error)
        }
      },
      viewAllRank() {
        console.log('查看全部排行榜')
      },
      
      // 搜索好友
      searchFriends() {
        console.log('搜索好友:', this.searchText)
        this.filterFriends() // 调用过滤方法
      },
      
      // 过滤好友列表
      filterFriends() {
        if (!this.searchText) {
          this.filteredFriends = this.friendList
        } else {
          const searchLower = this.searchText.toLowerCase()
          this.filteredFriends = this.friendList.filter(friend => 
            friend.name.toLowerCase().includes(searchLower)
          )
        }
      },
      
      // 删除好友
      deleteFriend(friendId) {
        console.log('删除好友:', friendId)
        
        // 弹出确认框
        uni.showModal({
          title: '确认删除',
          content: '确定要删除这个好友吗？',
          success: (res) => {
            if (res.confirm) {
              // 过滤掉要删除的好友
              this.friendList = this.friendList.filter(friend => friend.id !== friendId)
              
              // 保存到本地存储
              this.saveLocalData()
              
              // 重新过滤好友列表
              this.filterFriends()
              
              // 显示成功提示
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }
          }
        })
      },
      
      // 从本地存储加载数据
      loadLocalData() {
        try {
          console.log('加载本地好友数据...')
          
          // 统一使用 uni.getStorageSync API
          try {
            // 加载好友列表
            this.friendList = uni.getStorageSync('friendList') || this.getDefaultFriends()
            console.log('好友列表加载成功，共', this.friendList.length, '个好友')
            this.filterFriends() // 加载后过滤好友列表
          } catch (e) {
            console.error('获取好友列表失败:', e)
            this.friendList = this.getDefaultFriends()
            this.filterFriends()
          }
          
          try {
            // 加载排行榜数据
            this.rankList = uni.getStorageSync('rankList') || this.getDefaultRanks()
            console.log('排行榜数据加载成功')
          } catch (e) {
            console.error('获取排行榜失败:', e)
            this.rankList = this.getDefaultRanks()
          }
          
          console.log('数据加载完成')
        } catch (error) {
          console.error('加载本地数据出错:', error)
          // 使用默认数据确保页面正常显示
          this.friendList = this.getDefaultFriends()
          this.rankList = this.getDefaultRanks()
        }
      },
      
      // 保存数据到本地存储
      saveLocalData() {
        try {
          console.log('保存好友数据到本地...')
          
          // 统一使用 uni.setStorageSync API
          try {
            // 保存好友列表
            uni.setStorageSync('friendList', this.friendList)
            console.log('好友列表保存成功')
          } catch (e) {
            console.error('保存好友列表失败:', e)
          }
          
          try {
            // 保存排行榜数据
            uni.setStorageSync('rankList', this.rankList)
            console.log('排行榜数据保存成功')
          } catch (e) {
            console.error('保存排行榜失败:', e)
          }
          
          console.log('数据保存完成')
        } catch (error) {
          console.error('保存本地数据出错:', error)
        }
      },
      
      // 获取默认好友数据
      getDefaultFriends() {
        return [
          {
            id: 1001, // 与userProfile.vue中的模拟数据库ID匹配
            avatar: '👦',
            name: '健康达人',
            level: 'Lv.8',
            isOnline: true,
            lastRecordTime: '上次记录: 10分钟前'
          },
          {
            id: 1002, // 与userProfile.vue中的模拟数据库ID匹配
            avatar: '👧',
            name: '快乐星球',
            level: 'Lv.5',
            isOnline: true,
            lastRecordTime: '上次记录: 30分钟前'
          },
          {
            id: 1003, // 与userProfile.vue中的模拟数据库ID匹配
            avatar: '👨',
            name: '养生专家',
            level: 'Lv.12',
            isOnline: false,
            lastRecordTime: '上次记录: 2小时前'
          },
          {
            id: 4,
            avatar: '👩',
            name: '刘小丽',
            level: 'Lv.2',
            isOnline: false,
            lastRecordTime: '上次记录: 昨天'
          },
          {
            id: 5,
            avatar: '🧔',
            name: '张大爷',
            level: 'Lv.6',
            isOnline: true,
            lastRecordTime: '上次记录: 1小时前'
          },
          {
            id: 6,
            avatar: '👱',
            name: '李小花',
            level: 'Lv.3',
            isOnline: false,
            lastRecordTime: '上次记录: 3天前'
          }
        ]
      },
      
      // 获取默认排行榜数据
      getDefaultRanks() {
        return [
          {
            id: 1,
            avatar: '../../static/avatar.svg',
            name: '李小红',
            level: 'Lv.5'
          },
          {
            id: 2,
            avatar: '../../static/avatar.svg',
            name: '王小明',
            level: 'Lv.5'
          },
          {
            id: 3,
            avatar: '../../static/avatar.svg',
            name: '张大壮',
            level: 'Lv.4'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .friends-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 40rpx;
    padding: 20rpx 30rpx;
    margin-bottom: 30rpx;
  }
  
  .search-icon {
    font-size: 30rpx;
    margin-right: 20rpx;
  }
  
  .search-input {
    flex: 1;
    font-size: 28rpx;
  }
  
  .friends-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 10rpx;
    margin-bottom: 30rpx;
  }
  
  .friends-tab {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    border-radius: 15rpx;
  }
  
  .friends-tab.active {
    background-color: #F0F0F0;
    color: #A67D4F;
  }
  
  .friends-list {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
  }
  
  .friend-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .friend-item:last-child {
    border-bottom: none;
  }
  
  .friend-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    background-color: #F0F0F0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .avatar-emoji {
    font-size: 60rpx;
  }
  
  .friend-info {
    flex: 1;
  }
  
  .friend-name-row {
    display: flex;
    align-items: center;
    margin-bottom: 5rpx;
  }
  
  .friend-name {
    font-size: 30rpx;
    font-weight: bold;
    margin-right: 10rpx;
  }
  
  .friend-level {
    font-size: 24rpx;
    color: #A67D4F;
  }
  
  .friend-status {
    font-size: 24rpx;
    color: #999999;
    margin-bottom: 5rpx;
    display: block;
  }
  
  .friend-status.active {
    color: #52C41A;
  }
  
  .friend-last-time {
    font-size: 24rpx;
    color: #999999;
  }
  
  .compete-btn {
    background-color: #A67D4F;
    color: #FFFFFF;
    font-size: 26rpx;
    padding: 10rpx 20rpx;
    margin-right: 10rpx;
    border-radius: 30rpx;
  }
  
  .record-btn {
    background-color: #FFFFFF;
    color: #666666;
    font-size: 26rpx;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    border: 1rpx solid #E5E5E5;
  }
  
  .invite-view {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 50rpx 30rpx;
    margin-bottom: 30rpx;
    text-align: center;
  }
  
  .invite-hint {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 40rpx;
    display: block;
  }
  
  .invite-btn, .scan-btn {
    width: 80%;
    margin: 0 auto 20rpx;
    border-radius: 44rpx;
  }
  
  .invite-btn {
    background-color: #A67D4F;
    color: #FFFFFF;
  }
  
  .scan-btn {
    background-color: #FFFFFF;
    color: #A67D4F;
    border: 1rpx solid #A67D4F;
  }
  
  .invite-qrcode {
    margin-top: 40rpx;
  }
  
  .qrcode-placeholder {
    width: 300rpx;
    height: 300rpx;
    margin: 0 auto;
    background-color: #F0F0F0;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .qrcode-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  
  .qrcode-placeholder-text {
    font-size: 24rpx;
    color: #999999;
  }
  
  .qrcode-tip {
    font-size: 26rpx;
    color: #999999;
    margin-top: 20rpx;
  }
  
  .rank-section {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }
  
  .rank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .rank-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .rank-more {
    font-size: 28rpx;
    color: #999999;
  }
  
  .rank-list {
    display: flex;
    justify-content: space-around;
  }
  
  .rank-item {
    text-align: center;
  }
  
  .rank-number {
    display: inline-block;
    width: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #F0F0F0;
    border-radius: 50%;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .rank-number.top3 {
    background-color: #FFD700;
    color: #FFFFFF;
  }
  
  .rank-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-bottom: 10rpx;
  }
  
  .rank-name {
    font-size: 28rpx;
    margin-bottom: 5rpx;
  }
  
  .rank-level {
    font-size: 24rpx;
    color: #A67D4F;
  }
</style>