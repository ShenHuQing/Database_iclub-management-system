<template>
  <div class="reply-box">
    <p class="reply-id">ID: {{ reply.CommentId }}</p>
    <p class="replier">学号: {{ reply.Sid }} 姓名：{{ reply.Sname }}</p>
    <hr>
    <p class="reply-content">{{ reply.CommentContent }}</p>

    <div class="replies">
      <Reply v-for="reply in reply.replies" :key="reply.CommentId" :reply="reply" />
    </div>

    <div class="reply-form">
      <input v-model="newReplyContent" placeholder="回复..." />
      <button @click="submitReply">回复</button>
    </div>
  </div>
</template>

<script>
import Reply from './Reply.vue'; // 导入自身组件以支持递归

export default {
  props: {
    reply: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newReplyContent: '',
    };
  },
  methods: {
    submitReply() {
      if (this.newReplyContent.trim()) {
        // 创建新回复对象
        const newReply = {
          CommentId: Date.now(), // 生成唯一ID（实际应用中需要更复杂的逻辑）
          Sid: '当前用户的学号', // 假设获取当前用户的学号
          Sname: '当前用户的姓名', // 假设获取当前用户的姓名
          CommentContent: this.newReplyContent,
          replies: [], // 初始时没有回复
        };

        // 将新回复添加到当前回复的回复数组
        this.reply.replies.push(newReply);
        this.newReplyContent = ''; // 清空输入框
      }
    },
  },
  components: {
    Reply,
  },
};
</script>

<style scoped>
.reply-box {
  border: 1px solid #ccc;
  padding: 8px;
  margin: 8px;
  background-color: #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.replier {
  color: #007BFF;
  font-weight: bold;
}

.reply-content {
  color: #333;
  white-space: pre-line; /* 保留换行符 */
}

.replies {
  margin-left: 20px; /* 添加缩进以区分回复 */
}

.reply-form {
  margin-top: 8px;
}
</style>
