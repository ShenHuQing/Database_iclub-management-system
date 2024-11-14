<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
          :label="$t('title')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('titleInput')" />
      </a-form-item>
      <a-form-item
          :label="$t('describe')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="$t('describeInput')"/>
      </a-form-item>


      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary">{{$t('submit')}}</a-button>
        <a-button style="margin-left: 8px">{{$t('save')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'ActivityForm',
  i18n: require('./i18n'),
  data () {
    return {
      value: 1,
      notificationType: 'activity'  // 默认选择活动通知
    }
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    }
  }
}
</script>

<style scoped>
</style>
