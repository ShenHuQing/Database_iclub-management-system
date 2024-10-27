<template>
  <div class="container">
    <a-card :bordered="false" class="search-form" style="margin-bottom: 24px;">
      <a-form :form="form">
        <form-row label="社团类别">
          <a-form-item>
            <tag-select @change="handleTagSelectChange" placeholder="请选择社团类别">
              <tag-select-option v-for="(label, index) in clubTypes" :key="index" :value="index+1">
                {{ label }}
              </tag-select-option>
            </tag-select>
          </a-form-item>
        </form-row>

        <form-row label="搜索" style="padding-bottom: 11px">
          <a-form-item>
            <a-input
                v-model="searchContent"
                placeholder="请输入搜索内容"
                style="max-width: 286px"
            />
          </a-form-item>
        </form-row>

        <a-button type="primary" @click="fetchIndexClubInfo" style="margin-top: 12px;">搜索</a-button>
      </a-form>
    </a-card>

    <a-list
        :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin: 0 -8px"
    >
      <a-list-item
          v-for="club in clubs"
          :key="club.id"
          @click="gotoClub1example(club)"
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
//import SearchForm from '../list/search/SearchForm'
//import AvatarList from '../../components/tool/AvatarList'
import axios from "axios";
import TagSelect from "../../components/tool/TagSelect.vue";
import FormRow from "../../components/form/FormRow.vue";
import form from "ant-design-vue/lib/form";

const TagSelectOption = TagSelect.Option

//const AvatarListItem = AvatarList.Item

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'Club',
  computed: {
    form() {
      return form
    }
  },
  components: {
    FormRow, TagSelect, TagSelectOption
    /*AvatarListItem, AvatarList, SearchForm*/},
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
      clubTypes: ['科技类', '人文类', '实践类', '体育类', '艺术类'],
      selectedTypes: [

      ],
      searchContent: '',
      loading: false,
    };
  },
  mounted() {
    this.fetchClubInfo();
  },
  methods: {
    gotoClub1example() {
      this.$router.push({path: '/club1example'})
    },
    handleTagSelectChange(value) {
      if (!this.selectedTypes.includes(value)) {
        this.selectedTypes.push(value);
      } else {
        this.selectedTypes = this.selectedTypes.filter(type => type !== value);
      }
    },
    fetchClubInfo() {
      this.loading = true;
      instance.get('/iClub/get_default_clubs_info')
          .then(response => {
            this.clubs = response.data.data;
          })
          .catch(error => {
            console.error('获取社团信息时出错:', error.response.data.error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    fetchIndexClubInfo() {
      this.loading = true;
      instance.post('/iClub/get_index_clubs_info', {type: this.selectedTypes, name: this.searchContent})
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