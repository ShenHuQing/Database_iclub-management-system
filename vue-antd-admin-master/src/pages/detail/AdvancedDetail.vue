<template>
  <page-layout :title="activity.title" logo="https://example.com/your-logo.png">
    <detail-list size="small" :col="2" slot="headerContent">
      <!-- 活动日期 -->
      <detail-list-item term="活动日期">{{ activity.time }}</detail-list-item>
      <!-- 开始日期 -->
      <detail-list-item term="开始日期">{{ activity.start_time }}</detail-list-item>
      <!-- 结束日期 -->
      <detail-list-item term="结束日期">{{ activity.end_time }}</detail-list-item>
      <!-- 活动内容 -->
      <detail-list-item term="活动内容">{{ activity.content }}</detail-list-item>
      <!-- 活动场地 -->
      <detail-list-item term="活动场地">{{ activity.venue }}</detail-list-item>
      <!-- 图片显示 -->
      <detail-list-item term="活动图片">
        <img v-if="activity.picture_id" :src="activity.picture_id" alt="活动图片" style="max-width: 100%; height: auto;"/>
        <span v-else>无图片</span>
      </detail-list-item>
    </detail-list>

    <template slot="action">
      <a-button-group style="margin-right: 8px;">
        <a-button type="primary" @click="handleSignUp" :disabled="isAlreadyRegistered">报名</a-button>
        <a-button type="primary" @click="handleCheckIn" :disabled="isAlreadyCheckedIn">签到</a-button>
      </a-button-group>
    </template>

    <a-card :bordered="false" title="活动流程">
      <a-steps :current="1" progress-dot :direction="isMobile ? 'vertical' : 'horizontal'">
        <a-step title="活动报名">
          <a-step-item-group :align="isMobile ? 'left' : 'center'" slot="description">
            <a-step-item link="/dashboard/workplace" title="报名负责人" icon="dingding-o"/>
            <a-step-item title="2023-10-01 09:00"/>
            <a-table :data-source="registrationData" :columns="tableColumns"></a-table>
          </a-step-item-group>
        </a-step>
        <a-step title="活动进行">
          <a-step-item-group :align="isMobile ? 'left' : 'center'" slot="description">
            <a-step-item link="/form/step" title="签到负责人" icon="dingding-o" />
            <a-step-item link="/result/success" title="提醒待办" icon="bell"/>
            <a-table :data-source="participationData" :columns="tableColumns"></a-table>
          </a-step-item-group>
        </a-step>
        <a-step title="活动结束">
        </a-step>
      </a-steps>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import AStepItem from '@/components/tool/AStepItem'
import { mapState } from 'vuex'
import ATable from 'ant-design-vue/lib/table'
import axios from 'axios'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'EventDetail',
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList, PageLayout, ATable },
  data() {
    return {
      isMobile: false,
      activityId: 1,
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
      registrationData: [
        { key: 1, name: '张三', status: '已报名' },
        { key: 2, name: '李四', status: '已报名' },
      ],
      participationData: [
        { key: 1, name: '张三', status: '已签到' },
        { key: 2, name: '李四', status: '未签到' },
      ],
      tableColumns: [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status' },
      ],
    }
  },
  computed: {
    ...mapState('setting', ['isMobile']),
    // 检查是否已经报名
    isAlreadyRegistered() {
      return this.registrationData.some(item => item.status === '已报名');
    },
    // 检查是否已经签到
    isAlreadyCheckedIn() {
      return this.participationData.some(item => item.status === '已签到');
    }
  },
  mounted() {
    this.activityId = this.$route.query.activityId;
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
      // 防止重复报名
      if (this.isAlreadyRegistered) {
        this.$message.warning('您已经报名过了!');
        return;
      }
      const newStudent = { key: this.registrationData.length + 1, name: '新学生', status: '已报名' };
      this.registrationData.push(newStudent);
    },

    handleCheckIn() {
      // 防止重复签到
      if (this.isAlreadyCheckedIn) {
        this.$message.warning('您已经签到过了!');
        return;
      }
      const newParticipant = { key: this.participationData.length + 1, name: '新学生', status: '已签到' };
      this.participationData.push(newParticipant);
    }

  }
}
</script>
