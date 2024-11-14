<template>
  <page-layout>
    <div>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="notice-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="通知提醒" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in activities">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <span>{{ item.title }}</span>
                    </div>
                  </a-card-meta>
                  <div class="activity-item">
                    <a class="group" href="https://www.buaa.edu.cn/">活动详情</a>
                    <span class="datetime">{{ item.time }}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card class="activity-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="活动提醒" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in activities">
                <a-card :bordered="false" :body-style="{padding: 0}" style="margin-bottom: 20px; border-radius: 8px;">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <span>{{ item.title }}</span>
                    </div>
                  </a-card-meta>
                  <div class="activity-item">
                    <div class="activity-header">
                      <span>{{ item.club_name}}</span>
                    </div>
                    <div class="activity-header">
                      <span>{{ '发布于 ' + item.release_time }}</span>
                    </div>
                    <div class="activity-footer">
                      <a class="group" href="https://www.buaa.edu.cn/" style="display: block; margin-top: 10px; font-weight: bold; text-align: center; color: #1890ff;">活动详情</a>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card class="activity-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="事务提醒" :body-style="{padding: 0}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in activities">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <span>{{ item.title }}</span>
                    </div>
                  </a-card-meta>
                  <div class="activity-item">
                    <a class="group" href="https://www.buaa.edu.cn/">活动详情</a>
                    <span class="datetime">{{ item.time }}</span>
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
import PageLayout from '@/layouts/PageLayout'
import {mapState} from 'vuex'

export default {
  name: 'WorkPlace',
  components: {PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      activities: [
        {
          id: 1,
          time:'',
          club_name: '翰墨书画社',
          title: '编程马拉松',
          content: '不理解是干啥的',
          start_time: '2023-05-15 16:00',
          end_time: '2023-05-15 17:00',
          release_time: '2024-06-18 13:00',
          venue: '地点',
          picture_id: '',
          is_passed: 1
        }
      ],
      notices: [],
      loading: false,
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
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

.activity-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.activity-header {
  margin-bottom: 10px;  /* 活动标题和发布时间之间的间距 */
  font-size: 14px;
  color: #666;
}

.activity-footer {
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
