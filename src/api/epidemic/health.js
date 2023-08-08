import request from '@/utils/request'

// 查询居民健康码列表
export function listCode(query) {
  return request({
    url: '/epidemic/health/list',
    method: 'get',
    params: query
  })
}

// 查询居民健康码详细
export function getCode(codeId) {
  return request({
    url: '/epidemic/health/' + codeId,
    method: 'get'
  })
}

// 新增居民健康码
export function addCode(data) {
  return request({
    url: '/epidemic/health',
    method: 'post',
    data: data
  })
}

// 修改居民健康码
export function updateCode(data) {
  return request({
    url: '/epidemic/health',
    method: 'put',
    data: data
  })
}

// 删除居民健康码
export function delCode(codeId) {
  return request({
    url: '/epidemic/health/' + codeId,
    method: 'delete'
  })
}
