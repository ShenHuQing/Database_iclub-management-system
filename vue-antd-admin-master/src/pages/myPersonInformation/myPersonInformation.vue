<template>
  <div class="student-info">
    <div v-if="isAdmin">
      <h2>管理员信息</h2>
      <img :src="admin.Aavatar" alt="头像" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p>姓名: {{ admin.Aname }}</p>
      <p>工号: {{ admin.AdminId }}</p>
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
  baseURL: 'http://127.0.0.1:8000',  // 后端地址
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
.student-info {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: '黑体', 'SimHei', sans-serif;
  background-color: #fff;
}
.student-info {
  font-size: 1.7em; /* Adjust the font size as needed */
}
p {
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px; /* Add some spacing between the text and the border */
  margin-bottom: 10px; /* Add some spacing between paragraphs */
}

label {
  display: block; /* Ensure labels are on their own line */
  margin-bottom: 5px; /* Add some spacing between labels */
}

input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

button {
  padding: 8px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
