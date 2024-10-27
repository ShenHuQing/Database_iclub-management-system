<template>
  <div class="student-info">
    <div v-if="isAdmin === 1">
      <h2>管理员信息</h2>
      <img :src="admin.pictureId" alt="头像" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p>姓名: {{ admin.name }}</p>
      <p>邮箱: {{ admin.email}}</p>
      <button @click="toggleEditMode">{{ editing ? '关闭' : '修改' }}</button>
      <div v-if="editing">
        <label for="name">姓名:</label>
        <input v-model="admin.name" id="name" />
        <br>
        <label for="email">邮箱:</label>
        <input v-model="admin.email" id="email" type="email" />
        <br>
        <label for="pictureID">头像:</label>
        <input type="file" @change="onFileChange" id="pictureID" />
        <br>
        <button @click="saveChanges">保存更改</button>
      </div>
    </div>

    <div v-if="isAdmin === 0">
      <h2>学生信息</h2>
      <img :src="student.pictureId" alt="头像" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p>姓名: {{ student.name }}</p>
      <p>学号: {{ student.id}}</p>
      <p>性别: {{ student.gender}}</p>
      <p>年级: {{ student.grade }}</p>
      <p>专业: {{ student.major }}</p>
      <p>邮箱: {{ student.email }}</p>
      <p>兴趣爱好: {{ student.hobby }}</p>
      <p>个性签名: {{ student.signature}}</p>
      <button @click="toggleEditMode">{{ editing ? '关闭' : '修改' }}</button>
      <div v-if="editing">
        <label for="name">姓名:</label>
        <input v-model="student.name" id="name" />
        <br>
        <label for="name">性别:</label>
        <input v-model="student.gender" id="gender" />
        <br>
        <label for="grade">年级:</label>
        <input v-model.number="student.grade" id="grade" type="number" />
        <br>
        <label for="major">专业:</label>
        <input v-model="student.major" id="major" />
        <br>
        <label for="email">邮箱:</label>
        <input v-model="student.email" id="email" type="email" />
        <br>
        <label for="email">兴趣爱好:</label>
        <input v-model="student.hobby" id="hobby"/>
        <br>
        <label for="email">个性签名:</label>
        <input v-model="student.signature" id="signature"/>
        <br>
        <label for="pictureID">头像:</label>
        <input type="file" @change="onFileChange" id="pictureID" />
        <br>
        <button @click="saveChanges">保存更改</button>
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
      } else if (role === 'student') {
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
            this.admin.pictureId = e.target.result;
          } else {
            this.student.pictureId = e.target.result;
          }
        };
        reader.readAsDataURL(file);
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
    },
  }
}
</script>

<style scoped>
/* 页面整体样式 */
body {
  background-color: #f7f7f7;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

/* 学生和管理员信息的容器 */
.student-info {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: linear-gradient(to right, #fff, #f7f7f7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 1.4em;
}

/* 标题样式 */
h2 {
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 15px;
  color: #007BFF;
}

/* 图片样式 */
img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #007BFF;
}

/* 段落样式 */
p {
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 1.2em;
}

/* 标签和输入框样式 */
label {
  display: block;
  margin-bottom: 5px;
  font-size: 1.1em;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 1.1em;
}

input:focus {
  outline: none;
  border-color: #007BFF;
}

/* 按钮样式 */
button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* 动画和过渡效果 */
.student-info div {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-info {
    padding: 10px;
    font-size: 1.1em;
  }

  img {
    width: 80px;
    height: 80px;
  }

  button {
    padding: 8px 16px;
    font-size: 1em;
  }
}
</style>
