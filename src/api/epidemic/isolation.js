import request from '@/utils/request'

// 查询隔离记录列表
export function listRecord(query) {
  return request({
    url: '/epidemic/isolation/list',
    method: 'get',
    params: query
  })
}

// 查询隔离记录详细
export function getRecord(recordId) {
  return request({
    url: '/epidemic/isolation/' + recordId,
    method: 'get'
  })
}

// 新增隔离记录
export function addRecord(data) {
  return request({
    url: '/epidemic/isolation',
    method: 'post',
    data: data
  })
}

// 修改隔离记录
export function updateRecord(data) {
  return request({
    url: '/epidemic/isolation',
    method: 'put',
    data: data
  })
}

// 删除隔离记录
export function delRecord(recordId) {
  return request({
    url: '/epidemic/isolation/' + recordId,
    method: 'delete'
  })
}
