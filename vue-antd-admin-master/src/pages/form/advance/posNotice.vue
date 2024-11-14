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
      <a-form-item
          :label="$t('critics')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
          :required="false"
      >
        <a-input :placeholder="$t('criticsInput')"/>
      </a-form-item>
      <!-- 修改为单一时间选择 -->
      <a-form-item
          :label="$t('signupTime')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-date-picker
            style="width: 100%"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择发布时间"
        />
      </a-form-item>
      <a-form-item
          :label="$t('uploadImage')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-upload
            action="/upload"
            list-type="picture"
            :show-upload-list="true"
        >
          <a-button>
            <a-icon type="upload" /> {{$t('upload')}}
          </a-button>
        </a-upload>
      </a-form-item>

      <!-- 新增通知类型 -->
      <a-form-item
          :label="$t('notificationType')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-radio-group v-model="notificationType">
          <a-radio value="activity">{{$t('activityNotification')}}</a-radio>
          <a-radio value="clubApproval">{{$t('clubApprovalNotification')}}</a-radio>
          <a-radio value="eventApproval">{{$t('eventApprovalNotification')}}</a-radio>
        </a-radio-group>
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
