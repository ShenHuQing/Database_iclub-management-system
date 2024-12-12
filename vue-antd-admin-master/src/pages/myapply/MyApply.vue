<template>
  <div>
    <a-card
        style="margin-top: 20px"
        :bordered="false"
    >
      <a-list size="large">
        <a-list-item v-for="item in apply" :key="item.id">
          <a-list-item-meta
              :title="item.club_name"
              :description="item.title"
          >
            <a slot="title">AliPay</a>
          </a-list-item-meta>
          <div slot="actions">
            <a v-if="item.is_passed === 0" style="margin-right: 8px; color: #808080">待审批</a>
            <a v-if="item.is_passed === 1" style="color: #B22222;">未通过</a>
            <a v-if="item.is_passed === 2">已通过</a>
            <a v-if="item.is_passed === 0" @click="deleteApply(item.id)">取消申请</a>
          </div>
          <div style="text-align: center;" class="list-content">
            <div style="max-width: 300px;" class="list-content-item">
              <span>活动内容</span>
              <p>{{item.content}}</p>
            </div>
            <div style="max-width: 200px;" class="list-content-item">
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
      apply: [
        {
          id: '12',
          time: '2024-11-4',
          club_name: '凌峰社',
          title: '爬山',
          content: '爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，' +
              '爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，' +
              '爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，' +
              '爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，' +
              '爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山，爬西山',
          start_time: '2024-11-5 12:00:00',
          end_time: '2024-11-5 13:00:00',
          venue: '西山',
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
        const response = await instance.post(`/iClub/getPersonalApply`, {studentId: this.user.id});
        console.log(response)
        this.apply = response.data.data;
      } catch (error) {
        console.error('获取活动申请记录时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteApply(id) {
      this.loading = true;
      try {
        const response = await instance.post(`/iClub/deleteApply`, {activityId: id});
        if (response.data.code === 0) {
          this.apply = this.apply.filter(item => item.id !== id);
          this.$message.success('取消活动申请成功', 3);
        }
        else {
          console.error('取消活动申请时出错');
        }
      } catch (error) {
        console.error('取消活动申请时出错:', error);
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
  //text-align: center; /* 使父元素内的文本水平居中 */
  span{
    line-height: 20px;
    font-weight: bold;
  }
  p{
    margin: 4px 0 0;
    line-height: 22px;
  }
}
</style>
