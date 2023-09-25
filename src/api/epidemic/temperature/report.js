import request from '@/utils/request'

// 查询体温上报列表
export function listReport(query) {
  return request({
    url: '/epidemic/temperature/report/list',
    method: 'get',
    params: query
  })
}

// 查询体温上报详细
export function getReport(id) {
  return request({
    url: '/epidemic/temperature/report/' + id,
    method: 'get'
  })
}

// 新增体温上报
export function addReport(data) {
  return request({
    url: '/epidemic/temperature/report',
    method: 'post',
    data: data
  })
}

// 修改体温上报
export function updateReport(data) {
  return request({
    url: '/epidemic/temperature/report',
    method: 'put',
    data: data
  })
}

// 删除体温上报
export function delReport(id) {
  return request({
    url: '/epidemic/temperature/report/' + id,
    method: 'delete'
  })
}
