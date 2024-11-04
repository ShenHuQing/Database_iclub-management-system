<template>
  <page-layout title="学生信息详情页">
    <a-card :bordered="false">
      <div class="title">学生信息</div>
      <a-table
          row-key="studentId"
      style="margin-bottom: 24px"
      :columns="studentColumns"
      :dataSource="studentData"
      :pagination="false"
      >
      </a-table>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '../../layouts/PageLayout'
import axios from 'axios'

const studentColumns = [
  {
    title: '学号',
    dataIndex: 'studentId',
    key: 'studentId'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'major'
  }
]

export default {
  name: 'StudentDetail',
  components: { PageLayout },
  data () {
    return {
      clubId: 'your-club-id', // 替换为你实际的 clubId
      studentColumns,
      studentData: [] // 初始化为空数组
    }
  },
  mounted () {
    this.fetchStudentData()
  },
  methods: {
    async fetchStudentData() {
      try {
        const response = await axios.get('/iClub/getMembers', {
          params: {
            clubId: this.clubId // 传递 clubId 作为查询参数
          }
        })
        this.studentData = response.data // 假设后端返回的数据格式正确
      } catch (error) {
        console.error('Error fetching student data:', error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: @title-color;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
