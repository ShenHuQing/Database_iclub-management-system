<template>
  <div class="comment-box">
    <p class="comment-id">ID: {{ comment.CommentId }}</p>
    <p class="commenter">学号: {{ comment.Sid }} 姓名：{{ comment.Sname }}</p>
    <hr>
    <p class="comment-content">{{ comment.CommentContent }}</p>

    <div class="replies">
      <Comment v-for="reply in comment.replies" :key="reply.CommentId" :comment="reply" />
    </div>

    <div class="reply-form">
      <input v-model="newReplyContent" placeholder="回复..." />
      <button @click="submitReply">回复</button>
    </div>
  </div>
</template>

<script>
import Comment from './Comment.vue'; // 导入自身组件以支持递归

export default {
  props: {
    comment: {
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
        const reply = {
          CommentId: Date.now(), // 生成唯一ID（实际应用中需要更复杂的逻辑）
          Sid: '当前用户的学号', // 假设获取当前用户的学号
          Sname: '当前用户的姓名', // 假设获取当前用户的姓名
          CommentContent: this.newReplyContent,
          replies: [], // 初始时没有回复
        };

        // 将新回复添加到评论的回复数组
        this.comment.replies.push(reply);
        this.newReplyContent = ''; // 清空输入框
      }
    },
  },
  components: {
    Comment,
  },
};
</script>

<style scoped>
.comment-box {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.commenter {
  color: #007BFF;
  font-weight: bold;
}

.comment-content {
  color: #333;
  white-space: pre-line; /* 保留换行符 */
}

.replies {
  margin-left: 20px; /* 添加缩进以区分回复 */
}

.reply-form {
  margin-top: 10px;
}
</style>
