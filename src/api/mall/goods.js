import request from '@/utils/request'

// 查询列表
export function listGoods(data) {
  return request({
    url: '/app/mallGoods/list',
    method: 'POST',
    data: data
  })
}

// 新增
export function addGoods(data) {
  return request({
    url: '/app/mallGoods',
    method: 'post',
    data: data
  })
}

// 详情
export function goodsDetails(goodsId) {
  return request({
    url: '/app/mallGoods/' + goodsId,
    method: 'get'
  })
}

// 改变状态
export function changeGoodsStatus(goodsId, status) {
  const data = {
    goodsId,
    status
  }
  return request({
    url: '/app/mallGoods/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除
export function delGoods(goodsIds) {
  return request({
    url: '/app/mallGoods/' + goodsIds,
    method: 'delete'
  })
}

// 修改
export function updateGoods(data) {
  return request({
    url: '/app/mallGoods',
    method: 'put',
    data: data
  })
}
