<template>
  <div class="post">
    <!-- 帖子封面图片 -->
    <img v-if="coverImage" :src="coverImage" alt="Post Cover" class="post-cover" />

    <!-- 帖子标题 -->
    <h2 class="post-title">{{ title }}</h2>

    <!-- 帖子信息 -->
    <div class="post-meta">
      <span class="post-author">{{ author }}</span>
      <span class="post-date">{{ formatDate(date) }}</span>
    </div>

    <!-- 帖子正文 -->
    <div class="post-content">
      <slot name="content"></slot> <!-- 插槽，用于插入帖子内容 -->
    </div>

    <!-- 底部操作 -->
    <div class="post-footer">
      <a @click="onLike" href="javascript:void(0)" class="post-like">
        👍 {{ likes }} Likes
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Post",
  props: {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatDate(date) {
      // 格式化日期，简单示例：可以扩展为更多的格式
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    onLike() {
      // 触发点赞操作
      this.$emit("like");
    }
  }
};
</script>

<style scoped>
.post {
  border: 1px solid #eaeaea;
  padding: 16px;
  margin: 16px 0;
  border-radius: 8px;
}

.post-cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 16px;
}

.post-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.post-meta {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 16px;
}

.post-author {
  margin-right: 10px;
}

.post-content {
  font-size: 1em;
  line-height: 1.5;
  margin-bottom: 16px;
}

.post-footer {
  display: flex;
  justify-content: flex-start;
}

.post-like {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}

.post-like:hover {
  text-decoration: underline;
}
</style>
