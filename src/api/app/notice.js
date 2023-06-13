import request from '@/utils/request'

// 查询app端图文轮播图公告列表
export function listAppNotice(query) {
  return request({
    url: '/app/notice/list',
    method: 'get',
    params: query
  })
}

// 查询app端图文轮播图公告详细
export function getAppNotice(noticeId) {
  return request({
    url: '/app/notice/' + noticeId,
    method: 'get'
  })
}

// 新增app端图文轮播图公告
export function addAppNotice(data) {
  return request({
    url: '/app/notice',
    method: 'post',
    data: data
  })
}

// 改变状态
export function changeStatus(noticeId,showInApp) {
  const data = {
    noticeId,
    showInApp
  }
  return request({
    url: '/app/notice/changeStatus',
    method: 'put',
    data: data
  })
}

// 修改app端图文轮播图公告
export function updateAppNotice(data) {
  return request({
    url: '/app/notice',
    method: 'put',
    data: data
  })
}

// 删除app端图文轮播图公告
export function delAppNotice(noticeId) {
  return request({
    url: '/app/notice/' + noticeId,
    method: 'delete'
  })
}
