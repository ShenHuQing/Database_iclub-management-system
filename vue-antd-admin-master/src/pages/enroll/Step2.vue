<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
          :closable="true"
          :message="$t('note')"
          style="margin-bottom: 24px;"
      />
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
          class="stepFormText"
      >
        <span>{{formData.id}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('name')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.name}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('college')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.college}}</span>
      </a-form-item>
      <a-form-item
          label="个人描述"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.description}}</span>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button :loading="loading" type="primary" @click="nextStep">{{$t('submit')}}</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">{{$t('preStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',  // 后端地址
  withCredentials: true,
});

export default {
  name: 'Step2',
  i18n: require('./i18n'),
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async nextStep () {
      let _this = this
      _this.loading = true
      await instance.post('/iClub/enroll',
          {
            id: Date.now().toString(),
            clubId: this.formData.clubId,
            studentId: this.formData.id,
            description: this.formData.description,
            create_time: new Date().toLocaleString()
          }
      )
          .then(response => {
            const res = response.data;
            if (res.code === 0) {
              _this.$emit('nextStep');
            } else {
              this.$message.error('报名失败，请重试', 3);
            }
          })
          .catch(error => {
            console.error('报名失败，请重试', error);
            this.$message.error('报名失败，请重试', error);
          })
      // setTimeout(function () {
      //   _this.$emit('nextStep')
      // }, 1500)
    },
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;
  :global {
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
}
</style>