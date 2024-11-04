<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
          label="报名社团"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <span>{{formData.clubName}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('id')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <span>{{formData.id}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('name')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input v-model="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item
          :label="$t('college')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input v-model="formData.college" placeholder="请输入学院" />
      </a-form-item>
      <a-form-item
          label="个人描述"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-textarea
            v-model="formData.description"
            placeholder="请输入个人描述，不超过300个字"
            :rows="4"
            max-Length="300"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button type="primary" @click="nextStep">{{$t('nextStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  i18n: require('./i18n'),
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  methods: {
    nextStep () {
      if (this.formData.id === '') {
        this.$message.error('学号不能为空',3);
      } else if(this.formData.name === '') {
        this.$message.error('姓名不能为空',3);
      } else if(this.formData.college === '') {
        this.$message.error('学院不能为空',3);
      } else if(this.formData.description === '') {
        this.$message.error('个人描述不能为空',3);
      } else {
        this.$emit('nextStep');
      }
    },
  }
}
</script>

<style scoped>

</style>