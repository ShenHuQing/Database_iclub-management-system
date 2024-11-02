<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
          :closable="true"
          :message="$t('note')"
          style="margin-bottom: 24px;"
      />
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
          :label="$t('第一志愿')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.choose1Name}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('第二志愿')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.choose2Name}}</span>
      </a-form-item>
      <a-form-item
          :label="$t('第三志愿')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
          class="stepFormText"
      >
        <span>{{formData.choose3Name}}</span>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button :loading="loading" type="primary" @click="nextStep">{{$t('submit')}}</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">{{$t('preStep')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
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
    nextStep () {
      let _this = this
      _this.loading = true
      setTimeout(function () {
        _this.$emit('nextStep')
      }, 1500)
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

<!--<template>-->
<!--  <div>-->
<!--    <a-form style="max-width: 500px; margin: 40px auto 0;">-->
<!--      <a-alert :closable="true" :message="$t('note')" style="margin-bottom: 24px;" />-->
<!--      <a-form-item :label="$t('id')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.id }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('name')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.name }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('college')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.college }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose1')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.choices[0] }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose2')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.choices[1] }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose3')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        {{ studentData.choices[2] }}-->
<!--      </a-form-item>-->
<!--      <a-form-item :wrapperCol="{span: 17, offset: 7}">-->
<!--        <a-button :loading="loading" type="primary" @click="nextStep">{{ $t('submit') }}</a-button>-->
<!--        <a-button style="margin-left: 8px" @click="prevStep">{{ $t('preStep') }}</a-button>-->
<!--      </a-form-item>-->
<!--    </a-form>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'Step2',-->
<!--  props: {-->
<!--    studentData: {-->
<!--      type: Object,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      loading: false,-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    nextStep() {-->
<!--      this.loading = true;-->
<!--      setTimeout(() => {-->
<!--        this.$emit('nextStep');-->
<!--      }, 1500);-->
<!--    },-->
<!--    prevStep() {-->
<!--      this.$emit('prevStep');-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
