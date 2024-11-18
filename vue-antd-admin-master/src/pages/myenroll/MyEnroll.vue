<template>
  <div>
    <a-card
        style="margin-top: 20px"
        :bordered="false"
    >
      <a-list size="large">
        <a-list-item v-for="item in enroll" :key="item.id">
          <a-list-item-meta
              :title="item.studentName"
              :description="item.description"
          >
            <a slot="title">AliPay</a>
          </a-list-item-meta>
          <div slot="actions">
            <a v-if="item.is_passed === 0" style="margin-right: 8px; color: #808080">待审批</a>
            <a v-if="item.is_passed === 1" style="color: #B22222;">未通过</a>
            <a v-if="item.is_passed === 2">已通过</a>
            <a v-if="item.is_passed === 0" @click="deleteEnroll(item.id)">取消报名</a>
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
        const response = await instance.post(`/iClub/getPersonalEnrolls`, {studentId: this.user.id});
        this.enroll = response.data.data;
      } catch (error) {
        console.error('获取报名记录时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteEnroll(id) {
      this.loading = true;
      try {
        const response = await instance.post(`/iClub/deletePersonalEnrolls`, {enrollId: id});
        if (response.data.code === 0) {
          this.enroll = this.enroll.filter(item => item.id !== id);
          this.$message.success('取消报名成功', 3);
        }
        else {
          console.error('取消报名时出错');
        }
      } catch (error) {
        console.error('取消报名时出错:', error);
      } finally {
        this.loading = false;
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
