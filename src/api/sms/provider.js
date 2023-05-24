import request from '@/utils/request'

// 查询系统短信服务供应商列表
export function listProvider(query) {
  return request({
    url: '/sms/provider/list',
    method: 'get',
    params: query
  })
}

// 查询系统短信服务供应商详细
export function getProvider(providerId) {
  return request({
    url: '/sms/provider/' + providerId,
    method: 'get'
  })
}

// 新增系统短信服务供应商
export function addProvider(data) {
  return request({
    url: '/sms/provider',
    method: 'post',
    data: data
  })
}

// 修改系统短信服务供应商
export function updateProvider(data) {
  return request({
    url: '/sms/provider',
    method: 'put',
    data: data
  })
}

// 删除系统短信服务供应商
export function delProvider(providerId) {
  return request({
    url: '/sms/provider/' + providerId,
    method: 'delete'
  })
}
