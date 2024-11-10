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
            <a @click="approve(item.id)" style="margin-right: 8px;">批准</a>
            <a @click="reject(item.id)">拒绝</a>
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
<!--            <div class="list-content-item">-->
<!--              <a-progress :percent="item.approvalStatus ? 100 : 0" style="width: 180px" />-->
<!--            </div>-->
          </div>
        </a-list-item>
      </a-list>

      <a-list v-if="this.roles === 'admin'" size="large">
        <a-list-item v-for="item in activity" :key="item.id">
          <a-list-item-meta
              :title="item.studentName"
              :description="item.description"
          >
            <a slot="title">AliPay</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="approve(item.id)" style="margin-right: 8px;">批准</a>
            <a @click="reject(item.id)">拒绝</a>
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
            <!--            <div class="list-content-item">-->
            <!--              <a-progress :percent="item.approvalStatus ? 100 : 0" style="width: 180px" />-->
            <!--            </div>-->
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
          create_time: '2024-11-4'
        }
      ],
      activity: [
        {
          id: '',
          time: '',
          club_name: '',
          title: '',
          content: '',
          start_time: '',
          end_time: '',
          venue: '',
          picture_id: ''
        }
      ],
      loading: false
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
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
    async approve(id) {
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
    async reject(id) {
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
