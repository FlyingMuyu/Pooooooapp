<template>
  <view class="profile-container">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <image :src="userInfo.avatar" class="user-avatar" @click="viewUserProfile(userInfo.uid)"></image>
      <view class="user-info">
        <view class="user-name-row">
          <text class="user-name" @click="viewUserProfile(userInfo.uid)">{{userInfo.nickname}}</text>
          <text class="user-level">{{userInfo.level}}</text>
        </view>
        <text class="user-title">{{userInfo.title}}</text>
      </view>
      <image src="../../static/settings.svg" class="settings-icon" @click="goToSettings"></image>
    </view>
    
    <!-- 统计数据 -->
    <view class="stats-container">
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalRecords }}</text>
        <text class="stat-label">总记录</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.monthRecords }}</text>
        <text class="stat-label">本月记录</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.currentStreak || 0 }}</text>
        <text class="stat-label">连续天数</text>
      </view>
    </view>
    
    <!-- 数据可视化区域 -->
    <view class="visualization-section">
      <view class="chart-header">
        <view class="chart-title">最近一周趋势</view>
      </view>
      <canvas id="weeklyChart" class="chart-canvas"></canvas>
    </view>
    
    <view class="visualization-section">
      <view class="chart-header">
        <view class="chart-title">本月时段分布</view>
      </view>
      <view class="distribution-container">
        <view v-for="(item, index) in monthlyDistribution" :key="index" class="distribution-item">
          <view class="distribution-label">{{ item.period }}</view>
          <view class="distribution-bar-container">
            <view class="distribution-bar" :style="{ width: getDistributionBarWidth(item.count) + '%' }"></view>
          </view>
          <view class="distribution-value">{{ item.count }}次</view>
        </view>
      </view>
    </view>
    
    <!-- 健康报告 -->
    <view class="health-report">
      <view class="report-header">
        <text class="report-title">健康报告</text>
        <text class="report-more" @click="viewHealthReport">查看详情</text>
      </view>
      <view class="report-item" v-for="(item, index) in healthReport" :key="index">
        <view class="report-content">
          <text class="report-icon">{{getReportIcon(item.type)}}</text>
          <text class="report-label">排便{{item.type}}</text>
          <text class="report-value" :class="item.level">{{item.value}}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :class="item.level + '-fill'" :style="{width: item.progress + '%'}"></view>
        </view>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToHistory">
        <view class="menu-icon">📊</view>
        <text class="menu-text">历史记录</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToAnalytics">
        <view class="menu-icon">📈</view>
        <text class="menu-text">数据分析</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToBadges">
        <view class="menu-icon">🏆</view>
        <text class="menu-text">成就徽章</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToReminder">
        <view class="menu-icon">⏰</view>
        <text class="menu-text">提醒设置</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
    
    <!-- 其他选项 -->
    <view class="other-section">
      <view class="menu-item" @click="goToSettings">
        <view class="menu-icon">⚙️</view>
        <text class="menu-text">应用设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="aboutUs">
        <view class="menu-icon">ℹ️</view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {
          uid: '1001', // 默认用户ID
          nickname: '用户昵称',
          avatar: '../../static/avatar.svg',
          level: 'Lv.1',
          title: '新手上路'
        },
        stats: {
          totalRecords: 0,
          monthRecords: 0,
          weeklyAverage: 0,
          currentStreak: 0
        },
        healthReport: [
          {
            type: '规律性',
            value: '优秀',
            level: 'excellent',
            progress: 90
          },
          {
            type: '时长',
            value: '一般',
            level: 'average',
            progress: 60
          },
          {
            type: '水分摄入',
            value: '不足',
            level: 'poor',
            progress: 30
          }
        ],
        weeklyData: [], // 最近一周的数据
        monthlyDistribution: [], // 月度分布数据
        chartWidth: 0,
        chartHeight: 200
      }
    },
    onShow() {
      // 每次页面显示时加载本地数据
      this.loadLocalData()
    },
    methods: {
      // 查看用户中心
      viewUserProfile(uid) {
        uni.navigateTo({
          url: '../userProfile/userProfile?uid=' + uid
        });
      },
      // 前往应用设置页面
      goToSettings() {
        try {
          uni.navigateTo({
            url: '/pages/settings/settings',
            fail: (err) => {
              console.error('跳转设置页面失败:', err)
              uni.showToast({
                title: '该功能暂未开放',
                icon: 'none'
              })
            }
          })
        } catch (error) {
          console.error('导航异常:', error)
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        }
      },
      viewHealthReport() {
        try {
          uni.navigateTo({
            url: '../dataAnalysis/dataAnalysis'
          })
        } catch (error) {
          console.error('导航失败:', error)
        }
      },
      
      // 获取健康报告图标
      getReportIcon(type) {
        const iconMap = {
          '规律性': '⏱️',
          '时长': '⌛',
          '水分摄入': '💧'
        }
        return iconMap[type] || '📊'
      },
      // 前往历史记录页面
      goToHistory() {
        uni.navigateTo({
          url: '/pages/history/history'
        })
      },
      // 前往数据分析页面
      goToAnalytics() {
        try {
          uni.navigateTo({
            url: '/pages/dataAnalysis/dataAnalysis',
            fail: (err) => {
              console.error('跳转数据分析页面失败:', err)
              uni.showToast({
                title: '该功能暂未开放',
                icon: 'none'
              })
            }
          })
        } catch (error) {
          console.error('导航异常:', error)
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        }
      },
      // 前往成就徽章页面
      goToBadges() {
        uni.navigateTo({
          url: '/pages/badges/badges'
        })
      },
      // 前往提醒设置页面
      goToReminder() {
        try {
          uni.navigateTo({
            url: '/pages/reminder/reminder',
            fail: (err) => {
              console.error('跳转提醒设置页面失败:', err)
              uni.showToast({
                title: '该功能暂未开放',
                icon: 'none'
              })
            }
          })
        } catch (error) {
          console.error('导航异常:', error)
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        }
      },
      // 关于我们
      aboutUs() {
        try {
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
          console.error('导航异常:', error)
          uni.showToast({
            title: '功能暂未开放',
            icon: 'none'
          })
        }
      },
      
      // 加载本地数据
      loadLocalData() {
        try {
          // 获取用户信息
          try {
            const userInfo = uni.getStorageSync('userInfo')
            if (userInfo) {
              this.userInfo = { ...this.getDefaultUserInfo(), ...userInfo }
            }
          } catch (e) {
            console.error('获取用户信息失败:', e)
          }
          
          // 获取健康报告数据
          try {
            const healthReport = uni.getStorageSync('healthReport')
            if (healthReport && healthReport.length) {
              this.healthReport = healthReport
            }
          } catch (e) {
            console.error('获取健康报告失败:', e)
          }
          
          // 计算统计数据
          this.calculateStats()
          
          // 准备图表数据
          this.prepareChartData()
        } catch (error) {
          console.error('加载本地数据出错:', error)
        }
      },
      
      // 准备图表数据
      prepareChartData() {
        try {
          let records = []
          
          // 获取所有记录
          try {
            records = uni.getStorageSync('stoolRecords') || []
          } catch (e) {
            console.error('获取记录失败:', e)
            records = []
          }
          
          // 准备最近7天的数据
          this.prepareWeeklyData(records)
          
          // 准备月度分布数据
          this.prepareMonthlyDistribution(records)
          
          // 等待DOM更新后绘制图表
          this.$nextTick(() => {
            this.drawCharts()
          })
        } catch (error) {
          console.error('准备图表数据出错:', error)
        }
      },
      
      // 准备最近一周的数据
      prepareWeeklyData(records) {
        const now = new Date()
        this.weeklyData = []
        
        // 生成最近7天的日期
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(now.getDate() - i)
          const dateStr = this.formatDate(date)
          const dayOfWeek = this.getDayOfWeek(date)
          
          // 统计当天的记录数
          const count = records.filter(record => {
            return record.date === dateStr
          }).length
          
          this.weeklyData.push({
            date: dateStr,
            day: dayOfWeek,
            count: count
          })
        }
      },
      
      // 准备月度分布数据
      prepareMonthlyDistribution(records) {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        // 按时间段统计
        const morningCount = records.filter(record => {
          const recordDate = new Date(record.date)
          if (recordDate.getMonth() !== currentMonth || recordDate.getFullYear() !== currentYear) {
            return false
          }
          const hour = record.time ? parseInt(record.time.split(':')[0]) : 0
          return hour >= 5 && hour < 12
        }).length
        
        const afternoonCount = records.filter(record => {
          const recordDate = new Date(record.date)
          if (recordDate.getMonth() !== currentMonth || recordDate.getFullYear() !== currentYear) {
            return false
          }
          const hour = record.time ? parseInt(record.time.split(':')[0]) : 0
          return hour >= 12 && hour < 18
        }).length
        
        const eveningCount = records.filter(record => {
          const recordDate = new Date(record.date)
          if (recordDate.getMonth() !== currentMonth || recordDate.getFullYear() !== currentYear) {
            return false
          }
          const hour = record.time ? parseInt(record.time.split(':')[0]) : 0
          return (hour >= 18 && hour <= 23) || (hour >= 0 && hour < 5)
        }).length
        
        this.monthlyDistribution = [
          { period: '早上 (5:00-12:00)', count: morningCount },
          { period: '下午 (12:00-18:00)', count: afternoonCount },
          { period: '晚上 (18:00-5:00)', count: eveningCount }
        ]
      },
      
      // 绘制图表
      drawCharts() {
        this.drawWeeklyChart()
      },
      
      // 绘制最近一周趋势图
      drawWeeklyChart() {
        const canvas = uni.createSelectorQuery().in(this).select('#weeklyChart')
        canvas.fields({ node: true, size: true }).exec((res) => {
          if (!res || !res[0] || !res[0].node) return
          
          const canvasNode = res[0].node
          const ctx = canvasNode.getContext('2d')
          const dpr = uni.getSystemInfoSync().pixelRatio
          
          // 设置canvas尺寸
          canvasNode.width = res[0].width * dpr
          canvasNode.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          const width = res[0].width
          const height = res[0].height
          
          // 清空画布
          ctx.clearRect(0, 0, width, height)
          
          // 绘制网格线
          ctx.strokeStyle = '#F0F0F0'
          ctx.lineWidth = 1
          
          // 水平网格线
          for (let i = 0; i <= 5; i++) {
            const y = (height - 40) * (1 - i / 5) + 20
            ctx.beginPath()
            ctx.moveTo(40, y)
            ctx.lineTo(width - 20, y)
            ctx.stroke()
          }
          
          // 找出最大值
          const maxCount = Math.max(...this.weeklyData.map(item => item.count), 1)
          const scaledMaxCount = Math.ceil(maxCount * 1.2)
          
          // 绘制柱状图
          const barWidth = (width - 60) / this.weeklyData.length * 0.6
          const barSpacing = (width - 60) / this.weeklyData.length
          
          for (let i = 0; i < this.weeklyData.length; i++) {
            const item = this.weeklyData[i]
            const x = 40 + i * barSpacing + (barSpacing - barWidth) / 2
            const barHeight = (item.count / scaledMaxCount) * (height - 60)
            const y = height - 40 - barHeight
            
            // 绘制柱子
            ctx.fillStyle = '#A67D4F'
            ctx.fillRect(x, y, barWidth, barHeight)
            
            // 绘制数值
            ctx.fillStyle = '#666666'
            ctx.font = '12px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(item.count, x + barWidth / 2, y - 5)
            
            // 绘制日期
            ctx.fillStyle = '#999999'
            ctx.fillText(item.day, x + barWidth / 2, height - 20)
          }
        })
      },
      
      // 格式化日期
      formatDate(date) {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      
      // 获取星期几
      getDayOfWeek(date) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `周${days[date.getDay()]}`
      },
      
      // 保存数据到本地存储
      saveLocalData() {
        try {
          console.log('保存个人中心数据到本地...')
          
          // 统一使用 uni.setStorageSync API
          try {
            // 保存用户信息
            uni.setStorageSync('userInfo', this.userInfo)
            console.log('用户信息保存成功')
          } catch (e) {
            console.error('保存用户信息失败:', e)
          }
          
          try {
            // 保存健康报告数据
            uni.setStorageSync('healthReport', this.healthReport)
            console.log('健康报告数据保存成功')
          } catch (e) {
            console.error('保存健康报告失败:', e)
          }
          
          console.log('数据保存完成')
        } catch (error) {
          console.error('保存本地数据出错:', error)
        }
      },
      
      // 获取分布条宽度
      getDistributionBarWidth(count) {
        if (!this.monthlyDistribution || this.monthlyDistribution.length === 0) return 0
        const maxCount = Math.max(...this.monthlyDistribution.map(item => item.count), 1)
        return maxCount > 0 ? (count / maxCount) * 100 : 0
      },
      
      // 计算统计数据
      calculateStats() {
        try {
          let records = []
          
          // 获取所有记录，使用统一的stoolRecords存储键名
          try {
            records = uni.getStorageSync('stoolRecords') || []
            console.log('获取到', records.length, '条记录')
          } catch (e) {
            console.error('获取记录失败:', e)
            records = []
          }
          
          // 计算总记录数
          this.stats.totalRecords = records.length
          
          // 计算本月记录数
          const now = new Date()
          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()
          this.stats.monthRecords = records.filter(record => {
            const recordDate = new Date(record.date)
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
          }).length
          
          // 计算平均每周次数（基于最近4周数据）
          const fourWeeksAgo = new Date()
          fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
          const recentRecords = records.filter(record => {
            const recordDate = new Date(record.date)
            return recordDate >= fourWeeksAgo
          })
          this.stats.weeklyAverage = recentRecords.length / 4
          
          // 计算连续天数
          this.calculateStreak(records)
        } catch (error) {
          console.error('计算统计数据出错:', error)
          this.stats = {
            totalRecords: 0,
            monthRecords: 0,
            weeklyAverage: 0,
            currentStreak: 0
          }
        }
      },
      
      // 计算连续打卡天数
      calculateStreak(records) {
        if (!records || records.length === 0) {
          this.stats.currentStreak = 0
          return
        }
        
        // 按日期排序（降序）
        const sortedRecords = [...records].sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
        
        let streak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // 检查今天是否有记录
        let checkDate = new Date(today)
        let currentIndex = 0
        
        // 如果今天没有记录，从昨天开始检查
        const firstRecordDate = new Date(sortedRecords[0].date)
        firstRecordDate.setHours(0, 0, 0, 0)
        
        if (firstRecordDate.getTime() !== today.getTime()) {
          // 如果第一条记录不是今天，检查是否是昨天
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          if (firstRecordDate.getTime() !== yesterday.getTime()) {
            this.stats.currentStreak = 0
            return
          }
          checkDate = yesterday
        }
        
        // 计算连续天数
        while (currentIndex < sortedRecords.length) {
          const recordDate = new Date(sortedRecords[currentIndex].date)
          recordDate.setHours(0, 0, 0, 0)
          
          if (recordDate.getTime() === checkDate.getTime()) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
            
            // 跳过同一天的其他记录
            while (currentIndex < sortedRecords.length) {
              const nextRecordDate = new Date(sortedRecords[currentIndex].date)
              nextRecordDate.setHours(0, 0, 0, 0)
              if (nextRecordDate.getTime() !== recordDate.getTime()) {
                break
              }
              currentIndex++
            }
          } else if (recordDate.getTime() < checkDate.getTime()) {
            // 日期不连续，结束计算
            break
          } else {
            currentIndex++
          }
        }
        
        this.stats.currentStreak = streak
      },
      
      // 获取默认用户信息
      getDefaultUserInfo() {
        return {
          nickname: '用户昵称',
          avatar: '../../static/avatar.svg',
          level: 'Lv.1',
          title: '新手上路'
        }
      },
      
      // 获取默认健康报告
      getDefaultHealthReport() {
        return [
          {
            type: '规律性',
            value: '优秀',
            level: 'excellent',
            progress: 90
          },
          {
            type: '时长',
            value: '一般',
            level: 'average',
            progress: 60
          },
          {
            type: '水分摄入',
            value: '不足',
            level: 'poor',
            progress: 30
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .profile-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .user-header {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  
  .user-info {
    flex: 1;
  }
  
  .user-name-row {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }
  
  .user-name {
    font-size: 36rpx;
    font-weight: bold;
    margin-right: 10rpx;
  }
  
  .user-level {
    font-size: 28rpx;
    color: #A67D4F;
    background-color: #FFF9F2;
    padding: 5rpx 15rpx;
    border-radius: 20rpx;
  }
  
  .user-title {
    font-size: 28rpx;
    color: #666666;
  }
  
  .settings-icon {
    width: 40rpx;
    height: 40rpx;
  }
  
  .stats-container {
    display: flex;
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
  }
  
  .stat-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #A67D4F;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .stat-label {
    font-size: 26rpx;
    color: #666666;
  }
  
  .stat-divider {
    width: 1rpx;
    background-color: #F0F0F0;
    margin: 0 30rpx;
  }
  
  .health-report {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .report-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .report-more {
    font-size: 28rpx;
    color: #999999;
  }
  
  .report-item {
    margin-bottom: 25rpx;
  }
  
  .report-item:last-child {
    margin-bottom: 0;
  }
  
  .report-icon {
    font-size: 30rpx;
    margin-right: 10rpx;
  }
  
  .report-content {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }
  
  .report-label {
    font-size: 28rpx;
    color: #666666;
    margin-right: 20rpx;
  }
  
  .report-value {
    font-size: 28rpx;
    font-weight: bold;
  }
  
  .report-value.excellent {
    color: #52C41A;
  }
  
  .report-value.average {
    color: #FAAD14;
  }
  
  .report-value.poor {
    color: #F5222D;
  }
  
  .progress-bar {
    width: 100%;
    height: 15rpx;
    background-color: #F0F0F0;
    border-radius: 10rpx;
    margin-top: 10rpx;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
  }
  
  .progress-fill.excellent-fill {
    background-color: #52C41A;
  }
  
  .progress-fill.average-fill {
    background-color: #FAAD14;
  }
  
  .progress-fill.poor-fill {
    background-color: #F5222D;
  }
  
  .menu-section, .other-section {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
  
  .menu-icon {
    font-size: 40rpx;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
  }
  
  .menu-text {
    flex: 1;
    font-size: 30rpx;
    color: #333333;
  }
  
  .menu-arrow {
    font-size: 30rpx;
    color: #CCCCCC;
  }
  
  /* 数据可视化样式 */
  .visualization-section {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .chart-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .chart-canvas {
    width: 100%;
    height: 200px;
  }
  
  /* 分布图表样式 */
  .distribution-container {
    padding: 10rpx 0;
  }
  
  .distribution-item {
    margin-bottom: 25rpx;
  }
  
  .distribution-item:last-child {
    margin-bottom: 0;
  }
  
  .distribution-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
  }
  
  .distribution-bar-container {
    height: 40rpx;
    background-color: #F5F5F5;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 5rpx;
  }
  
  .distribution-bar {
    height: 100%;
    background-color: #A67D4F;
    transition: width 0.5s ease;
  }
  
  .distribution-value {
    font-size: 26rpx;
    color: #999999;
    text-align: right;
  }
</style>