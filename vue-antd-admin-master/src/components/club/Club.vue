<template>
    <div class="club-container">
    <div v-if="club.showAddPost">
      <h1 class="club-title">{{ club.name }}</h1>
      <div class="admins-container">
        <h2 class="admins-title">Admin: {{ club.id }}</h2>
      </div>
    </div>

    <div class="search-container">
      <label for="searchQuery">搜索帖子：</label>
      <input v-model="searchQuery" id="searchQuery" placeholder="输入标签搜索帖子">
      <button @click="searchPosts">搜索</button>
    </div>

    <div class="posts-container">
      <Post v-for="(post, index) in sortedPosts" :key="index" :post="post" />
    </div>

    <div v-if="club.showAddPost">
      <div class="add-post-container">
        <h2>发表新帖</h2>
        <label for="postTitle">标题：</label>
        <input v-model="newPost.Ptitle" id="postTitle" placeholder="输入帖子标题">

        <label for="postTags">标签：</label>
        <input v-model="newPost.Plabel" id="postTags" placeholder="输入标签">

        <label for="postContent">内容：</label>
        <textarea v-model="newPost.Pcontent" id="postContent" placeholder="输入帖子内容"></textarea>

        <label for="postImage">插入图片：</label>
        <input type="file" @change="onImageChange" id="postImage" accept="image/*" required>

        <button @click="addPost">发表帖子</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import Post from "@/components/post/Post.vue";

export default {
  components: { Post },

  props: {
    club: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters('account', ['user']),
    sortedPosts() {
      return [...this.club.posts].sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.date) - new Date(a.date);
        }
        return a.isPinned ? -1 : 1;
      });
    },
  },

  data() {
    return {
      newPost: {
        Ptitle: '',
        Plabel: '',
        Pcontent: '',
        image: null, // 用于存储图片文件
      },
      searchQuery: '',
    };
  },

  methods: {
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPost.image = file; // 存储文件
      }
    },

    async addPost() {
      if (this.newPost.Ptitle.trim() === '' || this.newPost.Pcontent.trim() === '' || !this.newPost.image) {
        alert('请输入帖子标题、内容，并上传至少一张图片。');
        return;
      }

      const formData = new FormData();
      formData.append('Pid', null);
      formData.append('studentNumber', this.user.id);
      formData.append('title', this.newPost.Ptitle.trim());
      formData.append('label', this.newPost.Plabel.trim());
      formData.append('content', this.newPost.Pcontent.trim());
      formData.append('clubId', this.$route.params.id);
      formData.append('date', new Date().toISOString());
      formData.append('isPinned', false);
      formData.append('image', this.newPost.image); // 添加图片文件

      try {
        const response = await axios.post('http://localhost:8080/iClub/createPost/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.error_num === 0) {
          this.club.posts.push(response.data.post);
          this.newPost = { Ptitle: '', Plabel: '', Pcontent: '', image: null };
          window.location.reload();
        } else {
          alert('创建帖子出错：' + response.data.msg);
        }
      } catch (error) {
        console.error('创建帖子出错：', error);
      }
    },

    async searchPosts() {
      if (!this.searchQuery.trim()) {
        const postsResponse = await axios.get(`http://localhost:8080/iClub/getPosts/${this.club.id}`);
        this.$set(this.club, 'posts', postsResponse.data.posts);
        return;
      }

      try {
        const postsResponse = await axios.get(`http://localhost:8080/iClub/getPostsBySearch/${this.club.id}/${this.searchQuery}`);
        this.$set(this.club, 'posts', postsResponse.data.posts);
      } catch (error) {
        console.error('搜索帖子出错：', error);
      }
    },
  },
};
</script>

<style scoped>
.club-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
}

.add-post-container {
  margin-top: 21px;
}

.add-post-container h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.add-post-container label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.add-post-container input,
.add-post-container textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
}

.add-post-container button {
  padding: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  cursor: pointer;
}

.add-post-container button:hover {
  background-color: #0056b3;
}

.add-post-container img {
  max-width: 100%;
  height: auto;
}
</style>
