import request from '@/utils/request'

// 名言警句 https://api.xygeng.cn/one
export function randomMingyan() {
  return request({
    url: 'https://api.xygeng.cn/one',
    headers: {
      isToken: false
    },
    method: 'get'
  })
} 
