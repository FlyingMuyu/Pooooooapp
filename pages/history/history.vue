<template>
  <view class="history-container">
    <view class="page-header">
      <view class="back-button" @click="navigateBack">
        <image src="../../static/back.svg" class="back-icon"></image>
      </view>
      <text class="page-title">历史记录</text>
      <view class="empty-space"></view>
    </view>
    
    <!-- 视图切换 -->
    <view class="view-tabs">
      <view class="tab" :class="{ active: currentView === 'calendar' }" @click="switchView('calendar')">
        日历视图
      </view>
      <view class="tab" :class="{ active: currentView === 'list' }" @click="switchView('list')">
        列表视图
      </view>
    </view>
    
    <!-- 日历视图 -->
    <view v-if="currentView === 'calendar'" class="calendar-view">
      <!-- 月份切换 -->
      <view class="month-navigator">
        <image src="../../static/left_arrow.svg" class="nav-arrow" @click="prevMonth"></image>
        <text class="current-month">{{ currentYear }}年{{ currentMonth }}月</text>
        <image src="../../static/right_arrow.svg" class="nav-arrow" @click="nextMonth"></image>
      </view>
      
      <!-- 星期标题 -->
      <view class="week-header">
        <text class="week-day">日</text>
        <text class="week-day">一</text>
        <text class="week-day">二</text>
        <text class="week-day">三</text>
        <text class="week-day">四</text>
        <text class="week-day">五</text>
        <text class="week-day">六</text>
      </view>
      
      <!-- 日历格子 -->
      <view class="calendar-grid">
        <view v-for="(day, index) in calendarDays" :key="index" class="day-cell" :class="{ 
          'other-month': !day.isCurrentMonth, 
          'has-record': day.hasRecord, 
          'current-day': day.isToday 
        }" @click="selectDate(day)">
          <text class="day-number">{{ day.day }}</text>
          <view v-if="day.hasRecord" class="record-indicator"></view>
        </view>
      </view>
      
      <!-- 选中日期详情 -->
      <view v-if="selectedDate" class="date-detail">
        <view class="detail-header">
          <text class="detail-date">{{ selectedDate.year }}年{{ selectedDate.month }}月{{ selectedDate.day }}日</text>
          <text class="detail-week">{{ getWeekDay(selectedDate.weekDay) }}</text>
        </view>
        
        <view v-if="selectedDate.records.length > 0" class="record-list">
          <view v-for="(record, index) in selectedDate.records" :key="index" class="record-item">
            <view class="record-time">{{ record.time }}</view>
            <view class="record-info">
              <view class="record-type">
                <text class="type-label">型号:{{ record.type }}</text>
              </view>
              <view class="record-duration">时长:{{ record.duration }}分钟</view>
              <view class="record-feeling">
                <text class="feeling-label" :class="'feeling-' + record.feeling">{{ record.feeling }}</text>
              </view>
            </view>
            <view class="record-notes">{{ record.notes }}</view>
            <view class="record-actions">
              <text class="action-btn edit" @click="editRecord(record)">编辑</text>
              <text class="action-btn delete" @click="deleteRecord(record)">删除</text>
            </view>
          </view>
        </view>
        
        <view v-else class="no-record">
          <text>当天没有记录</text>
        </view>
      </view>
    </view>
    
    <!-- 列表视图 -->
    <view v-if="currentView === 'list'" class="list-view">
      <view v-for="monthData in listData" :key="monthData.month" class="month-section">
        <text class="month-title">{{ monthData.month }}月</text>
        <view v-for="record in monthData.records" :key="record.id" class="list-record-item">
          <view class="list-record-header">
            <text class="list-record-date">{{ record.date }}</text>
            <text class="list-record-time">{{ record.time }}</text>
          </view>
          <view class="list-record-content">
            <view class="list-record-info">
              <text class="list-record-type">型号:{{ record.type }}</text>
              <text class="list-record-duration">{{ record.duration }}分钟</text>
              <text class="list-record-feeling" :class="'feeling-' + record.feeling">{{ record.feeling }}</text>
            </view>
          </view>
          <view class="list-record-actions">
            <text class="action-btn edit" @click="editRecord(record)">编辑</text>
            <text class="action-btn delete" @click="deleteRecord(record)">删除</text>
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
        currentView: 'calendar',
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        calendarDays: [],
        selectedDate: null,
        listData: [],
        records: [] // 存储所有记录
      }
    },
    onLoad() {
      this.loadRecords()
      this.generateCalendar()
      this.generateListData()
    },
    onShow() {
      // 检查登录状态
      const userInfo = uni.getStorageSync('userInfo');
      if (!userInfo) {
        // 未登录，提示并返回上一页
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
        return;
      }
      
      // 已登录，每次页面显示时重新加载数据，确保数据是最新的
      this.loadRecords()
      this.generateCalendar()
      this.generateListData()
    },
    methods: {
      navigateBack() {
        uni.navigateBack()
      },
      switchView(view) {
        this.currentView = view
      },
      prevMonth() {
        this.currentMonth--
        if (this.currentMonth < 1) {
          this.currentMonth = 12
          this.currentYear--
        }
        this.generateCalendar()
      },
      nextMonth() {
        this.currentMonth++
        if (this.currentMonth > 12) {
          this.currentMonth = 1
          this.currentYear++
        }
        this.generateCalendar()
      },
      generateCalendar() {
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
            day: dayNum,
            isCurrentMonth: false,
            hasRecord: this.records.some(r => r.date === dateStr),
            isToday: false
          })
        }
        
        // 添加当月天数
        const today = new Date()
        const isCurrentMonth = today.getFullYear() === this.currentYear && today.getMonth() + 1 === this.currentMonth
        
        for (let i = 1; i <= daysInMonth; i++) {
          const isToday = isCurrentMonth && today.getDate() === i
          const dateStr = this.currentYear + '-' + String(this.currentMonth).padStart(2, '0') + '-' + String(i).padStart(2, '0')
          days.push({
            day: i,
            isCurrentMonth: true,
            hasRecord: this.records.some(r => r.date === dateStr),
            isToday: isToday,
            year: this.currentYear,
            month: this.currentMonth,
            weekDay: (startDay + i - 1) % 7
          })
          
          if (isToday) {
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
            day: i,
            isCurrentMonth: false,
            hasRecord: this.records.some(r => r.date === dateStr),
            isToday: false
          })
        }
        
        this.calendarDays = days
      },
      generateListData() {
        // 按月份分组记录
        const monthMap = {}
        
        this.records.forEach(record => {
          // 解析日期格式：2023-06-15
          const dateParts = record.date.split('-')
          const year = dateParts[0]
          const month = dateParts[1] // 包含前导零
          const day = dateParts[2]
          
          // 只显示当前年份的记录
          if (year === String(this.currentYear)) {
            const monthNum = month.replace(/^0/, '') // 移除前导零
            
            if (!monthMap[monthNum]) {
              monthMap[monthNum] = []
            }
            
            monthMap[monthNum].push({
              ...record,
              date: monthNum + '月' + day + '日'
            })
          }
        })
        
        // 转换为数组并按月份降序排序
        this.listData = Object.keys(monthMap)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map(month => ({
            month: month,
            records: monthMap[month].sort((a, b) => {
              // 按日期和时间降序排序
              return b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
            })
          }))
      },
      selectDate(day) {
        if (!day.isCurrentMonth) return
        
        // 构建日期字符串：2023-06-15
        const dateStr = day.year + '-' + String(day.month).padStart(2, '0') + '-' + String(day.day).padStart(2, '0')
        
        // 查找当天的所有记录
        const dayRecords = this.records
          .filter(record => record.date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)) // 按时间升序排序
        
        this.selectedDate = {
          year: day.year,
          month: day.month,
          day: day.day,
          weekDay: day.weekDay,
          records: dayRecords
        }
      },
      getWeekDay(weekDay) {
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return days[weekDay]
      },
      loadRecords() {
        // 从本地存储加载记录
        const records = uni.getStorageSync('stoolRecords') || []
        this.records = records
      },
      
      saveRecords(records) {
        // 保存记录到本地存储
        uni.setStorageSync('stoolRecords', records)
        this.records = records
      },
      
      editRecord(record) {
        // 将编辑的记录信息保存到全局临时数据中，方便在addRecord页面使用
        uni.setStorageSync('editingRecord', record)
        uni.navigateTo({
          url: '../addRecord/addRecord?edit=true'
        })
      },
      
      deleteRecord(record) {
        uni.showModal({
          title: '提示',
          content: '确定要删除这条记录吗？',
          success: (res) => {
            if (res.confirm) {
              // 从记录数组中删除指定记录
              const updatedRecords = this.records.filter(r => !(r.date === record.date && r.time === record.time))
              this.saveRecords(updatedRecords)
              
              // 重新生成视图数据
              this.generateCalendar()
              this.generateListData()
              
              // 如果当前查看的是被删除记录的日期，刷新详情
              if (this.selectedDate && 
                  this.selectedDate.year + '-' + 
                  String(this.selectedDate.month).padStart(2, '0') + '-' + 
                  String(this.selectedDate.day).padStart(2, '0') === record.date) {
                this.selectDate(this.selectedDate)
              }
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .history-container {
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
  
  .view-tabs {
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
  
  /* 日历视图样式 */
  .calendar-view {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }
  
  .month-navigator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
  }
  
  .nav-arrow {
    width: 40rpx;
    height: 40rpx;
  }
  
  .current-month {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .week-header {
    display: flex;
    margin-bottom: 20rpx;
  }
  
  .week-day {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #999999;
  }
  
  .calendar-grid {
    display: flex;
    flex-wrap: wrap;
  }
  
  .day-cell {
    width: 14.285%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    position: relative;
  }
  
  .day-number {
    font-size: 30rpx;
    margin-bottom: 5rpx;
  }
  
  .day-cell.other-month .day-number {
    color: #CCCCCC;
  }
  
  .day-cell.current-day .day-number {
    color: #A67D4F;
    font-weight: bold;
  }
  
  .record-indicator {
    width: 8rpx;
    height: 8rpx;
    background-color: #A67D4F;
    border-radius: 50%;
  }
  
  .date-detail {
    margin-top: 30rpx;
    padding-top: 30rpx;
    border-top: 1rpx solid #F0F0F0;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }
  
  .detail-date {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .detail-week {
    font-size: 28rpx;
    color: #999999;
  }
  
  .record-item {
    background-color: #F8F8F8;
    border-radius: 10rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
  }
  
  .record-time {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
  }
  
  .record-info {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10rpx;
  }
  
  .record-type, .record-duration {
    margin-right: 20rpx;
    font-size: 28rpx;
    color: #333333;
  }
  
  .record-feeling {
    margin-top: 10rpx;
  }
  
  .feeling-label {
    padding: 5rpx 15rpx;
    border-radius: 15rpx;
    font-size: 24rpx;
  }
  
  .feeling-舒适 {
    background-color: #E6F7E9;
    color: #52C41A;
  }
  
  .feeling-一般 {
    background-color: #FFF7E6;
    color: #FAAD14;
  }
  
  .feeling-不适 {
    background-color: #FFF1F0;
    color: #F5222D;
  }
  
  .record-notes {
    font-size: 26rpx;
    color: #666666;
    margin-bottom: 10rpx;
  }
  
  .record-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-btn {
    font-size: 26rpx;
    margin-left: 30rpx;
  }
  
  .action-btn.edit {
    color: #1890FF;
  }
  
  .action-btn.delete {
    color: #F5222D;
  }
  
  .no-record {
    text-align: center;
    padding: 40rpx 0;
    color: #999999;
    font-size: 28rpx;
  }
  
  /* 列表视图样式 */
  .list-view {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
  }
  
  .month-section {
    margin-bottom: 30rpx;
  }
  
  .month-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #A67D4F;
  }
  
  .list-record-item {
    border-bottom: 1rpx solid #F0F0F0;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
  }
  
  .list-record-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .list-record-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
  }
  
  .list-record-date {
    font-size: 30rpx;
    font-weight: bold;
  }
  
  .list-record-time {
    font-size: 28rpx;
    color: #666666;
  }
  
  .list-record-content {
    margin-bottom: 10rpx;
  }
  
  .list-record-info {
    display: flex;
    flex-wrap: wrap;
  }
  
  .list-record-type, .list-record-duration {
    margin-right: 20rpx;
    font-size: 28rpx;
    color: #333333;
  }
  
  .list-record-feeling {
    padding: 5rpx 15rpx;
    border-radius: 15rpx;
    font-size: 24rpx;
    margin-top: 10rpx;
  }
  
  .list-record-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>