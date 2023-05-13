import request from '@/utils/request'

// 查询新闻列表
export function listNews(query) {
  return request({
    url: '/app/news/list',
    method: 'get',
    params: query
  })
}
