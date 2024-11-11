<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
          label="申请社团"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input v-model="club_name" placeholder="请输入申请社团" />
      </a-form-item>
      <a-form-item
          label="活动主题"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input v-model="title" placeholder="请输入活动主题" />
      </a-form-item>
      <a-form-item
          label="活动时间"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-range-picker
            v-model="activityTime"
            style="width: 100%"
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间','结束时间']"
        />
      </a-form-item>
      <a-form-item
          label="活动内容"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" v-model="content" placeholder="请输入活动内容"/>
      </a-form-item>
      <a-form-item
          label="活动场地"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" v-model="venue" placeholder="请输入活动场地"/>
      </a-form-item>
      <a-form-item
          label="上传图片"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <input type="file" @change="onFileChange" id="picture_id">
      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});
export default {
  name: 'ActivityForm',
  data () {
    return {
      club_name: '',
      title: '',
      content: '',
      activityTime: [],
      venue: '',
      picture_id: '',
      loading: false
    }
  },
  computed: {
    desc() {
      return '社团负责人申请活动'
    }
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.picture_id = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    resetForm() {
      this.club_name = '';
      this.title = '';
      this.content = '';
      this.activityTime = [];
      this.venue = '';
      this.picture_id = '';
      this.loading = false;
    },
    async handleSubmit() {
      this.loading = true;
      const [start_time, end_time] = this.activityTime;
      const activity = {
        id: Date.now().toString(),
        time: new Date().toLocaleString(),
        club_name: this.club_name,
        title: this.title,
        content: this.content,
        start_time: start_time,
        end_time: end_time,
        venue: this.venue,
        picture_id: this.picture_id,
        is_passed: 0
      }
      await instance.post('/iClub/apply',
          {activity: activity}
      )
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              this.$message.success('申请活动成功，请等待管理员审批', 3);
              this.resetForm();
            } else {
              this.$message.error('申请失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('申请失败，请重试', error);
            this.$message.error('申请失败，请重试', 3);
          })
          .finally(() => {
            this.loading = false;
          })
    }
  }
}
</script>

<style scoped>

</style>
