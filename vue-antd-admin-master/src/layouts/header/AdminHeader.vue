<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{systemName}}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/>
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect"/>
      </div>
      <div :class="['admin-header-right', headerTheme]">
<!--          <header-search class="header-item" @active="val => searchActive = val" />-->
<!--          <a-tooltip class="header-item" title="帮助文档" placement="bottom" >-->
<!--            <a href="https://iczer.gitee.io/vue-antd-admin-docs/" target="_blank">-->
<!--              <a-icon type="question-circle-o" />-->
<!--            </a>-->
<!--          </a-tooltip>-->
<!--          <header-notice class="header-item"/>-->
          <header-avatar class="header-item"/>
          <span v-if="roles !== 'admin'" style="font-weight: bold;">积分：{{score}}</span>
<!--          <a-dropdown class="lang header-item">-->
<!--            <div>-->
<!--              <a-icon type="global"/> {{langAlias}}-->
<!--            </div>-->
<!--            <a-menu v-if="langList.length" @click="val => setLang(val.key)" :selected-keys="[lang]" slot="overlay">-->
<!--              <a-menu-item v-for=" lang in langList" :key="lang.key">{{lang.key.toLowerCase() + ' ' + lang.name}}</a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
      </div>
    </div>
  </a-layout-header>
</template>

<script>
//import HeaderSearch from './HeaderSearch'
//import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import {mapState, mapMutations, mapGetters} from 'vuex'
import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'AdminHeader',
  components: {IMenu, HeaderAvatar},
  props: ['collapsed', 'menuData'],
  data() {
    return {
      langList: [
        {key: 'CN', name: '简体中文', alias: '简体'},
        {key: 'HK', name: '繁體中文', alias: '繁體'},
        {key: 'US', name: 'English', alias: 'English'}
      ],
      score: 0,
      searchActive: false
    }
  },
  mounted() {
    if (this.roles !== 'admin') {
      this.fetchScore();
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    ...mapGetters('account', ['user','roles']),
    headerTheme () {
      if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    langAlias() {
      let lang = this.langList.find(item => item.key == this.lang)
      return lang.alias
    },
    menuWidth() {
      const {layout, searchActive} = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    fetchScore() {
      instance.post('/iClub/getScore',
          {studentId: this.user.id,
          })
          .then(response => {
            this.score = response.data.data;
          })
          .catch(error => {
            console.error('获取积分失败，请重试', error);
            this.$message.error('获取积分失败，请重试', 3);
          })
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
