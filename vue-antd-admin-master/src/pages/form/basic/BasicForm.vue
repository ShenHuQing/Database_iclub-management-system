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
          :label="$t('date')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-range-picker style="width: 100%" />
      </a-form-item>
      <a-form-item
          :label="$t('describe')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="$t('describeInput')"/>
      </a-form-item>
      <a-form-item
          :label="$t('metrics')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-textarea rows="4" :placeholder="$t('metricsInput')"/>
      </a-form-item>
      <a-form-item
          :label="$t('customer')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
          :required="false"
      >
        <a-input :placeholder="$t('customerInput')"/>
      </a-form-item>
      <a-form-item
          :label="$t('critics')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
          :required="false"
      >
        <a-input :placeholder="$t('criticsInput')"/>
      </a-form-item>
      <a-form-item
          :label="$t('signupTime')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-range-picker style="width: 100%" />
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
      value: 1
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
