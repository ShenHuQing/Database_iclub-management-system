<template>
  <div class="club-detail">
    <!-- 社团基本信息 -->
    <div class="header">
      <img :src="basicInfo.pictureId" alt="社团图片" class="club-image" />
      <div class="info">
        <h1>{{ basicInfo.name }}</h1>
        <p>{{ basicInfo.description }}</p>
        <div class="actions">
          <button @click="joinSociety">{{ joined ? '已加入' : '加入社团' }}</button>
          <button @click="followSociety">{{ followed ? '已关注' : '关注社团' }}</button>
        </div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'">
        社团活动
      </button>
      <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
        评论区
      </button>
    </div>

    <!-- 内容显示 -->
    <div class="content">
      <div v-if="activeTab === 'activities'" class="activity-list">
        <a-row :gutter="16">
          <a-col :span="8" v-for="activity in activities" :key="activity.id">
            <a-card hoverable style="border-radius: 8px; overflow: hidden; transition: transform 0.3s;">
              <img
                  :src="activity.pictureId"
                  height="200"
                  style="border-top-left-radius: 8px; border-top-right-radius: 8px; object-fit: cover; width: 100%;"
              />
<!--              <a-card-meta style="padding: 9px;" :title="activity.name"-->
<!--                           :description="`${activity.start_time} - ${activity.end_time} | 地点：${activity.venue}`"-->
<!--                           />-->
              <div style="padding: 16px;">
                <div class="activity-info">
                  <h3 class="activity-title">{{ activity.name }}</h3>
                  <p class="activity-time" style="font-weight: bold; color: #999;">
                    {{ activity.start_time }} - {{ activity.end_time }}
                  </p>
                  <p class="activity-venue" style="margin: 8px 0;">地点：{{ activity.venue }}</p>
                  <p class="activity-content" style="color: #666;">{{ activity.content }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>


      <div v-if="activeTab === 'comments'" class="comment-list">
        <a-card :bordered="false">
          <!-- 检查评论是否为空 -->
          <div v-if="comments.length === 0" class="no-comments">
            这里是无人区
          </div>
          <div v-else>
          <a-list itemLayout="vertical">
            <a-list-item v-for="comment in comments" :key="comment.id">

              <a-list-item-meta>
                <div slot="description">
                  <div class="author">
                    <a-avatar size="small" :src="comment.pictureId" />
                    <span style="margin-left: 10px">{{ comment.authorName }}</span>
                    <em>发布在</em>
                    <em>{{ comment.date }}</em>
                  </div>
                </div>
              </a-list-item-meta>

              <div class="content">
                <div class="detail">
                  {{ comment.content }}
                </div>

                <!-- Action buttons for like and reply -->
                <div slot="actions" class="actions">
                  <a-icon :type="comment.likedByCurrentUser ? 'like' : 'like-o'"
                          :style="{ color: comment.likedByCurrentUser ? '#1890ff' : '#000000' }"
                          style="margin-right: 8px; line-height: 1.5;"
                          @click="likeComment(comment)" />
                  <span style="margin-left: -12px;line-height: 1.3;">{{ comment.likes }}</span>
                  <a-icon type="message" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="replyToComment(comment)" />
                  <a-icon type="delete" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="deleteComment(comment)" />
                </div>
              </div>

              <!-- View replies button moved below the action buttons -->
              <div v-if="comment.replies.length > 0" class="view-replies">
                <a-button type="link" @click="toggleReplies(comment)">
                  {{ comment.showReplies ? '收起回复' : '展开回复' }} ({{ comment.replies.length }})
                </a-button>
              </div>

              <div v-if="comment.showReplies" class="replies">
                <a-list itemLayout="vertical" :dataSource="comment.replies">
                  <template v-slot:renderItem="reply">
                    <a-list-item :key="reply.id">
                      <div class="reply-content">
                        <a-avatar size="small" :src="reply.pictureId" />
                        <a>{{ reply.replyName ? '@' + reply.replyName + ' ' : '' }}{{ reply.authorName }}</a>： {{ reply.content }}
                        <span class="date-info">发布在</span>
                        <span class="date-info">{{ reply.date }}</span>
                      </div>

                      <span class="reply-actions">
                        <a-icon :type="reply.likedByCurrentUser ? 'like' : 'like-o'"
                                :style="{ color: reply.likedByCurrentUser ? '#1890ff' : '#000000' }"
                                style="margin-right: 8px; line-height: 1.5;"
                                @click="likeReply(comment, reply)" />
                        <span style="margin-left: -12px;line-height: 1.3;">{{ reply.likes }}</span>
                        <a-icon type="message" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="replyToReply(comment, reply)" />
                        <a-icon type="delete" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="deleteReply(comment, reply)" />
                      </span>
                    </a-list-item>
                  </template>
                </a-list>
              </div>

            </a-list-item>
          </a-list>
          </div>

          <div class="comment-box">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                     style="margin-bottom: 24px; width: 100%; max-width: 600px;"/>
            <a-input
                v-model="newComment"
                :placeholder="commentPlaceholder"
                @pressEnter="postComment"
                style="width: 100%; max-width: 600px;"
            />
          </div>

        </a-card>
      </div>
    </div>
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
  name: "ClubDetail",
  computed: {
    ...mapGetters('account', ['user','roles']),
  },
  data() {
    return {
      currUser: this.user,
      currName: 'Herry',
      basicInfo: {
        id: '',
        name: '编程爱好者协会',
        type: '',
        description: '这是一个热爱编程的社团，致力于提高学生的编程水平。',
        pictureId: "https://via.placeholder.com/150", // 社团图片 URL
      },
      activities: [
        {
          id: '1',
          name: '编程马拉松',
          content: '不理解是干啥的',
          start_time: '2023-05-15 16:00',
          end_time: '2023-05-15 17:00',
          venue: '地点',
          pictureId: require('../../assets/img/preview.png'),
        }
      ],
      // comments: [],
      comments: [
        {
          id: '1',
          authorName: '李华',
          content: '社团活动真的很棒！',
          authorId: '01',
          date: '2023-05-15 17:00',
          likes: 0,
          showReplies: false,
          likedByCurrentUser: false,
          pictureId: require('../../assets/img/preview.png'),
          replies: [
            {
              id: '01',
              authorName: '123',
              content: '社团活动真的很棒！',
              authorId: '01',
              date: '2023-05-15 17:01',
              likes: 0,
              replyId: '',
              replyName: '',
              likedByCurrentUser: false,
              pictureId: require('../../assets/img/preview.png'),
            },
            {
              id: '02',
              authorName: '124',
              content: '社团活动真的很棒！',
              authorId: '02',
              date: '2023-05-15 17:05',
              likes: 0,
              replyId: '01',
              replyName: '123',
              likedByCurrentUser: false,
              pictureId: require('../../assets/img/preview.png'),
            }
          ]
        },
        {
          id: '2',
          authorName: '李华',
          content: '社团活动真的很棒！',
          authorId: '01',
          date: '2023-05-15 17:00',
          likes: 0,
          showReplies: false,
          likedByCurrentUser: false,
          replies: [],
          pictureId: require('../../assets/img/preview.png'),
        },
        {
          id: '3',
          authorName: '李华',
          content: '社团活动真的很棒！',
          authorId: '01',
          date: '2023-05-15 17:00',
          likes: 0,
          showReplies: false,
          likedByCurrentUser: false,
          replies: [],
          pictureId: require('../../assets/img/preview.png'),
        },
        {
          id: '4',
          authorName: '李华',
          content: '社团活动真的很棒！',
          authorId: '01',
          date: '2023-05-15 17:00',
          likes: 0,
          showReplies: false,
          likedByCurrentUser: false,
          replies: [],
          pictureId: require('../../assets/img/preview.png'),
        },
      ],
      newComment:'',
      commentPlaceholder: '',
      replyTarget: null,
      joined: false,
      followed: false,
      activeTab: "activities",
      loading: false,
      error: ''
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const clubId = this.$route.params.id;
      try {
        const response = await instance.get(`/iClub/fetchData/${clubId}`);
        this.basicInfo = response.data.data.basicInfo;
        this.activities = response.data.data.activities;
        this.comments = response.data.data.comments;
      } catch (error) {
        console.error('获取社团详情信息时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    toggleReplies(comment) {
      comment.showReplies = !comment.showReplies;
    },
    likeComment(comment) {
      if (comment.likedByCurrentUser) {
        comment.likes -= 1;
        comment.likedByCurrentUser = false;
      } else {
        comment.likes += 1;
        comment.likedByCurrentUser = true;
      }
    },
    likeReply(comment, reply) {
      if (reply.likedByCurrentUser) {
        reply.likes -= 1;
        reply.likedByCurrentUser = false;
      } else {
        reply.likes += 1;
        reply.likedByCurrentUser = true;
      }
    },
    replyToComment(comment) {
      this.replyTarget = { type: 'comment', target: comment };
      this.commentPlaceholder = `@${comment.authorName}`;
    },
    replyToReply(comment, reply) {
      this.replyTarget = { type: 'reply', target: reply, parent: comment };
      this.commentPlaceholder = `@${reply.authorName}`;
    },
    // 删除评论及其回复
    deleteComment(comment) {
      this.error = '';
      if (comment.authorId === this.currUser) {
        this.comments = this.comments.filter(c => c.id !== comment.id);
      } else {
        this.error = '你不能删除别人的评论';
      }
    },
    // 删除回复
    deleteReply(comment, reply) {
      this.error = '';
      if (reply.authorId === this.currUser) {
        comment.replies = comment.replies.filter(r => r.id !== reply.id);
      } else {
        this.error = '你不能删除别人的回复';
      }
    },
    joinSociety() {
      this.joined = !this.joined;
    },
    followSociety() {
      this.followed = !this.followed;
    },
    postComment() {
      if (this.replyTarget) {
        const reply = {
          id: Date.now().toString(),
          authorName: this.currName,
          authorId: this.currUser,
          content: this.newComment,
          date: new Date().toLocaleString(),
          likes: 0,
          replyName: this.replyTarget.type === 'reply' ? this.replyTarget.target.authorName : '',
          replyId: this.replyTarget.type === 'reply'? this.replyTarget.target.authorId : ''
        };
        if (this.replyTarget.type === 'comment') {
          this.replyTarget.target.replies.push(reply);
        } else {
          this.replyTarget.parent.replies.push(reply);
        }
        this.replyTarget = null;
      } else {
        const newComment = {
          id: Date.now().toString(),
          authorName: this.currName,
          authorId: this.currUser,
          content: this.newComment,
          date: new Date().toLocaleString(),
          likes: 0,
          replies: [],
          showReplies: false
        };
        this.comments.push(newComment);
      }
      this.newComment = '';
      this.commentPlaceholder = '';
    }
  }
}
</script>

<style lang="less" scoped>
.club-detail {
  max-width: 1200px; /* 调宽页面至1200px */
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.club-image {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin-right: 20px;
}

.liked {
  color: blue;
}

.info {
  flex: 1;
}

.actions button {
  margin-right: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0056b3;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
}

.tabs button.active {
  font-weight: bold;
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.content {
  .comment-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f0f2f5;
    padding: 10px;
    box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
  }

  .actions, .reply-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .reply-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .reply-date {
    font-size: 12px;
    color: gray;
  }

  .replies {
    margin-left: 40px;
  }

  .detail {
    line-height: 22px;
    max-width: 720px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdcdc; /* 底部分隔线 */
  }

  .date-info {
    color: rgba(0, 0, 0, 0.25); /* 设置为浅色，使用rgba可以控制透明度 */
    font-weight: normal; /* 确保不使用斜体 */
  }

  .author {
    color: @text-color-second;
    margin-top: 16px;
    line-height: 22px;
    & > :global(.ant-avatar) {
      vertical-align: top;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      position: relative;
      top: 1px;
    }
    & > em {
      color: @disabled-color;
      font-style: normal;
      margin-left: 16px;
    }
  }

  .no-comments {
    text-align: center; /* 使文本居中 */
    color: rgba(0, 0, 0, 0.5); /* 设置为浅色 */
    font-size: 18px; /* 调整字体大小 */
    margin-top: 20px; /* 添加顶部间距 */
  }
}
</style>


<!--<template>-->
<!--  <div>-->
<!--    &lt;!&ndash; 如果 myClub 数据存在，则渲染 Club 组件并传递 club 属性 &ndash;&gt;-->
<!--    <Club v-if="myClub" :club="myClub"></Club>-->
<!--    <p v-else>Loading...</p> &lt;!&ndash; 如果 myClub 数据还未加载，显示加载状态 &ndash;&gt;-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--// 导入 axios 库用于发起 HTTP 请求-->
<!--import axios from 'axios';-->
<!--// 导入 Club 组件-->
<!--import Club from "@/components/club/Club.vue";-->

<!--export default {-->
<!--  components: {-->
<!--    Club, // 注册 Club 组件-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      myClub: null, // 初始化 myClub 为 null，用于存储社团信息-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    // 组件创建时获取路由参数中的 clubId-->
<!--    const clubId = this.$route.params.id;-->
<!--    console.log(clubId);-->
<!--    // 调用 fetchData 方法以获取社团的详细信息-->
<!--    this.fetchData(clubId);-->
<!--  },-->
<!--  methods: {-->
<!--    async fetchData(clubId) {-->
<!--      try {-->
<!--        // 使用 axios 请求获取社团详细信息-->
<!--        const clubDetailsResponse = await axios.get(`http://localhost:8080/iClub/getClubDetails/${clubId}`);-->
<!--        // 使用 axios 请求获取社团活动信息-->
<!--        const activitysResponse = await axios.get(`http://localhost:8080/iClub/getActivities/${clubId}`);-->
<!--        // 将获取的数据存储到 myClub 中-->
<!--        this.myClub = {-->
<!--          id: clubId,-->
<!--          name: clubDetailsResponse.data.club.name, // 社团名称-->
<!--          type: activitysResponse.data.type, // 社团活动类型-->
<!--          description: clubDetailsResponse.data.description, // 社团描述-->
<!--          posts:activitysResponse.data.posts,-->
<!--          showAddPost: (clubDetailsResponse?.data?.club?.Cid !== -1), // 判断是否显示添加帖子按钮-->
<!--        };-->

<!--        // 调用 fetchComments 方法以获取每个帖子的评论-->
<!--        await this.fetchComments(this.myClub.activities);-->
<!--      } catch (error) {-->
<!--        // 捕获并记录获取数据时的错误-->
<!--        console.error('Error fetching data:', error);-->
<!--      }-->
<!--    },-->
<!--    async fetchComments(posts) {-->
<!--      // 遍历每个帖子，获取其评论-->
<!--      for (const post of posts) {-->
<!--        post.modifyAble = false; // 默认设置帖子的可修改性为 false-->
<!--        post.comments = []; // 初始化评论数组-->

<!--        // 仅对类型为 'comment' 的帖子获取评论-->
<!--        if (post.type === 'comment') {-->
<!--          try {-->
<!--            // 使用 axios 请求获取该帖子的评论-->
<!--            const commentsResponse = await axios.get(`http://127.0.0.1:8000/StudyApp/get_comments_by_post/${post.Pid}`);-->
<!--            console.log(commentsResponse); // 打印获取的评论信息-->
<!--            post.comments = commentsResponse.data.comments; // 将获取的评论存储到帖子的 comments 属性中-->
<!--          } catch (error) {-->
<!--            // 捕获并记录获取评论时的错误-->
<!--            console.error(`Error fetching comments for post ${post.Pid}:`, error);-->
<!--            post.comments = []; // 确保即使出错也能初始化 comments 数组-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
