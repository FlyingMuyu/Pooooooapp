<template>
  <view class="data-analysis-container">
    <view class="page-header">
      <view class="back-button" @tap="navigateBack">
        <image src="/static/back.svg" class="back-icon"></image>
      </view>
      <text class="page-title">数据分析</text>
      <view class="empty-space"></view>
    </view>
    
    <!-- 时间筛选 -->
    <view class="time-filter">
      <view class="filter-item" :class="{ active: selectedTimeRange === 'week' }" @tap="selectTimeRange('week')">
        最近一周
      </view>
      <view class="filter-item" :class="{ active: selectedTimeRange === 'month' }" @tap="selectTimeRange('month')">
        最近一月
      </view>
    </view>
    
    <!-- 统计卡片 -->
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-value">{{ totalCount }}</text>
        <text class="stat-label">总次数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ avgDuration }}</text>
        <text class="stat-label">平均时长(分钟)</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ regularityRate }}%</text>
        <text class="stat-label">规律率</text>
      </view>
    </view>
    
    <!-- 图表区域 -->
    <view class="charts-section">
      <!-- 频率图表 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">每日频率</text>
          <text class="chart-subtitle">{{ frequencySubtitle }}</text>
        </view>
        <view class="frequency-chart">
          <view v-for="(day, index) in frequencyData" :key="index" class="frequency-bar">
            <view class="bar" :style="{ height: day.value * 40 + 'rpx' }"></view>
            <text class="bar-label">{{ day.label }}</text>
            <text class="bar-value">{{ day.value }}</text>
          </view>
        </view>
      </view>
      
      <!-- 时间段分布 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">时间段分布</text>
          <text class="chart-subtitle">一天中不同时段的排便分布</text>
        </view>
        <view class="time-distribution">
          <view class="distribution-item" v-for="(item, index) in timeDistributionData" :key="index">
            <view class="distribution-circle" :style="{ width: item.percent * 3 + 'rpx', height: item.percent * 3 + 'rpx' }"></view>
            <text class="distribution-label">{{ item.timeRange }}</text>
            <text class="distribution-percent">{{ item.percent }}%</text>
          </view>
        </view>
      </view>
      
      <!-- 类型分析（基于布里斯托大便分类法） -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">类型分析</text>
          <text class="chart-subtitle">基于布里斯托大便分类法</text>
        </view>
        <view class="type-analysis">
          <view class="type-item" v-for="(type, index) in stoolTypeData" :key="index">
            <view class="type-icon">{{ type.emoji }}</view>
            <view class="type-info">
              <text class="type-name">类型{{ type.id }}</text>
              <text class="type-desc">{{ type.description }}</text>
            </view>
            <text class="type-count">{{ type.count }}次</text>
          </view>
        </view>
      </view>
      
      <!-- 状态统计 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">感受统计</text>
        </view>
        <view class="status-stats">
          <view class="status-item">
            <view class="status-circle" style="background-color: #52C41A;"></view>
            <text class="status-label">舒适</text>
            <text class="status-value">{{ comfortCount }}次</text>
          </view>
          <view class="status-item">
            <view class="status-circle" style="background-color: #FAAD14;"></view>
            <text class="status-label">一般</text>
            <text class="status-value">{{ normalCount }}次</text>
          </view>
          <view class="status-item">
            <view class="status-circle" style="background-color: #F5222D;"></view>
            <text class="status-label">不适</text>
            <text class="status-value">{{ discomfortCount }}次</text>
          </view>
        </view>
      </view>
      
      <!-- 规律性分析 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">规律性分析</text>
        </view>
        <view class="regularity-analysis">
          <view class="regularity-item">
            <text class="regularity-label">平均间隔</text>
            <text class="regularity-value">{{ avgInterval }}小时</text>
          </view>
          <view class="regularity-item">
            <text class="regularity-label">连续天数</text>
            <text class="regularity-value">{{ consecutiveDays }}天</text>
          </view>
          <view class="regularity-item">
            <text class="regularity-label">最佳时段</text>
            <text class="regularity-value">{{ bestTimeOfDay }}</text>
          </view>
        </view>
      </view>
      
      <!-- 健康评估 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">健康评估</text>
        </view>
        <view class="health-assessment">
          <view class="assessment-score">
            <text class="score-number">{{ healthScore }}</text>
            <text class="score-label">健康评分</text>
          </view>
          <view class="assessment-level" :class="'level-' + healthLevel">
            {{ healthLevelText }}
          </view>
          <view class="assessment-details">
            <view class="detail-item">
              <text class="detail-label">频率评分</text>
              <view class="detail-bar">
                <view class="detail-progress" :style="{ width: frequencyScore + '%' }"></view>
              </view>
              <text class="detail-value">{{ frequencyScore }}/100</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">规律性评分</text>
              <view class="detail-bar">
                <view class="detail-progress" :style="{ width: regularityScore + '%' }"></view>
              </view>
              <text class="detail-value">{{ regularityScore }}/100</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">舒适度评分</text>
              <view class="detail-bar">
                <view class="detail-progress" :style="{ width: comfortScore + '%' }"></view>
              </view>
              <text class="detail-value">{{ comfortScore }}/100</text>
            </view>
          </view>
          <view class="assessment-suggestions">
            <view class="suggestion-item" v-for="(suggestion, index) in healthSuggestions" :key="index">
              <text class="suggestion-icon">{{ suggestion.icon }}</text>
              <text class="suggestion-text">{{ suggestion.text }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 导出数据按钮 -->
    <view class="export-button" @tap="exportData">
      <text class="export-text">导出数据</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        selectedTimeRange: 'month',
        totalCount: 0,
        avgDuration: '0.0',
        maxDuration: '0',
        regularityRate: 0,
        comfortCount: 0,
        normalCount: 0,
        discomfortCount: 0,
        healthScore: 0,
        healthLevel: 3,
        healthLevelText: '一般',
        frequencyScore: 0,
        regularityScore: 0,
        comfortScore: 0,
        avgInterval: '0.0',
        consecutiveDays: 0,
        bestTimeOfDay: '',
        frequencySubtitle: '',
        frequencyData: [],
        timeDistributionData: [],
        stoolTypeData: [],
        healthSuggestions: []
      }
    },
    onLoad() {
      // 初始化时加载数据
      this.loadData()
    },
    methods: {
      navigateBack() {
        uni.navigateBack()
      },
      
      selectTimeRange(range) {
        this.selectedTimeRange = range
        this.loadData()
      },
      
      loadData() {
        // 根据时间范围生成模拟数据
        if (this.selectedTimeRange === 'week') {
          this.generateWeekData()
        } else if (this.selectedTimeRange === 'month') {
          this.generateMonthData()
        }
        
        // 计算健康评分和建议
        this.calculateHealthScore()
        this.generateHealthSuggestions()
      },
      
      generateWeekData() {
        // 最近一周的数据 - 更符合实际情况
        const days = ['一', '二', '三', '四', '五', '六', '日']
        
        // 生成符合实际的一周频率数据
        this.frequencyData = days.map((day, index) => {
          // 工作日更规律，周末可能略有变化
          let value = 1
          if (index === 2 || index === 4) { // 周三、周五
            value = Math.random() > 0.2 ? 2 : 1
          } else if (index === 5 || index === 6) { // 周六、周日
            value = Math.random() > 0.3 ? 1 : 0
          }
          return { label: day, value }
        })
        
        // 计算总次数
        this.totalCount = this.frequencyData.reduce((sum, day) => sum + day.value, 0)
        
        // 更真实的统计数据
        this.avgDuration = (Math.random() * 3 + 6).toFixed(1)
        this.maxDuration = Math.floor(Math.random() * 10 + 10).toString()
        this.regularityRate = Math.floor(Math.random() * 20 + 75)
        
        // 感受统计
        const comfortRatio = 0.7 + Math.random() * 0.2
        const normalRatio = 0.2 + Math.random() * 0.1
        this.comfortCount = Math.floor(this.totalCount * comfortRatio)
        this.normalCount = Math.floor(this.totalCount * normalRatio)
        this.discomfortCount = this.totalCount - this.comfortCount - this.normalCount
        
        // 时间段分布
        this.timeDistributionData = [
          { timeRange: '早晨', percent: Math.floor(Math.random() * 20 + 40) },
          { timeRange: '中午', percent: Math.floor(Math.random() * 15 + 10) },
          { timeRange: '下午', percent: Math.floor(Math.random() * 15 + 10) },
          { timeRange: '晚上', percent: Math.floor(Math.random() * 15 + 10) }
        ]
        
        // 确保百分比总和接近100
        const totalPercent = this.timeDistributionData.reduce((sum, item) => sum + item.percent, 0)
        this.timeDistributionData.forEach(item => {
          item.percent = Math.round((item.percent / totalPercent) * 100)
        })
        
        // 大便类型数据（基于布里斯托分类法）
        this.stoolTypeData = [
          { id: 1, description: '坚果状，硬块状', emoji: '🥜', count: Math.floor(Math.random() * 2) },
          { id: 2, description: '香肠状，但块状', emoji: '🌭', count: Math.floor(Math.random() * 2) },
          { id: 3, description: '香肠状，表面有裂痕', emoji: '🍖', count: Math.floor(Math.random() * 3) },
          { id: 4, description: '香肠状或蛇状，光滑柔软', emoji: '🐍', count: Math.floor(this.totalCount * 0.4) },
          { id: 5, description: '柔软团块，边缘清晰', emoji: '☁️', count: Math.floor(this.totalCount * 0.25) },
          { id: 6, description: '糊状，边缘模糊', emoji: '💩', count: Math.floor(Math.random() * 3) },
          { id: 7, description: '水样，无固体块', emoji: '💧', count: Math.floor(Math.random() * 2) },
          { id: 8, description: '喷射状，强力排出', emoji: '💨', count: Math.floor(Math.random() * 1) }
        ]
        
        // 确保总次数匹配
        const typeTotalCount = this.stoolTypeData.reduce((sum, type) => sum + type.count, 0)
        if (typeTotalCount < this.totalCount) {
          // 主要补充健康类型（4和5）
          const diff = this.totalCount - typeTotalCount
          const healthyTypes = [3, 4, 5]
          for (let i = 0; i < diff; i++) {
            const randomIndex = healthyTypes[Math.floor(Math.random() * healthyTypes.length)] - 1
            this.stoolTypeData[randomIndex].count++
          }
        }
        
        // 规律性分析
        this.avgInterval = (24 / (this.totalCount / 7)).toFixed(1)
        this.consecutiveDays = Math.floor(Math.random() * 4 + 3)
        this.bestTimeOfDay = '早晨'
        
        this.frequencySubtitle = '最近7天的排便频率统计'
      },
      
      generateMonthData() {
        // 最近一月的数据
        this.totalCount = Math.floor(Math.random() * 10 + 25)
        this.avgDuration = (Math.random() * 2 + 7).toFixed(1)
        this.maxDuration = Math.floor(Math.random() * 15 + 15).toString()
        this.regularityRate = Math.floor(Math.random() * 20 + 70)
        
        // 感受统计
        const comfortRatio = 0.65 + Math.random() * 0.2
        const normalRatio = 0.2 + Math.random() * 0.15
        this.comfortCount = Math.floor(this.totalCount * comfortRatio)
        this.normalCount = Math.floor(this.totalCount * normalRatio)
        this.discomfortCount = this.totalCount - this.comfortCount - this.normalCount
        
        // 简化的周数据（显示最近4周）
        const weeks = ['第1周', '第2周', '第3周', '第4周']
        this.frequencyData = weeks.map(() => ({
          label: '',
          value: Math.floor(Math.random() * 3 + 5)
        }))
        
        // 时间段分布
        this.timeDistributionData = [
          { timeRange: '早晨', percent: Math.floor(Math.random() * 20 + 35) },
          { timeRange: '中午', percent: Math.floor(Math.random() * 15 + 10) },
          { timeRange: '下午', percent: Math.floor(Math.random() * 15 + 15) },
          { timeRange: '晚上', percent: Math.floor(Math.random() * 15 + 15) }
        ]
        
        // 确保百分比总和接近100
        const totalPercent = this.timeDistributionData.reduce((sum, item) => sum + item.percent, 0)
        this.timeDistributionData.forEach(item => {
          item.percent = Math.round((item.percent / totalPercent) * 100)
        })
        
        // 大便类型数据
        this.stoolTypeData = [
          { id: 1, description: '坚果状，硬块状', emoji: '🥜', count: Math.floor(Math.random() * 3) },
          { id: 2, description: '香肠状，但块状', emoji: '🌭', count: Math.floor(Math.random() * 4) },
          { id: 3, description: '香肠状，表面有裂痕', emoji: '🍖', count: Math.floor(Math.random() * 5) },
          { id: 4, description: '香肠状或蛇状，光滑柔软', emoji: '🐍', count: Math.floor(this.totalCount * 0.4) },
          { id: 5, description: '柔软团块，边缘清晰', emoji: '☁️', count: Math.floor(this.totalCount * 0.25) },
          { id: 6, description: '糊状，边缘模糊', emoji: '💩', count: Math.floor(Math.random() * 6) },
          { id: 7, description: '水样，无固体块', emoji: '💧', count: Math.floor(Math.random() * 3) },
          { id: 8, description: '喷射状，强力排出', emoji: '💨', count: Math.floor(Math.random() * 2) }
        ]
        
        // 规律性分析
        this.avgInterval = (24 / (this.totalCount / 30)).toFixed(1)
        this.consecutiveDays = Math.floor(Math.random() * 7 + 5)
        this.bestTimeOfDay = Math.random() > 0.5 ? '早晨' : '晚上'
        
        this.frequencySubtitle = '最近30天的排便频率统计'
      },
      

      
      calculateHealthScore() {
        // 计算各维度评分
        // 频率评分：基于每日平均次数（理想为1-2次）
        const dailyAvg = this.selectedTimeRange === 'week' ? this.totalCount / 7 : 
                        this.totalCount / 30
        this.frequencyScore = Math.round(Math.max(0, Math.min(100, 100 - Math.abs(dailyAvg - 1.5) * 50)))
        
        // 规律性评分：基于规律率
        this.regularityScore = this.regularityRate
        
        // 舒适度评分：基于舒适次数比例
        this.comfortScore = Math.round((this.comfortCount / this.totalCount) * 100)
        
        // 综合健康评分
        this.healthScore = Math.round((this.frequencyScore * 0.3 + this.regularityScore * 0.4 + this.comfortScore * 0.3))
        
        // 确定健康等级
        if (this.healthScore >= 90) {
          this.healthLevel = 1
          this.healthLevelText = '优秀'
        } else if (this.healthScore >= 75) {
          this.healthLevel = 2
          this.healthLevelText = '良好'
        } else if (this.healthScore >= 60) {
          this.healthLevel = 3
          this.healthLevelText = '一般'
        } else if (this.healthScore >= 40) {
          this.healthLevel = 4
          this.healthLevelText = '需要改善'
        } else {
          this.healthLevel = 5
          this.healthLevelText = '建议就医'
        }
      },
      
      generateHealthSuggestions() {
        this.healthSuggestions = []
        
        // 基于各项评分生成个性化建议
        if (this.frequencyScore < 70) {
          this.healthSuggestions.push({
            icon: '!',
            text: '建议保持每天1-2次的排便频率'
          })
        } else {
          this.healthSuggestions.push({
            icon: '✓',
            text: '排便频率处于理想范围'
          })
        }
        
        if (this.regularityScore < 70) {
          this.healthSuggestions.push({
            icon: '!',
            text: '建议固定每日排便时间，提高规律性'
          })
        } else {
          this.healthSuggestions.push({
            icon: '✓',
            text: '排便规律性良好'
          })
        }
        
        if (this.comfortScore < 70) {
          this.healthSuggestions.push({
            icon: '!',
            text: '注意饮食结构，增加膳食纤维摄入，多喝水'
          })
        } else {
          this.healthSuggestions.push({
            icon: '✓',
            text: '排便舒适度良好'
          })
        }
        
        // 时长相关建议
        const avgDurNum = parseFloat(this.avgDuration)
        if (avgDurNum > 15) {
          this.healthSuggestions.push({
            icon: '!',
            text: '排便时间较长，建议避免长时间久坐马桶'
          })
        } else if (avgDurNum < 2) {
          this.healthSuggestions.push({
            icon: '?',
            text: '排便时间较短，注意观察是否有其他不适症状'
          })
        }
        
        // 额外的健康建议
        this.healthSuggestions.push({
          icon: '💧',
          text: '建议每天饮水量保持在1500-2000ml'
        })
        
        this.healthSuggestions.push({
          icon: '🥗',
          text: '多吃蔬菜水果，保持均衡饮食'
        })
      },
      
      exportData() {
        uni.showModal({
          title: '导出数据',
          content: '确定要导出当前时间段的数据分析报告吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: '正在导出...'
              })
              
              // 模拟导出操作
              setTimeout(() => {
                uni.hideLoading()
                uni.showToast({
                  title: '导出成功',
                  icon: 'success'
                })
              }, 1500)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .data-analysis-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    padding: 0 10rpx;
  }
  
  .back-button {
    width: 60rpx;
    height: 60rpx;
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
    color: #333;
  }
  
  .empty-space {
    width: 60rpx;
  }
  
  .time-filter {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 15rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .filter-item {
    flex: 1;
    text-align: center;
    padding: 25rpx;
    font-size: 30rpx;
    color: #666666;
    transition: all 0.3s ease;
  }
  
  .filter-item.active {
    background-color: #FFF9F2;
    color: #A67D4F;
    font-weight: bold;
  }
  
  .stats-cards {
    display: flex;
    margin-bottom: 30rpx;
    gap: 20rpx;
  }
  
  .stat-card {
    flex: 1;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
  }
  
  .stat-card:active {
    transform: scale(0.98);
  }
  
  .stat-value {
    font-size: 48rpx;
    font-weight: bold;
    color: #A67D4F;
    margin-bottom: 10rpx;
  }
  
  .stat-label {
    font-size: 26rpx;
    color: #999999;
  }
  
  .charts-section {
    margin-bottom: 40rpx;
  }
  
  .chart-card {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .chart-header {
    margin-bottom: 30rpx;
  }
  
  .chart-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .chart-subtitle {
    font-size: 24rpx;
    color: #999999;
  }
  
  .frequency-chart {
    height: 300rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding: 20rpx 0;
  }
  
  .frequency-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 60rpx;
  }
  
  .bar {
    width: 40rpx;
    background-color: #A67D4F;
    border-radius: 5rpx 5rpx 0 0;
    transition: height 0.5s ease;
  }
  
  .bar-label {
    font-size: 22rpx;
    color: #666666;
    margin-top: 10rpx;
  }
  
  .bar-value {
    font-size: 24rpx;
    color: #A67D4F;
    font-weight: bold;
    margin-bottom: 5rpx;
  }
  
  .time-distribution {
    display: flex;
    justify-content: space-around;
    padding: 30rpx 0;
  }
  
  .distribution-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .distribution-circle {
    background-color: #A67D4F;
    border-radius: 50%;
    margin-bottom: 15rpx;
    transition: all 0.3s ease;
  }
  
  .distribution-label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
  }
  
  .distribution-percent {
    font-size: 24rpx;
    color: #A67D4F;
    font-weight: bold;
  }
  
  .type-analysis {
    max-height: 500rpx;
    overflow-y: auto;
  }
  
  .type-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .type-item:last-child {
    border-bottom: none;
  }
  
  .type-icon {
    font-size: 48rpx;
    width: 60rpx;
    text-align: center;
    margin-right: 20rpx;
  }
  
  .type-info {
    flex: 1;
  }
  
  .type-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 5rpx;
  }
  
  .type-desc {
    font-size: 24rpx;
    color: #666;
  }
  
  .type-count {
    font-size: 32rpx;
    font-weight: bold;
    color: #A67D4F;
  }
  
  .status-stats {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
  }
  
  .status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .status-circle {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-bottom: 15rpx;
  }
  
  .status-label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
  }
  
  .status-value {
    font-size: 24rpx;
    color: #999999;
  }
  
  .regularity-analysis {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
  }
  
  .regularity-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    padding: 30rpx;
    border-radius: 15rpx;
    min-width: 200rpx;
  }
  
  .regularity-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .regularity-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #A67D4F;
  }
  
  .health-assessment {
    padding: 10rpx 0;
  }
  
  .assessment-score {
    text-align: center;
    margin-bottom: 30rpx;
  }
  
  .score-number {
    font-size: 80rpx;
    font-weight: bold;
    color: #A67D4F;
    margin-bottom: 10rpx;
  }
  
  .score-label {
    font-size: 28rpx;
    color: #666666;
  }
  
  .assessment-level {
    text-align: center;
    padding: 20rpx;
    border-radius: 15rpx;
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .level-1 {
    background-color: #E6F7E9;
    color: #52C41A;
  }
  
  .level-2 {
    background-color: #F6FFED;
    color: #73D13D;
  }
  
  .level-3 {
    background-color: #FFF7E6;
    color: #FAAD14;
  }
  
  .level-4 {
    background-color: #FFF1F0;
    color: #F5222D;
  }
  
  .level-5 {
    background-color: #FFF1F0;
    color: #FF4D4F;
  }
  
  .assessment-details {
    margin-bottom: 30rpx;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .detail-label {
    width: 140rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .detail-bar {
    flex: 1;
    height: 20rpx;
    background-color: #f0f0f0;
    border-radius: 10rpx;
    overflow: hidden;
    margin: 0 20rpx;
  }
  
  .detail-progress {
    height: 100%;
    background-color: #A67D4F;
    transition: width 0.5s ease;
  }
  
  .detail-value {
    width: 80rpx;
    font-size: 28rpx;
    color: #A67D4F;
    font-weight: bold;
    text-align: right;
  }
  
  .assessment-suggestions {
    margin-top: 20rpx;
  }
  
  .suggestion-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 10rpx;
  }
  
  .suggestion-icon {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    background-color: #A67D4F;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    margin-right: 20rpx;
  }
  
  .suggestion-text {
    font-size: 28rpx;
    color: #666666;
    flex: 1;
  }
  
  .export-button {
    background-color: #A67D4F;
    color: #FFFFFF;
    text-align: center;
    padding: 30rpx;
    border-radius: 15rpx;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .export-button:active {
    transform: scale(0.98);
  }
</style>