import request from '@/utils/request'

// 查询疫苗接种记录列表
export function listHistory(query) {
  return request({
    url: '/epidemic/inoculation/history/list',
    method: 'get',
    params: query
  })
}

// 查询疫苗接种记录详细
export function getHistory(historyId) {
  return request({
    url: '/epidemic/inoculation/history/' + historyId,
    method: 'get'
  })
}

// 新增疫苗接种记录
export function addHistory(data) {
  return request({
    url: '/epidemic/inoculation/history',
    method: 'post',
    data: data
  })
}

// 修改疫苗接种记录
export function updateHistory(data) {
  return request({
    url: '/epidemic/inoculation/history',
    method: 'put',
    data: data
  })
}

// 删除疫苗接种记录
export function delHistory(historyId) {
  return request({
    url: '/epidemic/inoculation/history/' + historyId,
    method: 'delete'
  })
}
