// 获取二维码api
import request from '@/utils/request'

// 查询岗位列表
export function getBase64(query) {
  return request({
    url: '/system/qrcode/base64',
    method: 'get',
    params: query
  })
}
