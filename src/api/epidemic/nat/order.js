import request from '@/utils/request'

// 查询预约核酸检测NAT列表
export function listOrder(query) {
  return request({
    url: '/epidemic/nat/order/list',
    method: 'get',
    params: query
  })
}

// 查询预约核酸检测NAT详细
export function getOrder(orderId) {
  return request({
    url: '/epidemic/nat/order/' + orderId,
    method: 'get'
  })
}

// 新增预约核酸检测NAT
export function addOrder(data) {
  return request({
    url: '/epidemic/nat/order',
    method: 'post',
    data: data
  })
}

// 修改预约核酸检测NAT
export function updateOrder(data) {
  return request({
    url: '/epidemic/nat/order',
    method: 'put',
    data: data
  })
}

// 删除预约核酸检测NAT
export function delOrder(orderId) {
  return request({
    url: '/epidemic/nat/order/' + orderId,
    method: 'delete'
  })
}
