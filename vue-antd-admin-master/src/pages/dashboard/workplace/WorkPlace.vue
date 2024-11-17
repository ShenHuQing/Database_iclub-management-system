<template>
  <page-layout>
    <div>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">

          <a-card class="announcement-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="公告" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in announcements">
                <a-card :bordered="false" :body-style="{padding: 0}" style="margin-bottom: 20px; border-radius: 8px;">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <span>{{ item.title }}</span>
                    </div>
                  </a-card-meta>
                  <div class="card-item">
                    <div class="card-header">
                      <span>{{ item.content}}</span>
                    </div>
                    <div class="card-header">
                      <span>{{ '发布于 ' + item.time }}</span>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card v-if="roles !== 'admin'" class="activity-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="活动提醒" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in activities">
                <a-card :bordered="false" :body-style="{padding: 0}" style="margin-bottom: 20px; border-radius: 8px;">
                  <div class="card-item">
                    <div class="card-header">
                      <span style="font-weight: bold;">{{ item.content }}</span>
                    </div>
                    <div class="card-header">
                      <span>{{ '发布于 ' + item.time }}</span>
                    </div>
                    <div class="card-footer">
                      <a class="group"
                         @click="goToActivityDetail(item.id)"
                         style="display: block; margin-top: 10px; font-weight: bold; text-align: center; color: #1890ff;"
                      >
                        活动详情
                      </a>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card v-if="roles !== 'admin'" class="notice-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="审核结果" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in notices">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <div class="card-item">
                    <div class="card-header">
                      <span style="font-weight: bold;">{{ item.content}}</span>
                    </div>
                    <div class="card-header">
                      <span>{{ '发布于 ' + item.time }}</span>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import axios from "axios"; // Ensure Axios is imported

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // Check and adapt to your backend address
  withCredentials: true,
});

import PageLayout from '@/layouts/PageLayout'
import {mapState} from 'vuex'

export default {
  name: 'WorkPlace',
  components: {PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      announcements: [
        {
          id: 2,
          title: '狂欢节',
          content: '不醉不归',
          time: '2024-11-14 14:20:23'
        }
      ],
      activities: [
        {
          id: 1,
          content: '翰墨书画社发布的主题为书法比赛的活动正在报名中，请积极参与报名',
          time:'2024-11-14 14:20:23',
        }
      ],
      notices: [
        {
          id: 3,
          content: '您于2024-11-13 14:20:23提交的报名翰墨书画社已通过审核',
          time: '2024-11-14 14:20:23'
        },
        {
          id: 4,
          content: '翰林书画社于2024-11-13 14:20:23提交的主题为书法比赛的活动申请已通过审核',
          time: '2024-11-14 14:20:23'
        }
      ],
      loading: false,
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user', roles: 'roles'}),
  },
  mounted() {
    this.fetchAnnouncements();
    this.fetchActivities();
    this.fetchNotices();
  },
  methods: {
    goToActivityDetail(id) {
      this.$router.push({path: '/activitydetail', query: {activityId: id, joined: true}});
    },
    fetchAnnouncements() {
      this.loading = true;
      instance.get(`/iClub/getAnnouncement`)
          .then(response => {
            this.announcements = response.data.data;
          })
          .catch(error => {
            console.error('Error fetching announcements:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    fetchActivities() {
      this.loading = true;
      instance.post(`/iClub/getPersonalActivityNotice`, {studentId: this.currUser.id})
          .then(response => {
            this.activities = response.data.data;
            console.log(this.activities)
          })
          .catch(error => {
            console.error('Error fetching activities:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    fetchNotices() {
      this.loading = true;
      instance.post(`/iClub/getPersonalNotice`, {studentId: this.currUser.id})
          .then(response => {
            this.notices = response.data.data;
          })
          .catch(error => {
            console.error('Error fetching notices:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
  }
}
</script>

<style lang="less">
@import "index";
.card-title {
  font-size: 18px;  /* 设置最大字体 */
  font-weight: bold;  /* 加粗字体 */
  color: #333;  /* 字体颜色 */
  line-height: 1.4;
  margin: 10px 0;
}

.card-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.card-header {
  margin-bottom: 10px;  /* 活动标题和发布时间之间的间距 */
  font-size: 14px;
  color: #666;
}

.card-footer {
  margin-top: 10px;
  text-align: center;
}

.group {
  color: #1890ff;  /* 蓝色链接 */
  font-weight: bold;
  text-decoration: none;
}

.group:hover {
  text-decoration: underline;  /* 鼠标悬停下划线 */
}
</style>
