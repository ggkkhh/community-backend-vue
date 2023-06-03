import request from '@/utils/request'

// 查询列表
export function listUnit(query) {
  return request({
    url: '/system/unit/list',
    method: 'get',
    params: query
  })
}

// 查询列表（排除节点）
export function listUnitExcludeChild(unitId) {
  return request({
    url: '/system/unit/list/exclude/' + unitId,
    method: 'get'
  })
}

// 查询详细
export function getUnit(unitId) {
  return request({
    url: '/system/unit/' + unitId,
    method: 'get'
  })
}

// 新增
export function addUnit(data) {
  return request({
    url: '/system/unit',
    method: 'post',
    data: data
  })
}

// 修改
export function updateUnit(data) {
  return request({
    url: '/system/unit',
    method: 'put',
    data: data
  })
}

// 删除
export function delUnit(unitId) {
  return request({
    url: '/system/unit/' + unitId,
    method: 'delete'
  })
}
