<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{welcome.timeFix[lang]}}，{{currUser.name}}，{{welcome.message[lang]}}</div>
      <div>{{"currUser.position[lang]"}}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('activity')" content="56"/>
      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>
      <head-info class="split-right" :title="$t('visit')" content="2,223"/>
    </template>
    <div>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="activity-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" :title="$t('activityTitle')" :body-style="{padding: 0}">
            <a slot="extra">{{$t('all')}}</a>
            <div>
              <a-card-grid :key="i" v-for="(item, i) in activitys">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta :description="item.desc">
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.logo" />
                      <span>Alipay</span>
                    </div>
                  </a-card-meta>
                  <div class="activity-item">
                    <a class="group" href="https://www.buaa.edu.cn/">活动预告</a>
                    <span class="datetime">12小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('noticeTitle')" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in notices">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar" />
                  <div slot="title" v-html="item.template" />
                  <div slot="description">9小时前</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'WorkPlace',
  components: {HeadInfo, PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      activitys: [],
      loading: true,
      notices: [],
      welcome: {
        timeFix: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {
    request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    request('/notice', METHOD.GET).then(res => this.notices = res.data)
    request('/activity', METHOD.GET).then(res => {
      this.activitys = res.data
      this.loading = false
    })
  }
}
</script>

<style lang="less">
@import "index";
</style>
