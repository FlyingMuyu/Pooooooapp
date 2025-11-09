<template>
  <view class="record-container">
    <!-- 导航栏 -->
    <view class="nav-tabs">
      <text class="nav-tab" :class="{ 'active': activeTab === 'history' }" @click="switchTab('history')">历史记录</text>
      <text class="nav-tab" :class="{ 'active': activeTab === 'analytics' }" @click="switchTab('analytics')">数据分析</text>
      <text class="nav-tab" :class="{ 'active': activeTab === 'badges' }" @click="switchTab('badges')">成就徽章</text>
    </view>
    
    <!-- 历史记录视图 -->
    <view v-if="activeTab === 'history'" class="history-view">
      <view class="history-tabs">
        <text class="history-tab" :class="{ 'active': historyTab === 'calendar' }" @click="switchHistoryTab('calendar')">日历视图</text>
        <text class="history-tab" :class="{ 'active': historyTab === 'list' }" @click="switchHistoryTab('list')">列表视图</text>
      </view>
      
      <!-- 日历视图 -->
      <view v-if="historyTab === 'calendar'" class="calendar-view">
        <view class="calendar-header">
          <image src="../../static/left_arrow.svg" @click="prevMonth" class="calendar-nav"></image>
          <text class="calendar-month">{{displayMonth}}</text>
          <image src="../../static/right_arrow.svg" @click="nextMonth" class="calendar-nav"></image>
        </view>
        <view class="calendar-week">
          <text class="week-day">日</text>
          <text class="week-day">一</text>
          <text class="week-day">二</text>
          <text class="week-day">三</text>
          <text class="week-day">四</text>
          <text class="week-day">五</text>
          <text class="week-day">六</text>
        </view>
        <view class="calendar-days">
          <view class="day-item" v-for="(day, index) in calendarDays" :key="index" @click="selectDate(day)">
            <text class="day-number" :class="{ 'has-record': day.hasRecord, 'current': day.isCurrent }">
              {{day.date}}
            </text>
          </view>
        </view>
        
        <!-- 选中日期记录详情 -->
        <view v-if="selectedDate" class="today-detail">
          <text class="detail-date">{{selectedDate.year}}年{{selectedDate.month}}月{{selectedDate.day}}日</text>
          
          <view v-if="selectedDate.records.length > 0" class="record-list">
            <view v-for="(record, index) in selectedDate.records" :key="index" class="record-item">
              <view class="record-time">{{record.time}}</view>
              <view class="record-info">
                <text class="record-type">型号: {{record.type}}型</text>
                <text class="record-duration">时长: {{record.duration}}分钟</text>
                <text class="record-feeling">感受: {{record.feeling}}</text>
              </view>
              <text v-if="record.notes" class="record-note">{{record.notes}}</text>
              <view class="record-actions">
                <text class="action-btn edit-btn" @click="editRecord(record)">编辑</text>
                <text class="action-btn delete-btn" @click="deleteRecord(record)">删除</text>
              </view>
            </view>
          </view>
          
          <view v-else class="no-record">
            <text>当天没有记录</text>
          </view>
        </view>
      </view>
      
      <!-- 列表视图 -->
      <view v-if="historyTab === 'list'" class="list-view">
        <view class="list-item" v-for="record in recordList" :key="record.id">
          <text class="list-date">{{record.date}}</text>
          <text class="list-time">{{record.time}}</text>
          <text class="list-type">型号: {{record.type}}型</text>
          <text class="list-duration">{{record.duration}}分钟</text>
          <text class="list-feeling">{{record.feeling}}</text>
        </view>
      </view>
    </view>
    
    <!-- 数据分析视图 -->
    <view v-else-if="activeTab === 'analytics'" class="analytics-view">
      <!-- 这里简化实现，实际应该导入图表组件 -->
      <text class="placeholder-text">数据分析页面</text>
      <button class="navigate-btn" @click="goToAnalytics">前往完整数据分析</button>
    </view>
    
    <!-- 成就徽章视图 -->
    <view v-else-if="activeTab === 'badges'" class="badges-view">
      <!-- 这里简化实现 -->
      <text class="placeholder-text">成就徽章页面</text>
      <button class="navigate-btn" @click="goToBadges">前往完整成就徽章</button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      
      return {
        activeTab: 'history',
        historyTab: 'calendar',
        currentYear: currentYear,
        currentMonth: currentMonth,
        displayMonth: `${currentYear}年${currentMonth}月`,
        calendarDays: [],
        recordList: [],
        selectedDate: null,
        records: [] // 存储所有记录
      }
    },
    onLoad() {
      this.loadRecords()
      this.generateCalendarDays()
      this.generateListData()
    },
    onShow() {
      // 每次页面显示时重新加载数据，确保数据是最新的
      this.loadRecords()
      this.generateCalendarDays()
      this.generateListData()
      
      // 如果有选中的日期，重新加载该日期的记录
      if (this.selectedDate) {
        this.updateSelectedDateRecords()
      }
    },
    methods: {
      switchTab(tab) {
        this.activeTab = tab
      },
      switchHistoryTab(tab) {
        this.historyTab = tab
      },
      // 从本地存储加载记录
      loadRecords() {
        try {
          const records = uni.getStorageSync('stoolRecords') || []
          this.records = records
          return records
        } catch (error) {
          console.error('加载记录失败:', error)
          return []
        }
      },
      // 保存记录到本地存储
      saveRecords(records) {
        try {
          uni.setStorageSync('stoolRecords', records)
          this.records = records
          return true
        } catch (error) {
          console.error('保存记录失败:', error)
          return false
        }
      },
      // 生成日历数据
      generateCalendarDays() {
        const days = []
        const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1)
        const lastDay = new Date(this.currentYear, this.currentMonth, 0)
        const startDay = firstDay.getDay()
        const daysInMonth = lastDay.getDate()
        
        // 添加上月剩余天数
        const prevMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1
        const prevYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear
        const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate()
        
        for (let i = startDay - 1; i >= 0; i--) {
          const dayNum = daysInPrevMonth - i
          const dateStr = prevYear + '-' + String(prevMonth).padStart(2, '0') + '-' + String(dayNum).padStart(2, '0')
          days.push({
            date: dayNum,
            hasRecord: this.records.some(r => r.date === dateStr),
            isCurrent: false,
            year: prevYear,
            month: prevMonth,
            fullDate: dateStr
          })
        }
        
        // 添加当月天数
        const today = new Date()
        const isCurrentMonth = today.getFullYear() === this.currentYear && today.getMonth() + 1 === this.currentMonth
        
        for (let i = 1; i <= daysInMonth; i++) {
          const isCurrent = isCurrentMonth && today.getDate() === i
          const dateStr = this.currentYear + '-' + String(this.currentMonth).padStart(2, '0') + '-' + String(i).padStart(2, '0')
          days.push({
            date: i,
            hasRecord: this.records.some(r => r.date === dateStr),
            isCurrent: isCurrent,
            year: this.currentYear,
            month: this.currentMonth,
            fullDate: dateStr
          })
          
          // 默认选中今天
          if (isCurrent) {
            this.selectDate(days[days.length - 1])
          }
        }
        
        // 添加下月补充天数
        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) {
          const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1
          const nextYear = this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear
          const dateStr = nextYear + '-' + String(nextMonth).padStart(2, '0') + '-' + String(i).padStart(2, '0')
          days.push({
            date: i,
            hasRecord: this.records.some(r => r.date === dateStr),
            isCurrent: false,
            year: nextYear,
            month: nextMonth,
            fullDate: dateStr
          })
        }
        
        this.calendarDays = days
      },
      // 生成列表数据
      generateListData() {
        // 按日期降序排序记录
        this.recordList = [...this.records]
          .sort((a, b) => {
            // 先按日期降序，再按时间降序
            if (a.date !== b.date) {
              return b.date.localeCompare(a.date)
            }
            return b.time.localeCompare(a.time)
          })
      },
      // 选择日期
      selectDate(day) {
        // 构建日期字符串：2023-06-15
        const dateStr = day.fullDate
        
        // 查找当天的所有记录
        const dayRecords = this.records
          .filter(record => record.date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)) // 按时间升序排序
        
        this.selectedDate = {
          year: day.year,
          month: day.month,
          day: day.date,
          fullDate: dateStr,
          records: dayRecords
        }
      },
      // 更新选中日期的记录
      updateSelectedDateRecords() {
        if (!this.selectedDate) return
        
        const dayRecords = this.records
          .filter(record => record.date === this.selectedDate.fullDate)
          .sort((a, b) => a.time.localeCompare(b.time))
          
        this.selectedDate.records = dayRecords
      },
      // 上一月
      prevMonth() {
        this.currentMonth--
        if (this.currentMonth < 1) {
          this.currentMonth = 12
          this.currentYear--
        }
        this.displayMonth = `${this.currentYear}年${this.currentMonth}月`
        this.generateCalendarDays()
      },
      // 下一月
      nextMonth() {
        this.currentMonth++
        if (this.currentMonth > 12) {
          this.currentMonth = 1
          this.currentYear++
        }
        this.displayMonth = `${this.currentYear}年${this.currentMonth}月`
        this.generateCalendarDays()
      },
      // 编辑记录
      editRecord(record) {
        // 将编辑的记录信息保存到全局临时数据中
        uni.setStorageSync('editingRecord', record)
        uni.navigateTo({
          url: '../addRecord/addRecord?edit=true'
        })
      },
      // 删除记录
      deleteRecord(record) {
        uni.showModal({
          title: '提示',
          content: '确定要删除这条记录吗？',
          success: (res) => {
            if (res.confirm) {
              // 从记录数组中删除指定记录
              const updatedRecords = this.records.filter(r => !(r.date === record.date && r.time === record.time))
              
              if (this.saveRecords(updatedRecords)) {
                // 重新生成视图数据
                this.generateCalendarDays()
                this.generateListData()
                
                // 如果当前查看的是被删除记录的日期，刷新详情
                if (this.selectedDate && this.selectedDate.fullDate === record.date) {
                  this.updateSelectedDateRecords()
                }
                
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
              } else {
                uni.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            }
          }
        })
      },
      goToAnalytics() {
        uni.navigateTo({
          url: '../dataAnalysis/dataAnalysis'
        })
      },
      goToBadges() {
        uni.navigateTo({
          url: '../badges/badges'
        })
      }
    }
  }
</script>

<style scoped>
  .record-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .nav-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 10rpx;
    margin-bottom: 30rpx;
  }
  
  .nav-tab {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    border-radius: 15rpx;
  }
  
  .nav-tab.active {
    background-color: #A67D4F;
    color: #FFFFFF;
  }
  
  .history-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 10rpx;
    margin-bottom: 30rpx;
  }
  
  .history-tab {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    border-radius: 15rpx;
  }
  
  .history-tab.active {
    background-color: #F0F0F0;
    color: #A67D4F;
  }
  
  .calendar-view {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .calendar-nav {
    width: 40rpx;
    height: 40rpx;
  }
  
  .calendar-month {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .calendar-week {
    display: flex;
    margin-bottom: 10rpx;
  }
  
  .week-day {
    flex: 1;
    text-align: center;
    font-size: 26rpx;
    color: #999999;
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;
    margin-bottom: 30rpx;
  }
  
  .day-item {
    text-align: center;
    padding: 15rpx 0;
  }
  
  .day-number {
    font-size: 28rpx;
  }
  
  .day-number.has-record {
    background-color: #FFF9F2;
    color: #A67D4F;
    padding: 5rpx 15rpx;
    border-radius: 50%;
  }
  
  .day-number.current {
    background-color: #A67D4F;
    color: #FFFFFF;
    padding: 5rpx 15rpx;
    border-radius: 50%;
  }
  
  .today-detail {
    margin-top: 30rpx;
  }
  
  .detail-date {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .record-item {
    background-color: #F8F8F8;
    padding: 20rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
  }
  
  .record-time {
    font-size: 30rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .record-clock, .record-type, .record-duration, .record-feeling {
    font-size: 26rpx;
    color: #666666;
    margin-right: 20rpx;
  }
  
  .record-note {
    font-size: 26rpx;
    color: #999999;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .record-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-btn {
    padding: 10rpx 30rpx;
    margin-left: 20rpx;
    font-size: 26rpx;
  }
  
  .edit-btn {
    color: #A67D4F;
  }
  
  .delete-btn {
    color: #FF6B6B;
  }
  
  .list-view {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }
  
  .list-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
  }
  
  .list-item:last-child {
    border-bottom: none;
  }
  
  .list-date {
    font-size: 30rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .list-time, .list-type, .list-duration, .list-feeling {
    font-size: 26rpx;
    color: #666666;
    margin-right: 20rpx;
  }
  
  .placeholder-text {
    text-align: center;
    font-size: 32rpx;
    color: #999999;
    margin: 50rpx 0;
  }
  
  .navigate-btn {
    background-color: #A67D4F;
    color: #FFFFFF;
    border-radius: 44rpx;
  }
</style>