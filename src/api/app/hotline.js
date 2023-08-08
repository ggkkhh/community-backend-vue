import request from '@/utils/request'

// 查询紧急热线列表
export function listHotline(query) {
  return request({
    url: '/app/hotline/list',
    method: 'get',
    params: query
  })
}

// 查询紧急热线详细
export function getHotline(hotlineId) {
  return request({
    url: '/app/hotline/' + hotlineId,
    method: 'get'
  })
}

// 新增紧急热线
export function addHotline(data) {
  return request({
    url: '/app/hotline',
    method: 'post',
    data: data
  })
}

// 修改紧急热线
export function updateHotline(data) {
  return request({
    url: '/app/hotline',
    method: 'put',
    data: data
  })
}

// 改变状态
export function changeHotlineStatus(hotlineId, status) {
  const data = {
    hotlineId,
    status
  }
  return request({
    url: '/app/hotline/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除紧急热线
export function delHotline(hotlineId) {
  return request({
    url: '/app/hotline/' + hotlineId,
    method: 'delete'
  })
}
