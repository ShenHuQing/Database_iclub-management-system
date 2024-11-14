<template>
  <div class="activity-container">
    <div class="header">
      <!-- 左侧活动图片及按钮 -->
      <div class="activity-left">
        <div class="activity-image">
          <img v-if="activity.picture_id" :src="activity.picture_id" alt="活动图片" style="max-width: 100%; height: auto;" />
          <span v-else>无图片</span>
        </div>

        <div class="activity-actions" v-if="showButton">
          <a-button-group style="margin-top: 8px;">
            <a-button v-if="isBeforeStart" type="primary" @click="handleSignUp">报名</a-button>
            <a-button v-else-if="isOngoing && isSignedUp" type="primary" @click="handleCheckIn">签到</a-button>
          </a-button-group>
        </div>
      </div>

      <!-- 右侧活动详情 -->
      <div class="activity-right">
        <a-card :bordered="false" class="activity-detail-card">
          <div class="detail-content">
            <!-- 左侧小标题及内容 -->
            <div class="detail-section">
              <h3 class="detail-title">活动信息</h3>
              <p><strong>举办社团:</strong> {{ activity.club_name }}</p>
              <p><strong>活动主题:</strong> {{ activity.title }}</p>
              <p><strong>活动内容:</strong> {{ activity.content }}</p>
            </div>
            <!-- 右侧小标题及内容 -->
            <div class="detail-section">
              <h3 class="detail-title">活动时间及地点</h3>
              <p><strong>开始日期:</strong> {{ activity.start_time }}</p>
              <p><strong>结束日期:</strong> {{ activity.end_time }}</p>
              <p><strong>活动场地:</strong> {{ activity.venue }}</p>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <!-- 打卡接龙标题 -->
    <div class="check-in-title">
      接龙框
    </div>
    <!--打卡接龙-->
    <div>
      <div class="attendee-list">
        <div
            v-for="(participant, index) in participants"
            :key="index"
            :class="['attendee', { 'checked-in': participant.checkedIn} ]"
        >
          {{participant.name}} (ID: {{participant.id}})
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios'
import {mapGetters} from "vuex";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'EventDetail',
  computed: {
    ...mapGetters('account', ['user','roles']),
    isBeforeStart() {
      const currentTime = new Date();
      const startTime = new Date(this.activity.start_time);
      return currentTime < startTime;
    },
    isOngoing() {
      const currentTime = new Date();
      const startTime = new Date(this.activity.start_time);
      const endTime = new Date(this.activity.end_time);
      return currentTime >= startTime && currentTime <= endTime;
    },
    isSignedUp() {
      return this.participants.some(participant => participant.id === this.user.id);
    },
    showButton() {
      return this.joined && (this.isBeforeStart || (this.isOngoing && this.isSignedUp));
    }
  },
  data() {
    return {
      activityId: 1,
      joined: false,
      activity: {
        id: 1,
        time:'',
        club_name:'',
        title: '编程马拉松',
        content: '不理解是干啥的',
        start_time: '2023-05-15 16:00',
        end_time: '2023-05-15 17:00',
        venue: '地点',
        picture_id: require('../../assets/img/preview.png'),
        is_passed: 0
      },
      participants: [
        {
          name: '张三',
          id: '123456',
          checkedIn: false
        }
      ]
    }
  },
  mounted() {
    this.activityId = this.$route.query.activityId;
    this.joined = this.$route.query.joined;
    this.fetchActivityDetails();
  },
  methods: {
    fetchActivityDetails() {
      instance.post(`/iClub/activityDetail`, { id: this.activityId })
          .then(response => {
            const data = response.data;
            this.activity = data.data;
          })
          .catch(error => {
            console.error('Error fetching activity details:', error);
          });
    },
    handleSignUp() {
      const alreadySignedUp = this.participants.some(participant => participant.id === this.user.id);
      if (alreadySignedUp) return;
      const participant = {
        name: this.user.name,
        id: this.user.id,
        checkedIn: false
      }
      instance.post(`/iClub/activityEnroll`, { studentId: this.user.id, activityId: this.activityId})
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              this.$message.success('报名成功，请等待活动开始时间后签到', 3);
              this.participants.push(participant);
            } else {
              this.$message.error('报名失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('Error enrolling activity:', error);
          });
    },
    handleCheckIn() {
      const participant = this.participants.find(a => a.id === this.user.id);
      if (participant && !participant.checkedIn) {
        instance.post(`/iClub/signIn`, { studentId: this.user.id, activityId: this.activityId})
            .then(response => {
              const res = response.data;
              if (res.code === 0) {
                this.$message.success('签到成功，积分成功加100', 3);
                participant.checkedIn = true;
              } else {
                this.$message.error('签到失败，请重试', 3);
              }
            })
            .catch(error => {
              console.error('Error sign in activity:', error);
            });
      }
    }
  }
}
</script>

<style scoped>
.activity-container {
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 居中对齐 */
  padding: 16px;
}

.header {
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

.activity-left {
  flex: 1;
  max-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-image {
  width: 100%;
  margin-bottom: 8px;
}

.activity-right {
  flex: 2;
  display: flex;
  align-items: center;
}

.activity-detail-card {
  width: 100%;
  padding: 16px;
  background-color: #f9f9f9;
}

.detail-content {
  display: flex;
  gap: 24px;
}

.detail-section {
  flex: 1;
}

.detail-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.detail-section p {
  margin: 4px 0;
  color: #666;
}

.attendees {
  margin-top: 32px;
}

.attendee-list {
  margin-top: 15px; /* 给打卡接龙增加一些距离 */
  padding: 16px; /* 增加内边距 */
  background-color: #fff; /* 背景色为白色 */
  border-radius: 8px; /* 边框圆角 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* 更自然的阴影效果 */
  width: 1100px;
}

.attendee {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #ccc; /* 初始状态为灰色 */
  color: #fff;
  font-weight: bold;
  display: inline-block; /* 让每个卡片独立展示 */
  margin: 4px 8px; /* 添加间距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 更自然的阴影效果 */
}

.checked-in {
  background-color: #4caf50; /* 已签到为绿色 */
}

.check-in-title {
  text-align: center; /* 让标题居中 */
  font-size: 15px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体加粗 */
  color: #333; /* 标题颜色 */
  margin-bottom: 3px; /* 和下方内容的间距 */
  margin-top: 10px;
  background-color: #f4f4f4; /* 背景色为浅灰色 */
  padding: 10px 0; /* 内边距使标题框更大 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
  width: 200px; /* 固定宽度 */
}
</style>