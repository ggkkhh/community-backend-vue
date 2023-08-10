import request from '@/utils/request'

// 查询疫苗接种审核列表
export function listAudit(query) {
  return request({
    url: '/epidemic/inoculation/audit/list',
    method: 'get',
    params: query
  })
}

// 查询疫苗接种审核详细
export function getAudit(auditId) {
  return request({
    url: '/epidemic/inoculation/audit/' + auditId,
    method: 'get'
  })
}

// 新增疫苗接种审核
export function addAudit(data) {
  return request({
    url: '/epidemic/inoculation/audit',
    method: 'post',
    data: data
  })
}

// 修改疫苗接种审核
export function updateAudit(data) {
  return request({
    url: '/epidemic/inoculation/audit',
    method: 'put',
    data: data
  })
}

// 删除疫苗接种审核
export function delAudit(auditId) {
  return request({
    url: '/epidemic/inoculation/audit/' + auditId,
    method: 'delete'
  })
}
