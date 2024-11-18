<template>
  <div>
    <a-card
        style="margin-top: 20px"
        :bordered="false"
    >
      <a-list v-if="this.roles === 'staff'" size="large">
        <a-list-item v-for="item in enroll" :key="item.id">
          <a-list-item-meta
              :title="item.studentName"
              :description="item.description"
          >
            <a slot="title">AliPay</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="approve_staff(item.id)" style="margin-right: 8px;">批准</a>
            <a @click="reject_staff(item.id)" style="color: #B22222;">拒绝</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>社团</span>
              <p>{{item.clubName}}</p>
            </div>
            <div class="list-content-item">
              <span>报名时间</span>
              <p>{{item.create_time}}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>

      <a-list v-if="this.roles === 'admin'" size="large">
        <a-list-item v-for="item in activity" :key="item.id">
          <a-list-item-meta
              :title="item.title"
              :description="item.content"
          >
            <a slot="title">{{item.title}}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="approve_admin(item.id)" style="margin-right: 8px;">批准</a>
            <a @click="reject_admin(item.id)" style="color: #B22222;">拒绝</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>社团</span>
              <p>{{item.club_name}}</p>
            </div>
            <div class="list-content-item">
              <span>活动时间</span>
              <p>{{item.start_time}} - {{item.end_time}}</p>
            </div>
            <div class="list-content-item">
              <span>活动地点</span>
              <p>{{item.venue}}</p>
            </div>
            <div class="list-content-item">
              <span>申请时间</span>
              <p>{{item.time}}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'StandardList',
  computed: {
    ...mapGetters('account', ['user','roles']),
  },
  data() {
    return {
      enroll: [
        {
          id: '12',
          studentId: '2',
          studentName: 'herry',
          clubId: '1',
          clubName: '凌峰社',
          description: '我很棒',
          create_time: '2024-11-4',
          is_passed: 0
        }
      ],
      activity: [
        {
          id: '1',
          time: '2024-09-10',
          club_name: '凌峰社',
          title: '爬山',
          content: '爬西山',
          start_time: '2024-09-10',
          end_time: '2024-09-10',
          venue: '西山',
          picture_id: ''
        }
      ],
      loading: false
    }
  },
  mounted() {
    if (this.roles === 'staff') {
      this.fetchData_staff();
    } else {
      this.fetchData_admin();
    }
  },
  methods: {
    async fetchData_staff() {
      this.loading = true;
      try {
        const response = await instance.post(`/iClub/getEnrolls`, {staffId: this.user.id});
        this.enroll = response.data.data;
      } catch (error) {
        console.error('获取报名记录时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchData_admin() {
      this.loading = true;
      try {
        const response = await instance.get(`/iClub/getApplies`);
        this.activity = response.data.data;
      } catch (error) {
        console.error('获取活动申请记录时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    async approve_staff(id) {
      const item = this.enroll.find(enrollment => enrollment.id === id);
      if (item) {
        try {
          await instance.post('/iClub/auditEnroll', {
            staffId: this.user.id,
            enrollId: id,
            action: 'pass'
          })
          this.enroll = this.enroll.filter(enrollment => enrollment.id !== id);
          this.$message.success(`成功批准 ${item.studentName} 的报名`, 3);
        } catch (error) {
          this.$message.error('网络错误，请稍后重试', 3);
        }
      }
    },
    async reject_staff(id) {
      const item = this.enroll.find(enrollment => enrollment.id === id);
      if (item) {
        try {
          await instance.post('/iClub/auditEnroll', {
            staffId: this.user.id,
            enrollId: id,
            action: 'refuse'
          })
          this.enroll = this.enroll.filter(enrollment => enrollment.id !== id);
          this.$message.success(`成功拒绝 ${item.studentName} 的报名`, 3);
        } catch (error) {
          this.$message.error('网络错误，请稍后重试', 3);
        }
      }
    },
    async approve_admin(id) {
      const item = this.activity.find(activity => activity.id === id);
      if (item) {
        try {
          await instance.post('/iClub/auditApply', {
            applyId: id,
            action: 'pass'
          })
          this.activity = this.activity.filter(activity => activity.id !== id);
          this.$message.success(`成功批准 ${item.club_name} 的申请`, 3);
        } catch (error) {
          this.$message.error('网络错误，请稍后重试', 3);
        }
      }
    },
    async reject_admin(id) {
      const item = this.activity.find(activity => activity.id === id);
      if (item) {
        try {
          await instance.post('/iClub/auditApply', {
            applyId: id,
            action: 'refuse'
          })
          this.activity = this.activity.filter(activity => activity.id !== id);
          this.$message.success(`成功拒绝 ${item.club_name} 的申请`, 3);
        } catch (error) {
          this.$message.error('网络错误，请稍后重试', 3);
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list-content-item{
  color: @text-color-second;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span{
    line-height: 20px;
  }
  p{
    margin: 4px 0 0;
    line-height: 22px;
  }
}
</style>
