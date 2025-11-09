<template>
  <view class="add-record-container">
    <!-- 时间设置 -->
    <view class="section">
      <text class="section-title">时间</text>
      <view class="time-container">
        <view class="time-item">
          <text class="time-label">日期</text>
          <picker mode="date" :value="currentDate" @change="dateChange" class="date-picker">
            <text class="picker-text">{{currentDate}}</text>
            <text class="picker-icon-text">📅</text>
          </picker>
        </view>
        <view class="time-item">
          <text class="time-label">时间</text>
          <picker mode="time" :value="currentTime" @change="timeChange" class="time-picker">
            <text class="picker-text">{{currentTime}}</text>
            <text class="picker-icon-text">🕐</text>
          </picker>
        </view>
      </view>
    </view>
    
    <!-- 持续时间 -->
    <view class="section">
      <text class="section-title">持续时间</text>
      <view class="duration-container">
        <input type="number" v-model="duration" class="duration-input">
        <text class="duration-unit">分钟</text>
        <slider min="1" max="60" :value="duration" @change="durationChange" class="duration-slider"></slider>
      </view>
    </view>
    
    <!-- 类型选择 -->
    <view class="section">
      <text class="section-title">类型（布里斯托表）</text>
      <text class="section-subtitle">选择最接近的粪便类型</text>
      <view class="type-grid">
        <view class="type-item" v-for="type in stoolTypes" :key="type.id" 
              :class="{ 'selected': selectedType === type.id }" @click="selectType(type.id)">
          <text class="type-emoji">{{type.emoji}}</text>
          <text class="type-name">类型{{type.id}}</text>
          <text class="type-desc">{{type.description}}</text>
        </view>
      </view>
    </view>
    
    <!-- 感受 -->
    <view class="section">
      <text class="section-title">感受</text>
      <view class="feelings">
        <text class="feeling-tag" :class="{ 'selected': selectedFeeling === '舒适' }" 
              @click="selectFeeling('舒适')">舒适</text>
        <text class="feeling-tag" :class="{ 'selected': selectedFeeling === '一般' }" 
              @click="selectFeeling('一般')">一般</text>
        <text class="feeling-tag" :class="{ 'selected': selectedFeeling === '不适' }" 
              @click="selectFeeling('不适')">不适</text>
        <text class="feeling-tag" :class="{ 'selected': selectedFeeling === '困难' }" 
              @click="selectFeeling('困难')">困难</text>
      </view>
    </view>
    
    <!-- 备注 -->
    <view class="section">
      <text class="section-title">备注</text>
      <textarea placeholder="添加备注信息（可选）" v-model="remark" class="remark-input"></textarea>
    </view>
    
    <!-- 保存按钮 -->
    <button class="save-button" @click="saveRecord">保存记录</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        currentDate: this.formatDate(new Date()),
        currentTime: this.formatTime(new Date()),
        duration: 5,
        selectedType: 4,
        selectedFeeling: '舒适',
        remark: '',
        friendId: null, // 好友ID，为好友记录时使用
        stoolTypes: [
          { id: 1, icon: '', description: '硬块状，难以排出', emoji: '💩' },
          { id: 2, icon: '', description: '香肠状但硬挺', emoji: '💩' },
          { id: 3, icon: '', description: '香肠状，表面有裂缝', emoji: '💩' },
          { id: 4, icon: '', description: '香肠状，光滑且软', emoji: '💩' },
          { id: 5, icon: '', description: '软团状，边缘清晰', emoji: '💩' },
          { id: 6, icon: '', description: '糊状，边缘模糊', emoji: '💩' },
          { id: 7, icon: '', description: '水样，无固体成分', emoji: '💧' },
          { id: 8, icon: '', description: '喷射状，强力排出', emoji: '💨' }
        ],
        editingRecord: null // 存储正在编辑的记录
      }
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
    },
    onLoad(options) {
      // 检查是否是编辑模式
      if (options.edit === 'true') {
        try {
          // 获取正在编辑的记录
          const editingRecord = uni.getStorageSync('editingRecord')
          if (editingRecord) {
            this.editingRecord = editingRecord
            // 填充表单数据
            this.currentDate = editingRecord.date || this.currentDate
            this.currentTime = editingRecord.time || this.currentTime
            this.duration = editingRecord.duration || 5
            this.selectedType = editingRecord.type || 4
            this.selectedFeeling = editingRecord.feeling || '舒适'
            this.remark = editingRecord.notes || ''
            // 清除临时存储的数据
            uni.removeStorageSync('editingRecord')
          }
        } catch (error) {
          console.error('加载编辑数据失败:', error)
        }
      }
      
      // 检查是否是为好友记录
      if (options.friendId) {
        this.friendId = options.friendId
        // 显示为好友记录的提示
        uni.showToast({
          title: '为好友添加记录',
          icon: 'none'
        })
      }
    },
    methods: {
      formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      },
      dateChange(e) {
        this.currentDate = e.detail.value
      },
      timeChange(e) {
        this.currentTime = e.detail.value
      },
      durationChange(e) {
        this.duration = e.detail.value
      },
      selectType(typeId) {
        this.selectedType = typeId
      },
      selectFeeling(feeling) {
        this.selectedFeeling = feeling
      },
      saveRecord() {
        // 构建记录对象
        const record = {
          id: this.editingRecord ? this.editingRecord.id : Date.now(), // 编辑模式保留原ID
          date: this.currentDate,
          friendId: this.friendId, // 好友ID，如果是为好友记录的话
          time: this.currentTime,
          duration: this.duration,
          type: this.selectedType,
          feeling: this.selectedFeeling,
          notes: this.remark, // 使用notes字段保持一致性
          createTime: this.editingRecord ? this.editingRecord.createTime : new Date().getTime()
        }
        
        try {
          // 从本地存储获取现有记录
          let records = [];
          try {
            records = uni.getStorageSync('stoolRecords') || [];
          } catch (e) {
            console.error('获取记录失败:', e);
            records = [];
          }
          
          // 判断是添加新记录还是更新现有记录
          if (this.editingRecord) {
            // 更新现有记录
            const index = records.findIndex(r => 
              r.date === this.editingRecord.date && r.time === this.editingRecord.time
            );
            
            if (index !== -1) {
              records[index] = record;
            } else {
              // 如果没有找到记录，就添加新记录
              records.push(record);
            }
          } else {
            // 添加新记录
            records.push(record);
          }
          
          // 保存记录到本地存储
          try {
            uni.setStorageSync('stoolRecords', records);
            const success = true;
            
            // 显示提示
            uni.showToast({
              title: this.editingRecord ? '记录已更新' : '记录已保存',
              icon: 'success',
              duration: 2000
            });
            
            // 更新成就数据
            this.updateAchievements();
            
            // 延迟返回，让用户看到提示
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } catch (e) {
            console.error('保存数据失败:', e);
            uni.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            });
          }
        } catch (e) {
          console.error('保存记录异常:', e);
          // 兜底方案
          uni.showToast({
            title: '保存失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      
      // 更新成就数据
      updateAchievements() {
        try {
          // 获取所有记录
          let records = [];
          try {
            records = uni.getStorageSync('stoolRecords') || [];
          } catch (e) {
            console.error('获取记录失败:', e);
            return;
          }
          
          // 获取现有成就
          let achievements = [];
          try {
            achievements = uni.getStorageSync('achievements') || [];
          } catch (e) {
            console.error('获取成就失败:', e);
            achievements = [];
          }
          
          // 这里可以添加成就判断逻辑
          // 例如连续打卡、总记录数等
          
          // 保存成就数据
          try {
            uni.setStorageSync('achievements', achievements);
          } catch (e) {
            console.error('保存成就数据失败:', e);
          }
        } catch (e) {
          console.error('更新成就异常:', e);
        }
      }
    }
  }
</script>

<style scoped>
  .add-record-container {
    padding: 30rpx;
    background-color: #F8F8F8;
    min-height: 100vh;
  }
  
  .section {
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .section-subtitle {
    font-size: 26rpx;
    color: #999999;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .time-container {
    display: flex;
    justify-content: space-between;
  }
  
  .time-item {
    flex: 1;
  }
  
  .time-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .date-picker, .time-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background-color: #F8F8F8;
    border-radius: 10rpx;
  }
  
  .picker-text {
    font-size: 28rpx;
  }
  
  .picker-icon-text {
    font-size: 36rpx;
  }
  
  .duration-container {
    display: flex;
    align-items: center;
  }
  
  .duration-input {
    width: 100rpx;
    height: 60rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 10rpx;
    text-align: center;
    margin-right: 10rpx;
  }
  
  .duration-unit {
    font-size: 28rpx;
    color: #666666;
    margin-right: 20rpx;
  }
  
  .duration-slider {
    flex: 1;
  }
  
  .type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }
  
  .type-item {
    background-color: #F8F8F8;
    padding: 20rpx;
    border-radius: 10rpx;
    text-align: center;
    border: 2rpx solid transparent;
  }
  
  .type-item.selected {
    border-color: #A67D4F;
    background-color: #FFF9F2;
  }
  
  .type-emoji {
    font-size: 60rpx;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .type-name {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 5rpx;
    display: block;
  }
  
  .type-desc {
    font-size: 24rpx;
    color: #999999;
  }
  
  .feelings {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }
  
  .feeling-tag {
    padding: 15rpx 30rpx;
    background-color: #F8F8F8;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
  
  .feeling-tag.selected {
    background-color: #A67D4F;
    color: #FFFFFF;
  }
  
  .remark-input {
    width: 100%;
    height: 200rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 10rpx;
    padding: 20rpx;
    box-sizing: border-box;
  }
  
  .save-button {
    width: 100%;
    height: 88rpx;
    background-color: #A67D4F;
    color: #FFFFFF;
    font-size: 32rpx;
    border-radius: 44rpx;
    margin-top: 40rpx;
  }
</style>