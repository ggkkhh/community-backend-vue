import request from '@/utils/request'

// 查询新闻列表
export function listNews(query) {
  return request({
    url: '/app/news/list',
    method: 'get',
    params: query
  })
}

export function newsDetails(newsId) {
  return request({
    url: '/app/news/'+newsId,
    method: 'get'
  })
}

export function changeNewsStatus(newsId,showInApp) {
  const data = {
    newsId,
    showInApp
  }
  return request({
    url: '/app/news/changeStatus',
    method: 'put',
    data: data
  })
}
