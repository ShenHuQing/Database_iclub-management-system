<template>
  <div class="community-container">
    <!-- 显示社区名称和管理员信息 -->
    <div v-if="community.showAddPost">
      <h1 class="community-title">{{ community.communityName }}</h1>
      <div class="admins-container">
        <h2 class="admins-title">Admin: {{ community.aid }}</h2>
      </div>
    </div>

    <!-- 搜索帖子部分 -->
    <div class="search-container">
      <label for="searchQuery">搜索帖子：</label>
      <input v-model="searchQuery" id="searchQuery" placeholder="输入标签搜索帖子">
      <button @click="searchPosts">搜索</button>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-container">
      <Post v-for="(post, index) in community.posts" :key="index" :post="post" :author="shenhuqing" :title="unknown" :date="2024/10/24"/>
    </div>

    <!-- 添加新帖子的表单 -->
    <div v-if="community.showAddPost">
      <div class="add-post-container">
        <h2>发表新帖</h2>
        <label for="postTitle">标题：</label>
        <input v-model="newPost.Ptitle" id="postTitle" placeholder="输入帖子标题">

        <label for="postTags">标签：</label>
        <input v-model="newPost.Plabel" id="postTags" placeholder="输入标签">

        <label for="postContent">内容：</label>
        <textarea v-model="newPost.Pcontent" id="postContent" placeholder="输入帖子内容"></textarea>

        <button @click="addPost">发表帖子</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 axios 以进行 HTTP 请求
import { mapGetters } from 'vuex'; // 导入 Vuex 的 mapGetters 方法
import Post from '../../components/post/Post'; // 导入 Post 组件

export default {
  components: { Post },
  // props: {
  //   community: {
  //     type: Object,
  //     required: true, // 确保 community 属性是必填的
  //     communityName: "Vue.js 技术社区",
  //     aid: "张三", // 管理员名字
  //     posts: [
  //       // 示例帖子数据
  //       { Ptitle: "Vue 3.0 发布", Plabel: "技术", Pcontent: "Vue 3 的新特性介绍" },
  //       { Ptitle: "Composition API", Plabel: "讨论", Pcontent: "讨论 Composition API 的优缺点" }
  //     ],
  //     showAddPost: false // 控制是否显示“发表新帖”表单
  //   }
  // },
  computed: {
    ...mapGetters('account', ['user']), // 从 Vuex store 中获取用户信息
  },
  data() {
    return {
      community: {
        type: Object,
        required: true, // 确保 community 属性是必填的
        communityName: "Vue.js 技术社区",
        aid: "张三", // 管理员名字
        posts: [
          // 示例帖子数据
          { Ptitle: "Vue 3.0 发布", Plabel: "技术", Pcontent: "Vue 3 的新特性介绍" },
          { Ptitle: "Composition API", Plabel: "讨论", Pcontent: "讨论 Composition API 的优缺点" }
        ],
        showAddPost: false // 控制是否显示“发表新帖”表单
      },
      newPost: {
        Ptitle: '', // 新帖标题
        Plabel: '', // 新帖标签
        Pcontent: '', // 新帖内容
      },
      searchQuery: '', // 搜索查询
    };
  },
  methods: {
    async addPost() {
      // 验证必填字段是否不为空
      if (this.newPost.Ptitle.trim() === '' || this.newPost.Pcontent.trim() === '') {
        alert('请输入帖子标题和内容。');
        return;
      }

      // 准备帖子数据
      const postData = {
        Pid: null, // 假设 Pid 将由服务器生成
        studentNumber: this.user.id, // 用户 ID
        title: this.newPost.Ptitle.trim(), // 帖子标题
        label: this.newPost.Plabel.trim(), // 帖子标签
        content: this.newPost.Pcontent.trim(), // 帖子内容
        communityId: this.$route.params.id, // 当前社区 ID
      };

      try {
        // 发送 HTTP POST 请求创建新帖子
        const response = await axios.post('http://127.0.0.1:8000/StudyApp/create_post/', postData);

        // 检查服务器的响应
        if (response.data.error_num === 0) {
          // 如果成功，将新帖子添加到社区的帖子数组中
          this.community.posts.push(response.data.post);

          // 清空输入字段
          this.newPost = {
            Ptitle: '',
            Plabel: '',
            Pcontent: '',
          };
          // 重新加载页面
          window.location.reload();
        } else {
          // 如果出现错误，显示警告
          alert('创建帖子出错：' + response.data.msg);
        }
      } catch (error) {
        // 捕获错误并输出到控制台
        console.error('创建帖子出错：', error);
      }
    },

    async searchPosts() {
      // 如果搜索查询为空，获取所有帖子
      if (!this.searchQuery.trim()) {
        const postsResponse = await axios.get(`http://127.0.0.1:8000/StudyApp/get_posts_by_community/${this.community.id}`);

        // 输出响应信息
        console.log(postsResponse);

        // 更新帖子数组
        this.$set(this.community, 'posts', postsResponse.data.posts);
        return;
      }

      // 根据标签搜索帖子
      try {
        const postsResponse = await axios.get(`http://127.0.0.1:8000/StudyApp/get_posts_by_community_and_plabel/${this.community.id}/${this.searchQuery}`);

        // 输出响应信息
        console.log(postsResponse);

        // 更新帖子数组
        this.$set(this.community, 'posts', postsResponse.data.posts);
      } catch (error) {
        // 捕获错误并输出到控制台
        console.error('搜索帖子出错：', error);
      }
    },
  },
};
</script>

<style scoped>
.community-container {
  width: 100%;
  max-width: 1200px; /* 设置最大宽度 */
  margin: 0 auto; /* 居中对齐 */
  padding: 20px; /* 内边距 */
  background-color: white; /* 背景色 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 盒子阴影效果 */
  font-size: 1.2em; /* 字体大小 */
}

/* 添加帖子容器样式 */
.add-post-container {
  margin-top: 21px; /* 上边距 */
}

.add-post-container h2 {
  font-size: 18px; /* 标题字体大小 */
  margin-bottom: 10px; /* 下边距 */
  color: #333; /* 颜色 */
}

.add-post-container label {
  display: block; /* 以块级元素显示 */
  margin-bottom: 5px; /* 下边距 */
  font-size: 14px; /* 字体大小 */
  color: #555; /* 颜色 */
}

.add-post-container input,
.add-post-container textarea {
  width: 100%; /* 宽度为 100% */
  margin-bottom: 10px; /* 下边距 */
  padding: 10px; /* 内边距 */
}

.add-post-container button {
  padding: 10px; /* 内边距 */
  background-color: #007BFF; /* 按钮背景色 */
  color: #fff; /* 字体颜色 */
  border: none; /* 无边框 */
  cursor: pointer; /* 鼠标指针样式 */
}

.add-post-container button:hover {
  background-color: #0056b3; /* 悬停时的背景色 */
}
</style>
