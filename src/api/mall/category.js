import request from '@/utils/request'

// 查询商品分类列表
export function listCategory(query) {
  return request({
    url: '/mall/category/list',
    method: 'get',
    params: query
  })
}

// 查询列表（排除节点）
export function listCategoryExcludeChild(unitId) {
  return request({
    url: '/mall/category/list/exclude/' + unitId,
    method: 'get'
  })
}


// 查询商品分类详细
export function getCategory(categoryId) {
  return request({
    url: '/mall/category/' + categoryId,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/mall/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/mall/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(categoryId) {
  return request({
    url: '/mall/category/' + categoryId,
    method: 'delete'
  })
}
