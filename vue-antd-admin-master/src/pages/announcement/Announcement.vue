<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
          label="公告标题"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input v-model="title" placeholder="请输入公告标题" />
      </a-form-item>
      <a-form-item
          label="公告内容"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea v-model="description" rows="4" placeholder="请输入公告内容"/>
      </a-form-item>

      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" @click="handleSubmit">提交</a-button>
        <a-button style="margin-left: 8px" @click="handleSave">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import axios from "axios"; // Ensure Axios is imported

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // Check and adapt to your backend address
  withCredentials: true,
});

export default {
  name: 'postAnnouncement',
  data() {
    return {
      id: '',
      time: '',
      title: '',
      description: '',
    };
  },
  computed: {
    desc() {
      return '填写以下内容以发布公告'
    }
  },
  methods: {
    async handleSubmit() {
      const payload = {
        id: Date.now().toString(),
        time: new Date().toLocaleString(),
        title: this.title,
        content: this.description,
      };
      try {
        const response = await instance.post('/iClub/postAnnouncement', payload); // Adjust the path as per your requirements
        if (response.data.code === 0) {
          this.$message.success('发布公告成功', 3);
        } else {
          this.$message.error('发布公告失败', 3);
        }
      } catch (error) {
        console.error('Submission error', error);
        this.$message.error('发布公告失败', 3);
      }
    },
    handleSave() {
      localStorage.setItem('formDraft', JSON.stringify({ title: this.title, description: this.description }));
      this.$message.success('保存成功', 3);
    },
  },
};
</script>

<style scoped>
</style>
