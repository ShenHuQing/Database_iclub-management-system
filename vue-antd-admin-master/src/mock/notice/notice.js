import Mock from 'mockjs'
import '@/mock/extend'

const noticeArr = Mock.mock({
    'list|6': [
        {
            logo: '@LOGO',
            desc: '@SAYING'
        }
    ]
}).list

Mock.mock('/notice', 'get', () => {
    return noticeArr
})
