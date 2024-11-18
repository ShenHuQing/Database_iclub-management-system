<template>
  <div class="student-info">
    <div v-if="isAdmin === 1" class="card admin-card">
      <h2>管理员信息</h2>
      <div class="profile">
        <img :src="admin.pictureId || ''" alt="头像" />
        <div class="profile-info">
          <p><strong>姓名:</strong> {{ admin.name }}</p>
          <p><strong>邮箱:</strong> {{ admin.email }}</p>
        </div>
      </div>
      <button class="edit-btn" @click="toggleEditMode">
        {{ editing ? '关闭' : '修改' }}
      </button>
      <div v-if="editing" class="edit-section">
        <label for="name">姓名:</label>
        <input v-model="admin.name" id="name" />
        <label for="email">邮箱:</label>
        <input v-model="admin.email" id="email" type="email" />
        <label for="pictureID">头像:</label>
        <input type="file" @change="onFileChange" id="pictureID" />
        <button class="save-btn" @click="saveChanges">保存更改</button>
      </div>
    </div>

    <div v-if="isAdmin === 0" class="card student-card">
      <h2>学生信息</h2>
      <div class="profile">
        <img :src="student.pictureId || ''" alt="头像" />
        <div class="profile-info">
          <p><strong>姓名:</strong> {{ student.name }}</p>
          <p><strong>学号:</strong> {{ student.id }}</p>
          <p><strong>性别:</strong> {{ student.gender }}</p>
          <p><strong>年级:</strong> {{ student.grade }}</p>
          <p><strong>专业:</strong> {{ student.major }}</p>
          <p><strong>邮箱:</strong> {{ student.email }}</p>
          <p><strong>兴趣爱好:</strong> {{ student.hobby }}</p>
          <p><strong>个性签名:</strong> {{ student.signature }}</p>
        </div>
      </div>
      <button class="edit-btn" @click="toggleEditMode">
        {{ editing ? '关闭' : '修改' }}
      </button>
      <div v-if="editing" class="edit-section">
        <label for="name">姓名:</label>
        <input v-model="student.name" id="name" />
        <label for="gender">性别:</label>
        <input v-model="student.gender" id="gender" />
        <label for="grade">年级:</label>
        <input v-model.number="student.grade" id="grade" type="number" />
        <label for="major">专业:</label>
        <input v-model="student.major" id="major" />
        <label for="email">邮箱:</label>
        <input v-model="student.email" id="email" type="email" />
        <label for="hobby">兴趣爱好:</label>
        <input v-model="student.hobby" id="hobby" />
        <label for="signature">个性签名:</label>
        <input v-model="student.signature" id="signature" />
        <label for="pictureID">头像:</label>
        <input type="file" @change="onFileChange" id="pictureID" />
        <button class="save-btn" @click="saveChanges">保存更改</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import {mapGetters, mapMutations} from 'vuex';

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  data() {
    return {
      isAdmin: -1,
      admin: {
        id: '',
        password:'',
        name: '',
        email:'',
        pictureId: ''
      },
      student: {
        id: '',
        password:'',
        name: '',
        email:'',
        gender:'',
        major: '',
        grade: '',
        score:'',
        hobby: '',
        signature: '',
        isStaff:'',
        pictureId: '',
      },
      editing: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters('account', ['user','roles']),
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    ...mapMutations('account', ['setUser']),
    toggleEditMode() {
      this.editing = !this.editing;
    },
    fetchUserInfo() {
      this.loading = true;
      const role = this.roles;
      if (role === 'admin') {
        const id = this.user.id;
        instance.post('/iClub/get_admin_info', {id})
            .then(response => {
              this.isAdmin = 1;
              this.admin = response.data.data;
            })
            .catch(error => {
              console.error('获取管理员信息时出错:', error.response.data.error);
            });
      } else if (role === 'student' || role === 'staff') {
        const id = this.user.id;
        instance.post('/iClub/get_student_info', {id})
            .then(response => {
              this.isAdmin = 0;
              this.student = response.data.data;
            })
            .catch(error => {
              console.error('获取学生信息时出错:', error.response.data.error);
            });
      } else {
        console.error('未知角色:', role);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          if (this.isAdmin === 1) {
            this.admin.pictureId = e.target.result; // 这里更新 admin 的图片
          } else {
            this.student.pictureId = e.target.result; // 这里更新 student 的图片
          }
        };
        reader.readAsDataURL(file); // 读取文件为 Data URL
      }
    },
    saveChanges() {
      const payload = this.isAdmin === 1 ? this.admin : this.student;
      const url = this.isAdmin === 1
          ? '/iClub/update_admin_info'
          : '/iClub/update_student_info';

      instance.post(url, payload)
          .then(response => {
            if(this.isAdmin === 1) {
              this.setUser(this.admin);
            }else {
              this.setUser(this.student);
            }
            console.log('信息更改已保存:', response.data.message);
            this.editing = false;
          })
          .catch(error => {
            console.error('保存更改时出错:', error.response.data.error);
          });
    }
  }
}
</script>

<style scoped>
/* 页面整体样式 */
body {
  background-color: #f5f8fa;
  font-family: 'Arial', sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

.student-info {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.8em;
  color: #007BFF;
  text-align: center;
  margin-bottom: 20px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.profile img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #007BFF;
  object-fit: cover;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  color: #aaa;
  text-align: center;
}

/* 添加：当图片不存在时显示默认的“头像”文字 */
.profile img:empty::before {
  content: "头像";
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 1.2em;
  color: #aaa;
  background-color: #f0f0f0;
  border-radius: 50%;
}

.profile-info {
  flex: 1;
}

.profile-info p {
  margin: 5px 0;
  font-size: 1.1em;
}

button {
  display: inline-block;
  background: linear-gradient(45deg, #007BFF, #0056b3);
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  width: 100%;
  margin-top: 10px;
}

.save-btn {
  margin-top: 10px;
  width: 100%;
}

input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin: 10px 0;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
}

input:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
}
</style>
