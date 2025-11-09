<template>
  <view class="badges-container">
    <view class="page-header">
      <view class="back-button" @click="navigateBack">
        <image src="../../static/back.svg" class="back-icon"></image>
      </view>
      <text class="page-title">成就徽章</text>
      <view class="empty-space"></view>
    </view>
    
    <!-- 成就统计 -->
    <view class="badges-stats">
      <view class="stat-item">
        <text class="stat-number">{{ earnedCount }}</text>
        <text class="stat-label">已获得</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-number">{{ totalCount }}</text>
        <text class="stat-label">总数量</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-number">{{ progressPercentage }}%</text>
        <text class="stat-label">完成度</text>
      </view>
    </view>
    
    <!-- 徽章分类 -->
    <view class="badge-tabs">
      <view class="tab" :class="{ active: selectedTab === 'all' }" @click="selectTab('all')">
        全部
      </view>
      <view class="tab" :class="{ active: selectedTab === 'earned' }" @click="selectTab('earned')">
        已获得
      </view>
      <view class="tab" :class="{ active: selectedTab === 'locked' }" @click="selectTab('locked')">
        未获得
      </view>
    </view>
    
    <!-- 徽章列表 -->
    <view class="badges-grid">
      <view v-for="badge in filteredBadges" :key="badge.id" class="badge-item" :class="{ 
        'earned': badge.earned, 
        'locked': !badge.earned 
      }" @click="showBadgeDetail(badge)">
        <view class="badge-icon" :class="{'grayscale': !badge.earned}">
          <image :src="badge.icon" mode="aspectFit" class="badge-image"></image>
        </view>
        <view class="badge-info">
          <text class="badge-name">{{ badge.name }}</text>
          <text class="badge-description">{{ badge.description }}</text>
          <view v-if="badge.earned" class="badge-date">
            获得于 {{ badge.earnedDate }}
          </view>
          <view v-else class="badge-progress">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: badge.progress + '%' }"></view>
            </view>
            <text class="progress-text">{{ badge.progressText }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 徽章详情弹窗 -->
    <view v-if="showDetail" class="detail-modal" @click="closeDetail">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedBadge.name }}</text>
          <view class="close-button" @click="closeDetail">×</view>
        </view>
        <view class="modal-body">
          <view class="detail-badge-icon">
            <image :src="selectedBadge.icon" mode="aspectFit" class="detail-badge-image"></image>
          </view>
          <text class="detail-description">{{ selectedBadge.longDescription }}</text>
          <view v-if="selectedBadge.earned" class="detail-earned">
            <text class="earned-label">获得时间：</text>
            <text class="earned-date">{{ selectedBadge.earnedDate }}</text>
          </view>
          <view v-else class="detail-progress">
            <text class="progress-label">完成进度：</text>
            <view class="detail-progress-bar">
              <view class="detail-progress-fill" :style="{ width: selectedBadge.progress + '%' }"></view>
            </view>
            <text class="detail-progress-text">{{ selectedBadge.progress }}%</text>
            <text class="next-step">{{ selectedBadge.nextStep }}</text>
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
        selectedTab: 'all',
        earnedCount: 0,
        totalCount: 0,
        progressPercentage: 0,
        showDetail: false,
        selectedBadge: null,
        badges: [],
        records: []
      }
    },
    onLoad() {
      this.loadBadgesData()
    },
    onShow() {
      // 每次显示页面时重新加载数据，确保成就进度是最新的
      this.loadBadgesData()
    },
    computed: {
      filteredBadges() {
        if (this.selectedTab === 'all') {
          return this.badges
        } else if (this.selectedTab === 'earned') {
          return this.badges.filter(badge => badge.earned)
        } else if (this.selectedTab === 'locked') {
          return this.badges.filter(badge => !badge.earned)
        }
        return this.badges
      }
    },
    methods: {
      // 从本地存储加载徽章数据和记录数据
      loadBadgesData() {
        try {
          // 加载记录数据
          this.records = uni.getStorageSync('stoolRecords') || []
          
          // 加载徽章数据
          let achievements = uni.getStorageSync('achievements') || []
          
          // 初始化徽章模板
          const badgeTemplates = this.getBadgeTemplates()
          
          // 合并徽章模板和已保存的成就数据
          this.badges = badgeTemplates.map(template => {
            const savedBadge = achievements.find(a => a.id === template.id)
            return savedBadge ? {
              ...template,
              ...savedBadge
            } : template
          })
          
          // 计算成就进度
          this.calculateBadgeProgress()
          
          // 更新统计信息
          this.updateStats()
        } catch (error) {
          console.error('加载徽章数据失败:', error)
          // 出错时使用默认模板
          this.badges = this.getBadgeTemplates()
        }
      },
      
      // 保存徽章数据到本地存储
      saveBadgesData() {
        try {
          uni.setStorageSync('achievements', this.badges)
        } catch (error) {
          console.error('保存徽章数据失败:', error)
        }
      },
      
      // 获取徽章模板
      getBadgeTemplates() {
        return [
          {
            id: 1,
            name: '初次记录',
            description: '完成第一次排便记录',
            longDescription: '恭喜你完成了第一次排便记录！这是养成健康习惯的第一步，继续保持！',
            icon: '../../static/badge_first.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '完成第一次记录即可获得'
          },
          {
            id: 2,
            name: '连续一周',
            description: '连续7天记录排便',
            longDescription: '坚持就是胜利！连续一周记录你的排便情况，这有助于更好地了解你的健康状况。',
            icon: '../../static/badge_week.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续7天记录排便'
          },
          {
            id: 3,
            name: '规律达人',
            description: '连续30天保持规律排便',
            longDescription: '你已经成为规律达人！连续30天保持规律的排便习惯对肠道健康非常有益。',
            icon: '../../static/badge_month.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续30天记录排便'
          },
          {
            id: 4,
            name: '舒适之王',
            description: '连续10次记录舒适状态',
            longDescription: '舒适的排便体验是肠道健康的重要指标，继续保持良好的饮食习惯！',
            icon: '../../static/badge_comfort.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续10次记录舒适状态'
          },
          {
            id: 5,
            name: '健康卫士',
            description: '连续3次记录时长在5-10分钟',
            longDescription: '健康的排便时长通常在5-10分钟之间，继续保持这种良好的节奏。',
            icon: '../../static/badge_healthy.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续3次记录时长在5-10分钟'
          },
          {
            id: 6,
            name: '早起鸟',
            description: '连续5天在早晨完成排便',
            longDescription: '早晨排便有助于清除肠道毒素，是非常健康的生活习惯！',
            icon: '../../static/badge_morning.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续5天在早晨完成排便'
          },
          {
            id: 7,
            name: '百日坚持',
            description: '连续100天记录排便',
            longDescription: '这是一个了不起的成就！连续100天的坚持展示了你强大的意志力和健康意识。',
            icon: '../../static/badge_100days.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要连续100天记录排便'
          },
          {
            id: 8,
            name: '分析大师',
            description: '查看数据分析页面10次',
            longDescription: '你已经成为数据分析大师！通过定期查看数据分析，你能更好地了解自己的健康状况。',
            icon: '../../static/badge_analysis.svg',
            earned: false,
            earnedDate: '',
            progress: 0,
            progressText: '未开始',
            nextStep: '需要查看数据分析页面10次'
          }
        ]
      },
      
      // 计算徽章进度
      calculateBadgeProgress() {
        const records = this.records || []
        
        // 初次记录徽章
        const firstRecordBadge = this.badges.find(b => b.id === 1)
        if (firstRecordBadge && records.length > 0) {
          firstRecordBadge.earned = true
          firstRecordBadge.progress = 100
          firstRecordBadge.progressText = '已完成'
          firstRecordBadge.nextStep = ''
          firstRecordBadge.earnedDate = this.formatDate(records[0].createTime)
        }
        
        // 连续记录天数徽章
        const consecutiveDays = this.calculateConsecutiveDays()
        
        // 连续一周徽章
        const weekBadge = this.badges.find(b => b.id === 2)
        if (weekBadge) {
          weekBadge.progress = Math.min(100, (consecutiveDays / 7) * 100)
          weekBadge.progressText = `已坚持${consecutiveDays}天`
          if (consecutiveDays >= 7 && !weekBadge.earned) {
            weekBadge.earned = true
            weekBadge.progress = 100
            weekBadge.progressText = '已完成'
            weekBadge.nextStep = ''
            weekBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveDays < 7) {
            weekBadge.nextStep = `还需坚持${7 - consecutiveDays}天`
          }
        }
        
        // 规律达人徽章（30天）
        const monthBadge = this.badges.find(b => b.id === 3)
        if (monthBadge) {
          monthBadge.progress = Math.min(100, (consecutiveDays / 30) * 100)
          monthBadge.progressText = `已坚持${consecutiveDays}天`
          if (consecutiveDays >= 30 && !monthBadge.earned) {
            monthBadge.earned = true
            monthBadge.progress = 100
            monthBadge.progressText = '已完成'
            monthBadge.nextStep = ''
            monthBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveDays < 30) {
            monthBadge.nextStep = `还需坚持${30 - consecutiveDays}天`
          }
        }
        
        // 百日坚持徽章
        const hundredDaysBadge = this.badges.find(b => b.id === 7)
        if (hundredDaysBadge) {
          hundredDaysBadge.progress = Math.min(100, (consecutiveDays / 100) * 100)
          hundredDaysBadge.progressText = `已坚持${consecutiveDays}天`
          if (consecutiveDays >= 100 && !hundredDaysBadge.earned) {
            hundredDaysBadge.earned = true
            hundredDaysBadge.progress = 100
            hundredDaysBadge.progressText = '已完成'
            hundredDaysBadge.nextStep = ''
            hundredDaysBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveDays < 100) {
            hundredDaysBadge.nextStep = `还需坚持${100 - consecutiveDays}天`
          }
        }
        
        // 舒适之王徽章
        const comfortBadge = this.badges.find(b => b.id === 4)
        if (comfortBadge) {
          const comfortRecords = records.filter(r => r.feeling === '舒适')
          const consecutiveComfort = this.calculateConsecutiveFeeling(records, '舒适')
          comfortBadge.progress = Math.min(100, (consecutiveComfort / 10) * 100)
          comfortBadge.progressText = `已连续${consecutiveComfort}次舒适`
          if (consecutiveComfort >= 10 && !comfortBadge.earned) {
            comfortBadge.earned = true
            comfortBadge.progress = 100
            comfortBadge.progressText = '已完成'
            comfortBadge.nextStep = ''
            comfortBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveComfort < 10) {
            comfortBadge.nextStep = `还需连续${10 - consecutiveComfort}次舒适`
          }
        }
        
        // 健康卫士徽章
        const healthyBadge = this.badges.find(b => b.id === 5)
        if (healthyBadge) {
          const consecutiveHealthy = this.calculateConsecutiveDuration(records)
          healthyBadge.progress = Math.min(100, (consecutiveHealthy / 3) * 100)
          healthyBadge.progressText = `已连续${consecutiveHealthy}次健康时长`
          if (consecutiveHealthy >= 3 && !healthyBadge.earned) {
            healthyBadge.earned = true
            healthyBadge.progress = 100
            healthyBadge.progressText = '已完成'
            healthyBadge.nextStep = ''
            healthyBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveHealthy < 3) {
            healthyBadge.nextStep = `还需连续${3 - consecutiveHealthy}次健康时长`
          }
        }
        
        // 早起鸟徽章
        const morningBadge = this.badges.find(b => b.id === 6)
        if (morningBadge) {
          const consecutiveMorning = this.calculateConsecutiveMorning(records)
          morningBadge.progress = Math.min(100, (consecutiveMorning / 5) * 100)
          morningBadge.progressText = `已连续${consecutiveMorning}天早起排便`
          if (consecutiveMorning >= 5 && !morningBadge.earned) {
            morningBadge.earned = true
            morningBadge.progress = 100
            morningBadge.progressText = '已完成'
            morningBadge.nextStep = ''
            morningBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (consecutiveMorning < 5) {
            morningBadge.nextStep = `还需连续${5 - consecutiveMorning}天早起排便`
          }
        }
        
        // 分析大师徽章
        const analysisBadge = this.badges.find(b => b.id === 8)
        if (analysisBadge) {
          // 这里需要从其他存储中获取分析页面查看次数
          // 暂时使用硬编码的默认值
          const viewCount = 0
          analysisBadge.progress = Math.min(100, (viewCount / 10) * 100)
          analysisBadge.progressText = `已查看${viewCount}次`
          if (viewCount >= 10 && !analysisBadge.earned) {
            analysisBadge.earned = true
            analysisBadge.progress = 100
            analysisBadge.progressText = '已完成'
            analysisBadge.nextStep = ''
            analysisBadge.earnedDate = this.formatDate(new Date().getTime())
          } else if (viewCount < 10) {
            analysisBadge.nextStep = `还需查看${10 - viewCount}次`
          }
        }
        
        // 保存更新后的徽章数据
        this.saveBadgesData()
      },
      
      // 计算连续记录天数
      calculateConsecutiveDays() {
        if (!this.records || this.records.length === 0) return 0
        
        // 按日期排序记录
        const sortedRecords = [...this.records]
          .sort((a, b) => b.date.localeCompare(a.date))
        
        // 获取唯一的日期
        const uniqueDates = [...new Set(sortedRecords.map(r => r.date))]
        
        // 计算连续天数
        let consecutiveDays = 1
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // 检查今天是否有记录
        const todayStr = this.formatDate(today.getTime(), 'date')
        let lastDate = todayStr
        
        if (uniqueDates[0] !== todayStr) {
          // 如果今天没有记录，检查昨天
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = this.formatDate(yesterday.getTime(), 'date')
          
          if (uniqueDates[0] !== yesterdayStr) {
            return 0 // 最近一天没有记录
          } else {
            lastDate = yesterdayStr
          }
        }
        
        // 从最近的记录开始，向前检查连续天数
        for (let i = 1; i < uniqueDates.length; i++) {
          const currentDateStr = uniqueDates[i]
          const expectedPrevDate = new Date(lastDate)
          expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)
          const expectedPrevDateStr = this.formatDate(expectedPrevDate.getTime(), 'date')
          
          if (currentDateStr === expectedPrevDateStr) {
            consecutiveDays++
            lastDate = currentDateStr
          } else {
            break
          }
        }
        
        return consecutiveDays
      },
      
      // 计算连续相同感受的次数
      calculateConsecutiveFeeling(records, feeling) {
        if (!records || records.length === 0) return 0
        
        // 按时间倒序排序记录
        const sortedRecords = [...records]
          .sort((a, b) => {
            if (a.date !== b.date) {
              return b.date.localeCompare(a.date)
            }
            return b.time.localeCompare(a.time)
          })
        
        let consecutiveCount = 0
        for (const record of sortedRecords) {
          if (record.feeling === feeling) {
            consecutiveCount++
          } else {
            break
          }
        }
        
        return consecutiveCount
      },
      
      // 计算连续健康时长的次数
      calculateConsecutiveDuration(records) {
        if (!records || records.length === 0) return 0
        
        // 按时间倒序排序记录
        const sortedRecords = [...records]
          .sort((a, b) => {
            if (a.date !== b.date) {
              return b.date.localeCompare(a.date)
            }
            return b.time.localeCompare(a.time)
          })
        
        let consecutiveCount = 0
        for (const record of sortedRecords) {
          const duration = parseInt(record.duration) || 0
          if (duration >= 5 && duration <= 10) {
            consecutiveCount++
          } else {
            break
          }
        }
        
        return consecutiveCount
      },
      
      // 计算连续早晨排便的天数
      calculateConsecutiveMorning(records) {
        if (!records || records.length === 0) return 0
        
        // 按日期倒序排序记录
        const sortedRecords = [...records]
          .sort((a, b) => b.date.localeCompare(a.date))
        
        // 获取每天最早的记录时间
        const dailyEarliestTime = {}
        for (const record of sortedRecords) {
          if (!dailyEarliestTime[record.date] || record.time < dailyEarliestTime[record.date]) {
            dailyEarliestTime[record.date] = record.time
          }
        }
        
        // 获取日期列表
        const dates = Object.keys(dailyEarliestTime).sort((a, b) => b.localeCompare(a))
        
        // 计算连续早晨的天数
        let consecutiveDays = 0
        const morningCutoff = '10:00' // 上午10点之前算早晨
        
        for (const date of dates) {
          if (dailyEarliestTime[date] <= morningCutoff) {
            consecutiveDays++
          } else {
            break
          }
        }
        
        return consecutiveDays
      },
      
      // 格式化日期
      formatDate(timestamp, format = 'full') {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        if (format === 'date') {
          return `${year}-${month}-${day}`
        }
        
        return `${year}-${month}-${day}`
      },
      
      // 更新统计信息
      updateStats() {
        this.totalCount = this.badges.length
        this.earnedCount = this.badges.filter(b => b.earned).length
        this.progressPercentage = this.totalCount > 0 
          ? Math.round((this.earnedCount / this.totalCount) * 100) 
          : 0
      },
      
      navigateBack() {
        uni.navigateBack()
      },
      
      selectTab(tab) {
        this.selectedTab = tab
      },
      
      showBadgeDetail(badge) {
        this.selectedBadge = badge
        this.showDetail = true
      },
      
      closeDetail() {
        this.showDetail = false
        this.selectedBadge = null
      }
    }
  }
</script>

<style scoped>
  .badges-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    width: 40rpx;
    height: 40rpx;
  }
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
  }
  
  .empty-space {
    width: 40rpx;
  }
  
  .badges-stats {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
  }
  
  .stat-number {
    font-size: 48rpx;
    font-weight: bold;
    color: #A67D4F;
    margin-bottom: 10rpx;
  }
  
  .stat-label {
    font-size: 26rpx;
    color: #666666;
  }
  
  .stat-divider {
    width: 1rpx;
    background-color: #F0F0F0;
    margin: 0 20rpx;
  }
  
  .badge-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 10rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
  }
  
  .tab {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 30rpx;
    color: #666666;
  }
  
  .tab.active {
    background-color: #FFF9F2;
    color: #A67D4F;
    font-weight: bold;
  }
  
  .badges-grid {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
  }
  
  .badge-item {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    align-items: center;
  }
  
  .badge-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #FFF9F2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
  }
  
  .badge-icon.grayscale {
    filter: grayscale(1);
    opacity: 0.5;
  }
  
  .badge-image {
    width: 80rpx;
    height: 80rpx;
  }
  
  .badge-info {
    flex: 1;
  }
  
  .badge-name {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .badge-description {
    font-size: 26rpx;
    color: #666666;
    margin-bottom: 10rpx;
  }
  
  .badge-date {
    font-size: 24rpx;
    color: #A67D4F;
  }
  
  .badge-progress {
    margin-top: 10rpx;
  }
  
  .progress-bar {
    width: 100%;
    height: 10rpx;
    background-color: #F0F0F0;
    border-radius: 5rpx;
    margin-bottom: 5rpx;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #A67D4F;
    border-radius: 5rpx;
  }
  
  .progress-text {
    font-size: 22rpx;
    color: #999999;
  }
  
  /* 弹窗样式 */
  .detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .modal-content {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    width: 80%;
    max-width: 600rpx;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .modal-title {
    font-size: 36rpx;
    font-weight: bold;
  }
  
  .close-button {
    font-size: 48rpx;
    color: #999999;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-body {
    padding: 40rpx;
    text-align: center;
  }
  
  .detail-badge-icon {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background-color: #FFF9F2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30rpx;
  }
  
  .detail-badge-image {
    width: 140rpx;
    height: 140rpx;
  }
  
  .detail-description {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
    margin-bottom: 30rpx;
  }
  
  .detail-earned {
    margin-top: 20rpx;
  }
  
  .earned-label {
    font-size: 26rpx;
    color: #666666;
    margin-right: 10rpx;
  }
  
  .earned-date {
    font-size: 26rpx;
    color: #A67D4F;
    font-weight: bold;
  }
  
  .detail-progress {
    margin-top: 30rpx;
  }
  
  .progress-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .detail-progress-bar {
    width: 100%;
    height: 20rpx;
    background-color: #F0F0F0;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
  }
  
  .detail-progress-fill {
    height: 100%;
    background-color: #A67D4F;
    border-radius: 10rpx;
  }
  
  .detail-progress-text {
    font-size: 32rpx;
    color: #A67D4F;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .next-step {
    font-size: 26rpx;
    color: #999999;
  }
</style>