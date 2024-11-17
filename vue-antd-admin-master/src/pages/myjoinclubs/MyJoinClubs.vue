<template>
  <div class="container">
    <a-list
        :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin: 0 -8px"
    >
      <a-list-item
          v-for="club in clubs"
          :key="club.id"
          @click="gotoClubDetail(club)"
          style="padding: 0 8px"
      >
        <a-card hoverable style="border-radius: 8px; transition: transform 0.3s;">
          <img
              :src="club.pictureId"
              height="154"
              style="border-top-left-radius: 8px; border-top-right-radius: 8px; object-fit: cover; width: 100%;"
          />
          <a-card-meta style="padding: 16px;">
            <div class="club-name" slot="title">
              {{ club.name }}
            </div>
            <div slot="type" style="font-weight: bold; color: #999;">
              {{ club.type }}
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-form {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.a-card {
  transition: transform 0.2s;
}

.a-card:hover {
  transform: scale(1.05);
}

a-input {
  border-radius: 4px;
}

a-button {
  border-radius: 4px;
}

.club-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px; /* 增加底部间距 */
}
</style>


<script>
import axios from "axios";
import form from "ant-design-vue/lib/form";
import {mapGetters} from "vuex";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'Club',
  computed: {
    ...mapGetters('account', ['user','roles']),
    form() {
      return form
    }
  },
  data() {
    return {
      clubs: [
        {
          id: '',
          name: '',
          type: '',
          description: '',
          pictureId: ''
        }
      ],
      loading: false,
    };
  },
  mounted() {
    this.fetchClubInfo();
  },
  methods: {
    gotoClubDetail(club) {
      this.$router.push({path: `/clubdetail/${club.id}`})
    },
    fetchClubInfo() {
      this.loading = true;
      instance.post('/iClub/getJoinedClubs', {studentId: this.user.id})
          .then(response => {
            this.clubs = response.data.data;
          })
          .catch(error => {
            console.error('获取社团信息时出错:', error.response.data.error);
          })
          .finally(() => {
            this.loading = false;
          });
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  display: flex;
  margin-top: 16px;
  margin-bottom: -4px;
  line-height: 20px;
  height: 20px;
  & > span {
    color: @text-color-second;
    flex: 1;
    font-size: 12px;
  }
  //.avatarList {
  //  flex: 0 1 auto;
  //}
}
</style>