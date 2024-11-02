<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="current">
      <a-step :title="$t('input')" />
      <a-step :title="$t('confirm')" />
      <a-step :title="$t('complete')" />
    </a-steps>
    <div class="content">
      <step1 v-if="current === 0" :formData="formData" @nextStep="nextStep"></step1>
      <step2 v-if="current === 1" :formData="formData" @nextStep="nextStep" @prevStep="prevStep"></step2>
      <step3 v-if="current === 2" @prevStep="prevStep" @finish="finish"></step3>
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'StepForm',
  i18n: require('./i18n'),
  components: {Step1, Step2, Step3},
  data () {
    return {
      current: 0,
      formData: {
        id: '',
        name: '',
        college: '',
        choose1: '',
        choose2: '',
        choose3: '',
        choose1Name: '',
        choose2Name: '',
        choose3Name: '',
      }
    }
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    }
  },
  methods: {
    nextStep () {
      if (this.current < 2) {
        this.current += 1
      }
    },
    prevStep () {
      if (this.current > 0) {
        this.current -= 1
      }
    },
    finish () {
      this.current = 0
    }
  }
}
</script>

<!--<style lang="less" scoped>-->
<!--.steps{-->
<!--  max-width: 950px;-->
<!--  margin: 16px auto;-->
<!--}-->
<!--</style>-->

<!--<template>-->
<!--  <a-card :bordered="false">-->
<!--    <a-steps class="steps" :current="current">-->
<!--      <a-step :title="$t('input')" />-->
<!--      <a-step :title="$t('confirm')" />-->
<!--      <a-step :title="$t('complete')" />-->
<!--    </a-steps>-->
<!--    <div class="content">-->
<!--      <step1 v-if="current === 0" @nextStep="handleNextStep"></step1>-->
<!--      <step2 v-if="current === 1" :studentData="step1Data" @nextStep="nextStep" @prevStep="prevStep"></step2>-->
<!--      <step3 v-if="current === 2" @prevStep="prevStep" @finish="finish"></step3>-->
<!--    </div>-->
<!--  </a-card>-->
<!--</template>-->

<!--<script>-->
<!--import Step1 from './Step1';-->
<!--import Step2 from './Step2';-->
<!--import Step3 from './Step3';-->

<!--export default {-->
<!--  name: 'StepForm',-->
<!--  components: { Step1, Step2, Step3 },-->
<!--  data() {-->
<!--    return {-->
<!--      current: 0,-->
<!--      step1Data: {},-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    handleNextStep(data) {-->
<!--      this.step1Data = data;-->
<!--      this.current += 1;-->
<!--    },-->
<!--    nextStep() {-->
<!--      if (this.current < 2) {-->
<!--        this.current += 1;-->
<!--      }-->
<!--    },-->
<!--    prevStep() {-->
<!--      if (this.current > 0) {-->
<!--        this.current -= 1;-->
<!--      }-->
<!--    },-->
<!--    finish() {-->
<!--      this.current = 0;-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
