<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
          :label="$t('id')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input v-model="formData.id" placeholder="请输入学号" />
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
          :label="$t('choose1')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select v-model="formData.choose1" placeholder="请选择社团" style="width: 355px">
            <a-select-option value="club1">{{$t('club1')}}</a-select-option>
            <a-select-option value="club2">{{$t('club2')}}</a-select-option>
            <a-select-option value="club3">{{$t('club3')}}</a-select-option>
            <a-select-option value="club4">{{$t('club4')}}</a-select-option>
            <a-select-option value="club5">{{$t('club5')}}</a-select-option>
            <a-select-option value="club6">{{$t('club6')}}</a-select-option>
            <a-select-option value="club7">{{$t('club7')}}</a-select-option>
            <a-select-option value="club8">{{$t('club8')}}</a-select-option>
            <a-select-option value="club9">{{$t('club9')}}</a-select-option>
            <a-select-option value="club10">{{$t('club10')}}</a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>

      <a-form-item
          :label="$t('choose2')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select v-model="formData.choose2" placeholder="请选择社团" style="width: 355px">
            <a-select-option value="club1">{{$t('club1')}}</a-select-option>
            <a-select-option value="club2">{{$t('club2')}}</a-select-option>
            <a-select-option value="club3">{{$t('club3')}}</a-select-option>
            <a-select-option value="club4">{{$t('club4')}}</a-select-option>
            <a-select-option value="club5">{{$t('club5')}}</a-select-option>
            <a-select-option value="club6">{{$t('club6')}}</a-select-option>
            <a-select-option value="club7">{{$t('club7')}}</a-select-option>
            <a-select-option value="club8">{{$t('club8')}}</a-select-option>
            <a-select-option value="club9">{{$t('club9')}}</a-select-option>
            <a-select-option value="club10">{{$t('club10')}}</a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>

      <a-form-item
          :label="$t('choose3')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 17}"
      >
        <a-input-group :compact="true" style="display: inline-block; vertical-align: middle">
          <a-select v-model="formData.choose3" placeholder="请选择社团" style="width: 355px">
            <a-select-option value="club1">{{$t('club1')}}</a-select-option>
            <a-select-option value="club2">{{$t('club2')}}</a-select-option>
            <a-select-option value="club3">{{$t('club3')}}</a-select-option>
            <a-select-option value="club4">{{$t('club4')}}</a-select-option>
            <a-select-option value="club5">{{$t('club5')}}</a-select-option>
            <a-select-option value="club6">{{$t('club6')}}</a-select-option>
            <a-select-option value="club7">{{$t('club7')}}</a-select-option>
            <a-select-option value="club8">{{$t('club8')}}</a-select-option>
            <a-select-option value="club9">{{$t('club9')}}</a-select-option>
            <a-select-option value="club10">{{$t('club10')}}</a-select-option>
          </a-select>
        </a-input-group>
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
  watch: {
    'formData.choose1': function (newVal) {
      this.formData.choose1Name = this.getClubName(newVal)
    },
    'formData.choose2': function (newVal) {
      this.formData.choose2Name = this.getClubName(newVal)
    },
    'formData.choose3': function (newVal) {
      this.formData.choose3Name = this.getClubName(newVal)
    }
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    getClubName(clubId) {
      const clubNames = {
        club1: this.$t('club1'),
        club2: this.$t('club2'),
        club3: this.$t('club3'),
        club4: this.$t('club4'),
        club5: this.$t('club5'),
        club6: this.$t('club6'),
        club7: this.$t('club7'),
        club8: this.$t('club8'),
        club9: this.$t('club9'),
        club10: this.$t('club10'),
      };
      return clubNames[clubId] || '';
    }
  }
}
</script>

<style scoped>

</style>

<!--<template>-->
<!--  <div>-->
<!--    <a-form style="max-width: 500px; margin: 40px auto 0;">-->
<!--      <a-form-item :label="$t('id')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-input v-model="studentId" placeholder="请输入学号" />-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('name')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-input v-model="studentName" placeholder="请输入姓名" />-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('college')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-input v-model="studentCollege" placeholder="学院" />-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose1')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-select v-model="firstChoice" placeholder="请选择社团" style="width: 355px">-->
<!--          <a-select-option v-for="(club, index) in clubs" :key="index" :value="club">{{ club }}</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose2')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-select v-model="secondChoice" placeholder="请选择社团" style="width: 355px">-->
<!--          <a-select-option v-for="(club, index) in clubs" :key="index" :value="club">{{ club }}</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('choose3')" :labelCol="{span: 7}" :wrapperCol="{span: 17}">-->
<!--        <a-select v-model="thirdChoice" placeholder="请选择社团" style="width: 355px">-->
<!--          <a-select-option v-for="(club, index) in clubs" :key="index" :value="club">{{ club }}</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
<!--      <a-form-item :wrapperCol="{span: 17, offset: 7}">-->
<!--        <a-button type="primary" @click="nextStep">{{ $t('nextStep') }}</a-button>-->
<!--      </a-form-item>-->
<!--    </a-form>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'Step1',-->
<!--  data() {-->
<!--    return {-->
<!--      studentId: '',-->
<!--      studentName: '',-->
<!--      studentCollege: '',-->
<!--      firstChoice: '',-->
<!--      secondChoice: '',-->
<!--      thirdChoice: '',-->
<!--      clubs: [-->
<!--        this.$t('club1'),-->
<!--        this.$t('club2'),-->
<!--        this.$t('club3'),-->
<!--        this.$t('club4'),-->
<!--        this.$t('club5'),-->
<!--        this.$t('club6'),-->
<!--        this.$t('club7'),-->
<!--        this.$t('club8'),-->
<!--        this.$t('club9'),-->
<!--        this.$t('club10'),-->
<!--      ],-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    nextStep() {-->
<!--      this.$emit('nextStep', {-->
<!--        id: this.studentId,-->
<!--        name: this.studentName,-->
<!--        college: this.studentCollege,-->
<!--        choices: [this.firstChoice, this.secondChoice, this.thirdChoice],-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
