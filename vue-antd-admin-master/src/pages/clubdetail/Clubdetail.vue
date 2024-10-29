<template>
  <div>
    <!-- 如果 myClub 数据存在，则渲染 Club 组件并传递 club 属性 -->
    <Club v-if="myClub" :club="myClub"></Club>
    <p v-else>Loading...</p> <!-- 如果 myClub 数据还未加载，显示加载状态 -->
  </div>
</template>

<script>
// 导入 axios 库用于发起 HTTP 请求
import axios from 'axios';
// 导入 Club 组件
import Club from "@/components/club/Club.vue";

export default {
  components: {
    Club, // 注册 Club 组件
  },
  data() {
    return {
      myClub: null, // 初始化 myClub 为 null，用于存储社团信息
    };
  },
  created() {
    // 组件创建时获取路由参数中的 clubId
    const clubId = this.$route.params.id;
    console.log(clubId);
    // 调用 fetchData 方法以获取社团的详细信息
    this.fetchData(clubId);
  },
  methods: {
    async fetchData(clubId) {
      try {
        // 使用 axios 请求获取社团详细信息
        const clubDetailsResponse = await axios.get(`http://localhost:8080/iClub/getClubDetails/${clubId}`);
        // 使用 axios 请求获取社团活动信息
        const activitysResponse = await axios.get(`http://localhost:8080/iClub/getActivities/${clubId}`);
        // 将获取的数据存储到 myClub 中
        this.myClub = {
          id: clubId,
          name: clubDetailsResponse.data.club.name, // 社团名称
          type: activitysResponse.data.type, // 社团活动类型
          description: clubDetailsResponse.data.description, // 社团描述
          posts:activitysResponse.data.posts,
          showAddPost: (clubDetailsResponse?.data?.club?.Cid !== -1), // 判断是否显示添加帖子按钮
        };

        // 调用 fetchComments 方法以获取每个帖子的评论
        await this.fetchComments(this.myClub.activities);
      } catch (error) {
        // 捕获并记录获取数据时的错误
        console.error('Error fetching data:', error);
      }
    },
    async fetchComments(posts) {
      // 遍历每个帖子，获取其评论
      for (const post of posts) {
        post.modifyAble = false; // 默认设置帖子的可修改性为 false
        post.comments = []; // 初始化评论数组

        // 仅对类型为 'comment' 的帖子获取评论
        if (post.type === 'comment') {
          try {
            // 使用 axios 请求获取该帖子的评论
            const commentsResponse = await axios.get(`http://127.0.0.1:8000/StudyApp/get_comments_by_post/${post.Pid}`);
            console.log(commentsResponse); // 打印获取的评论信息
            post.comments = commentsResponse.data.comments; // 将获取的评论存储到帖子的 comments 属性中
          } catch (error) {
            // 捕获并记录获取评论时的错误
            console.error(`Error fetching comments for post ${post.Pid}:`, error);
            post.comments = []; // 确保即使出错也能初始化 comments 数组
          }
        }
      }
    },
  },
};
</script>
