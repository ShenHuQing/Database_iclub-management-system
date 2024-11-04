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
import {mapGetters} from "vuex";

export default {
  name: 'StepForm',
  i18n: require('./i18n'),
  components: {Step1, Step2, Step3},
  data () {
    return {
      current: 0,
      formData: {
        clubName: '',
        clubId: '',
        id: '',
        name: '',
        college: '',
        description: '',
      }
    }
  },
  mounted() {
    this.formData.clubName = this.$route.query.clubName;
    this.formData.clubId = this.$route.query.clubId;
    this.formData.id = this.user.id;
    console.log(this.formData.clubName);
  },
  computed: {
    ...mapGetters('account', ['user','roles']),
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