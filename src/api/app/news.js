import request from '@/utils/request'

// 查询新闻列表
export function listNews(query) {
  return request({
    url: '/app/news/list',
    method: 'get',
    params: query
  })
}

// 新闻详情
export function newsDetails(newsId) {
  return request({
    url: '/app/news/' + newsId,
    method: 'get'
  })
}

// 改变状态
export function changeNewsStatus(newsId, showInApp) {
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

// 改变大图状态
export function changeNewsShowType(newsId, showType) {
  const data = {
    newsId,
    showType
  }
  return request({
    url: '/app/news/changeShowType',
    method: 'PUT',
    data: data
  })
}

// 删除
export function delNews(newsIds) {
  return request({
    url: '/app/news/' + newsIds,
    method: 'delete'
  })
}

// 修改新闻
export function updateNews(data) {
  return request({
    url: '/app/news',
    method: 'put',
    data: data
  })
}
