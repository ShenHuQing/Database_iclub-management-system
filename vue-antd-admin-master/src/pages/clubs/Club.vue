<template>
  <div>
    <a-card :bordered="false" class="search-form">
      <a-form :form="form">
        <form-row label="社团类别">
          <a-form-item>
            <tag-select @change="handleTagSelectChange">
              <tag-select-option v-for="(label, index) in clubTypes" :key="index" :value="index + 1">
                {{ label }}
              </tag-select-option>>
            </tag-select>
          </a-form-item>
        </form-row>

        <form-row label="搜索" style="padding-bottom: 11px">
          <a-form-item>
            <a-input>
              v-model="searchContent"
              placeholder="请输入搜索内容"
              style="max-width: 286px"
            </a-input>
          </a-form-item>
        </form-row>

        <a-button type="primary" @click="fetchIndexClubInfo">搜索</a-button>
      </a-form>
    </a-card>


      <a-list
          :grid='{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }'
          style="margin: 0 -8px"
      >
      <a-list-item v-for="club in clubs" :key="club.id" @click="gotoClub1example(club)" style="padding: 0 8px">
        <a-card>
          <img slot="cover" src="club.pictureId" height="154"/>
          <a-card-meta title="club.name">
            <div slot="type">
              {{club.type}}
            </div>
          </a-card-meta>

<!--          <div class="content">-->
<!--            <span>4小时前</span>-->
<!--            <avatar-list>-->
<!--              <avatar-list-item size="small" tips="曲丽丽" src="https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png" />-->
<!--              <avatar-list-item size="small" tips="周星星" src="https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png" />-->
<!--              <avatar-list-item size="small" tips="董娜娜" src="https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png" />-->
<!--            </avatar-list>-->
<!--          </div>-->

        </a-card>
      </a-list-item>
    </a-list>
    </div>
</template>

<script>
//import SearchForm from '../list/search/SearchForm'
//import AvatarList from '../../components/tool/AvatarList'
import axios from "axios";
import TagSelect from "../../components/tool/TagSelect.vue";
import FormRow from "../../components/form/FormRow.vue";

const TagSelectOption = TagSelect.Option

//const AvatarListItem = AvatarList.Item

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'Club',
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