import request from '@/utils/request'

// 查询短信模板列表
export function listTemplate(query) {
  return request({
    url: '/sms/template/list',
    method: 'get',
    params: query
  })
}

// 查询短信模板详细
export function getTemplate(templateId) {
  return request({
    url: '/sms/template/' + templateId,
    method: 'get'
  })
}

// 新增短信模板
export function addTemplate(data) {
  return request({
    url: '/sms/template',
    method: 'post',
    data: data
  })
}

// 修改短信模板
export function updateTemplate(data) {
  return request({
    url: '/sms/template',
    method: 'put',
    data: data
  })
}

// 修改短信模板状态
export function changeTemplateStatus(templateId,status) {
  const data = {
    templateId,
    status
  }
  return request({
    url: '/sms/template/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除短信模板
export function delTemplate(templateId) {
  return request({
    url: '/sms/template/' + templateId,
    method: 'delete'
  })
}
