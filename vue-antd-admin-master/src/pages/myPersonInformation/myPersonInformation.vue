<template>
  <div class="student-info">
    <div v-if="isAdmin">
      <h2>管理员信息</h2>
      <img :src="admin.Aavatar" alt="头像" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p>姓名: {{ admin.Aname }}</p>
      <p>邮箱: {{ admin.Aemail }}</p>
      <button @click="toggleEditMode">{{ editing ? '关闭' : '修改' }}</button>
      <div v-if="editing">
        <label for="aname">姓名:</label>
        <input v-model="admin.Aname" id="aname" />
        <br>
        <label for="aemail">邮箱:</label>
        <input v-model="admin.Aemail" id="aemail" type="email" />
        <br>
        <label for="aavatar">头像:</label>
        <input type="file" @change="onFileChange" id="aavatar" />
        <br>
        <button @click="saveChanges">保存更改</button>
      </div>
    </div>

    <div v-else>
      <h2>学生信息</h2>
      <img :src="student.Savatar" alt="头像" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p>姓名: {{ student.Sname }}</p>
      <p>学号: {{ student.Sid }}</p>
      <p>年级: {{ student.Sgrade }}</p>
      <p>专业: {{ student.Smajor }}</p>
      <p>邮箱: {{ student.Semail }}</p>
      <p>兴趣爱好: {{ student.Shobby }}</p>
      <p>个性签名: {{ student.Ssignature }}</p>
      <button @click="toggleEditMode">{{ editing ? '关闭' : '修改' }}</button>
      <div v-if="editing">
        <label for="sname">姓名:</label>
        <input v-model="student.Sname" id="sname" />
        <br>
        <label for="sgrade">年级:</label>
        <input v-model.number="student.Sgrade" id="sgrade" type="number" />
        <br>
        <label for="smajor">专业:</label>
        <input v-model="student.Smajor" id="smajor" />
        <br>
        <label for="semail">邮箱:</label>
        <input v-model="student.Semail" id="semail" type="email" />
        <br>
        <label for="savatar">头像:</label>
        <input type="file" @change="onFileChange" id="savatar" />
        <br>
        <button @click="saveChanges">保存更改</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  data() {
    return {
      isAdmin: false,
      admin: {
        AdminId: '',
        Aname: '',
        Aemail: '',
        Aavatar: '',
      },
      student: {
        Sid: '',
        Sname: '',
        Sgrade: null,
        Smajor: '',
        Semail: '',
        Shobby: '',
        Ssignature: '',
        Savatar: '',
      },
      editing: false,
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    toggleEditMode() {
      this.editing = !this.editing;
    },
    fetchUserInfo() {
      const userId = this.user.id;

      if (userId.length === 5) {
        instance.get('/StudyApp/get_admin_info/', {
          params: { adminId: userId },
        })
            .then(response => {
              this.isAdmin = true;
              this.admin = response.data.admin_info;
            })
            .catch(error => {
              console.error('获取管理员信息时出错:', error.response.data.error);
            });
      } else if (userId.length === 8) {
        instance.get('/StudyApp/get_student_info/', {
          params: { studentNumber: userId },
        })
            .then(response => {
              this.isAdmin = false;
              this.student = response.data.student_info;
            })
            .catch(error => {
              console.error('获取学生信息时出错:', error.response.data.error);
            });
      } else {
        console.error('用户ID不合法');
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          if (this.isAdmin) {
            this.admin.Aavatar = e.target.result;
          } else {
            this.student.Savatar = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    saveChanges() {
      const payload = this.isAdmin ? this.admin : this.student;
      const url = this.isAdmin
          ? '/StudyApp/update_admin_info/'
          : '/StudyApp/update_student_info/';

      instance.post(url, payload)
          .then(response => {
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
