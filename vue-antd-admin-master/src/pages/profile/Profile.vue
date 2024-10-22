<template>
  <div class="profile">
    <h1>个人中心</h1>
    <div class="profile-info">
      <img :src="user.avatar" alt="User Avatar" class="avatar"/>
      <div class="info">
        <div class="info-item">
          <span class="label">用户名:</span>
          <span v-if="!isEditing">{{ user.name }}</span>
          <input v-if="isEditing" v-model="user.name" class="input-field" />
        </div>
        <div class="info-item">
          <span class="label">邮箱:</span>
          <span v-if="!isEditing">{{ user.email }}</span>
          <input v-if="isEditing" v-model="user.email" class="input-field" />
        </div>
        <div class="info-item">
          <span class="label">职位:</span>
          <span v-if="!isEditing">{{ user.position }}</span>
          <input v-if="isEditing" v-model="user.position" class="input-field" />
        </div>
      </div>
    </div>
    <div class="actions">
      <a-button v-if="!isEditing" type="primary" @click="editProfile">编辑资料</a-button>
      <a-button v-if="isEditing" type="primary" @click="saveProfile">保存</a-button>
      <a-button type="danger" @click="logout">退出登录</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      isEditing: false,
      user: {
        name: '张三',
        email: 'zhangsan@example.com',
        position: '前端工程师',
        avatar: 'https://example.com/avatar.jpg'
      }
    };
  },
  methods: {
    editProfile() {
      this.isEditing = true;
    },
    saveProfile() {
      console.log("保存用户资料:", this.user);
      this.isEditing = false;
    },
    logout() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
}
.profile-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}
.info {
  font-size: 16px;
}
.info-item {
  display: flex; /* 使用 flex 布局使标签和输入框在同一行 */
  align-items: center; /* 垂直居中对齐 */
}
.label {
  width: 80px;
  font-weight: bold;
  margin-right: 10px;
}
.input-field {
  padding: 8px; /* 设置内边距 */
  font-size: 16px; /* 字体大小 */
  height: 24px; /* 设置高度，确保不影响整体布局 */
  line-height: 24px; /* 设置行高，使输入框内文本垂直居中 */
  border: 1px solid #ccc; /* 边框样式 */
  border-radius: 4px; /* 圆角边框 */
  flex: 1; /* 使输入框占用剩余空间 */
}
.actions {
  margin-top: 20px;
}
</style>
