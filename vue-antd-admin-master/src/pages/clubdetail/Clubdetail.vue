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

    <div class="tabs">
      <button :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'">
        社团活动
      </button>
      <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
        评论区
      </button>
      <button v-if="this.isStaff"
              :class="{ active: activeTab === 'information' }" @click="activeTab = 'information'">
        学生信息
      </button>
    </div>

    <div class="content">
      <div v-if="activeTab === 'activities'" class="activity-list">
        <a-row :gutter="16">
          <a-col :span="8" v-for="activity in activities" :key="activity.id">
            <a-card
                hoverable
                style="border-radius: 8px; overflow: hidden; transition: transform 0.3s;"
                @click="goToActivityDetail(activity.id)"
            >
              <img
                  :src="activity.picture_id"
                  height="200"
                  style="border-top-left-radius: 8px; border-top-right-radius: 8px; object-fit: cover; width: 100%;"
              />
<!--              <a-card-meta style="padding: 9px;" :title="activity.name"-->
<!--                           :description="`${activity.start_time} - ${activity.end_time} | 地点：${activity.venue}`"-->
<!--                           />-->
              <div style="padding: 16px;">
                <div class="activity-info">
                  <h3 class="activity-title">{{ activity.title }}</h3>
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
                  <a-icon v-if="comment.authorId === user.id" type="delete" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="deleteComment(comment)" />
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
                        <a> {{reply.authorName}} </a>
                        <a>{{ reply.replyName ? '@' + reply.replyName + ' ' : ''}}</a>： {{ reply.content }}
                        <span class="date-info">发布在</span>
                        <span class="date-info">{{ reply.date }}</span>
                      </div>

                      <span class="reply-actions">
                        <a-icon :type="reply.likedByCurrentUser ? 'like' : 'like-o'"
                                :style="{ color: reply.likedByCurrentUser ? '#1890ff' : '#000000' }"
                                style="margin-right: 8px; line-height: 1.5;"
                                @click="likeReply(reply)" />
                        <span style="margin-left: -12px;line-height: 1.3;">{{ reply.likes }}</span>
                        <a-icon type="message" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="replyToReply(comment, reply)" />
                        <a-icon v-if="reply.authorId === user.id" type="delete" style="margin-left: 25px;margin-right: 8px; line-height: 1.5;" @click="deleteReply(comment, reply)" />
                      </span>
                    </a-list-item>
                  </template>
                </a-list>
              </div>

            </a-list-item>
          </a-list>

          <div class="comment-box">
            <a-input
                v-model="newComment"
                :placeholder="commentPlaceholder"
                @pressEnter="post"
                style="width: 100%; max-width: 600px;"
            />
            <a-button
                type="primary"
                @click="post"
                style="margin-left: 8px;"
            >
              发布
            </a-button>
          </div>

        </a-card>
      </div>

      <div v-if="activeTab === 'information'" class="information-list">
        <a-card :bordered="false">
          <a-table
              row-key="id"
              style="margin-bottom: 24px"
              :columns="studentColumns"
              :dataSource="studentData"
              :pagination="false"
          >
          </a-table>
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

const studentColumns = [
  {
    title: '学号',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'major'
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles'
  }
]

export default {
  name: "ClubDetail",
  computed: {
    ...mapGetters('account', ['user','roles']),
  },
  data() {
    return {
      basicInfo: {
        id: '',
        name: '',
        type: '',
        description: '',
        pictureId: '', // 社团图片 URL
      },
      activities: [
        {
          id: 1,
          time:'',
          club_name:'',
          title: '编程马拉松',
          content: '不理解是干啥的',
          start_time: '2023-05-15 16:00',
          end_time: '2023-05-15 17:00',
          venue: '地点',
          picture_id: require('../../assets/img/preview.png'),
          is_passed: 0
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
              id: '1',
              authorName: 'lihua',
              content: '社团活动真的很棒！',
              authorId: '01',
              date: '2023-05-15 17:01',
              likes: 0,
              replyId: '',
              replyName: '',
              commentId:'',
              likedByCurrentUser: false,
              pictureId: require('../../assets/img/preview.png'),
            },
          ]
        },
      ],
      newComment:'',
      commentPlaceholder: '',
      replyTarget: null,
      isStaff: false,
      joined: false,
      followed: false,
      activeTab: "activities",
      loading: false,
      studentColumns,
      studentData: [
        {
          id: '',
          name: '',
          major: '',
          roles: ''
        }
      ]
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
        const clubDetailResponse = await instance.get(`/iClub/getClubDetails/${clubId}`);
        this.basicInfo = clubDetailResponse.data.data;

        const commentsResponse = await instance.post(`/iClub/getComments`, {studentId: this.user.id, clubId: this.basicInfo.id});
        this.comments = commentsResponse.data.data;

        const followedResponse = await instance.post(`/iClub/getFollow`, {studentId: this.user.id, clubId: this.basicInfo.id});
        this.followed = !followedResponse.data.code; ////0已经关注，其他代表没有

        const joinedResponse = await instance.post(`/iClub/getJoin`, {studentId: this.user.id, clubId: this.basicInfo.id});
        this.joined = !joinedResponse.data.code; //0已经加入，其他代表没有

        const isStaffResponse = await instance.post(`/iClub/isStaff`, {studentId: this.user.id, clubId: this.basicInfo.id});
        this.isStaff = isStaffResponse.data.code === 0; //0代表是负责人，-1代表不是

        const memberResponse = await instance.post(`/iClub/getMembers`, {clubId: this.basicInfo.id});
        this.studentData = memberResponse.data.data.map(member => {
          return {
            id: member.id,
            name: member.name,
            major: member.major,
            roles: member.isStaff === 0 ? '成员' : '负责人'
          };
        });

        const activitiesResponse = await instance.post(`/iClub/getActivities`, {clubName: this.basicInfo.name});
        this.activities = activitiesResponse.data.data;
      } catch (error) {
        console.error('获取社团详情信息时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    goToActivityDetail(id) {
      if (this.joined || this.followed) {
        this.$router.push({path: '/activitydetail', query: {activityId: id}});
      } else {
        this.$message.error('请先加入或关注该社团以查看活动详情', 3);
      }
    },
    joinSociety() {
      if (!this.joined) {
        this.$router.push({path: `/enroll`, query: {clubName: this.basicInfo.name, clubId: this.basicInfo.id}});
      }
    },
    toggleReplies(comment) {
      comment.showReplies = !comment.showReplies;
    },
    async likeComment(comment) {
      const action = comment.likedByCurrentUser ? 'unlike' : 'like';
      await instance.post('/iClub/changeCommentLike',
          {clubId: this.basicInfo.id,
            studentId: this.user.id,
            commentId: comment.id,
            action: action}
      )
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              if (comment.likedByCurrentUser) {
                comment.likes -= 1;
                comment.likedByCurrentUser = false;
              } else {
                comment.likes += 1;
                comment.likedByCurrentUser = true;
              }
            } else {
              this.$message.error('点赞操作失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('点赞删除失败，请重试', error);
            this.$message.error('点赞操作失败，请重试', error);
          })
    },
    async likeReply(reply) {
      const action = reply.likedByCurrentUser ? 'unlike' : 'like';
      await instance.post('/iClub/changeReplyLike',
          {clubId: this.basicInfo.id,
            studentId: this.user.id,
            replyId: reply.id,
            action: action}
      )
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              if (reply.likedByCurrentUser) {
                reply.likes -= 1;
                reply.likedByCurrentUser = false;
              } else {
                reply.likes += 1;
                reply.likedByCurrentUser = true;
              }
            } else {
              this.$message.error('点赞操作失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('点赞删除失败，请重试', error);
            this.$message.error('点赞操作失败，请重试', error);
          })
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
    async deleteComment(comment) {
        await instance.delete('iClub/deleteComment', {
          data:{
            commentId: comment.id,
            clubId: this.basicInfo.id}
        })
            .then(response => {
              const res = response.data;
              if (res.code === 0) {
                this.comments = this.comments.filter(c => c.id !== comment.id);
                this.$message.success('评论已删除', 3)
              } else {
                this.$message.error('评论删除失败，请重试', 3);
              }
            })
            .catch(error => {
              console.error('评论删除失败，请重试', error);
              this.$message.error('评论删除失败，服务器出错，请稍后再试', 3);
            })

    },
    // 删除回复
    async deleteReply(comment, reply) {
      await instance.delete('iClub/deleteReply', {
        data: {
          replyId: reply.id,
          clubId: this.basicInfo.id
        }
      })
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              comment.replies = comment.replies.filter(r => r.id !== reply.id);
              this.$message.success('回复已删除', 3)
            } else {
              this.$message.error('回复删除失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('回复删除失败，请重试', error);
            this.$message.error('回复删除失败，服务器出错，请稍后再试', 3);
          })
      if (comment.replies.length === 0) {
        comment.showReplies = false;
      }
    },
    async followSociety() {
      const action = this.followed ? 'unfollow' : 'follow';
      await instance.post('iClub/changeFollow',
          {clubId: this.basicInfo.id,
        studentId: this.user.id,
        action: action})
          .then(response => {
            if (response.data.code === 0) {
              this.followed = !this.followed;
              const message = this.followed ? '已关注该社团！' : '已取消关注该社团';
              this.$message.success(message);
            } else {
              this.$message.error('操作失败，请重试');
            }
          })
          .catch(error => {
            console.error('关注或取关社团时出错',error);
            this.$message.error('服务器出错，请稍后再试');
          })
    },
    async post() {
      if (this.newComment === '' || this.newComment === null) {
        this.$message.error('发布内容不能为空！', 3);
        return;
      }
      try {
        if (this.replyTarget) {
          const reply = {
            id: Date.now().toString(),
            authorName: this.user.name,
            authorId: this.user.id,
            content: this.newComment,
            date: new Date().toLocaleString(),
            likes: 0,
            replyName: this.replyTarget.type === 'reply' ? this.replyTarget.target.authorName : null,
            replyId: this.replyTarget.type === 'reply'? this.replyTarget.target.id : null,
            commentId: this.replyTarget.type === 'reply'? this.replyTarget.parent.id : this.replyTarget.target.id,
            pictureId: this.user.pictureId,
            likedByCurrentUser: false
          };
          instance.post('/iClub/postReply', reply);
          if (this.replyTarget.type === 'comment') {
            this.replyTarget.target.replies.push(reply);
          } else {
            this.replyTarget.parent.replies.push(reply);
          }
          this.replyTarget = null;
          this.$message.success('发布回复成功！', 3);
        } else {
          const newComment = {
            id: Date.now().toString(),
            authorName: this.user.name,
            content: this.newComment,
            authorId: this.user.id,
            date: new Date().toLocaleString(),
            likes: 0,
            showReplies: false,
            likedByCurrentUser: false,
            pictureId: this.user.pictureId,
            replies: []
          };
          instance.post('/iClub/postComment', {comment: newComment, clubId: this.basicInfo.id});
          this.comments.push(newComment);
          this.$message.success('发布评论成功！', 3);
        }
        this.newComment = '';
        this.commentPlaceholder = '';
      } catch (error) {
        console.error('提交评论失败', error);
        this.$message.error('提交失败，请稍后再试', 3);
      }
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

  .no-comments, .no-activities {
    text-align: center; /* 使文本居中 */
    color: rgba(0, 0, 0, 0.5); /* 设置为浅色 */
    font-size: 18px; /* 调整字体大小 */
    margin-top: 20px; /* 添加顶部间距 */
  }
}
</style>
