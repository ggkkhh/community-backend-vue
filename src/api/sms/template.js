import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTemplate(query) {
  return request({
    url: '/sms/template/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getTemplate(templateId) {
  return request({
    url: '/sms/template/' + templateId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addTemplate(data) {
  return request({
    url: '/sms/template',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTemplate(data) {
  return request({
    url: '/sms/template',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delTemplate(templateId) {
  return request({
    url: '/sms/template/' + templateId,
    method: 'delete'
  })
}
