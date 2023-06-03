import request from '@/utils/request'

// 查询新闻列表
export function listOrder(data) {
  return request({
    url: '/app/mallOrder/list',
    method: 'POST',
    data: data
  })
}
