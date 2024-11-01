import Mock from 'mockjs'
import '@/mock/extend'

const activityArr = Mock.mock({
  'list|6': [
    {
      logo: '@LOGO',
      desc: '@SAYING'
    }
  ]
}).list

Mock.mock('/activity', 'get', () => {
  return activityArr
})
