import request from '@/utils/request'

// 查询出入社区人员记录列表
export function listRecord(query) {
    return request({
        url: '/epidemic/access/list',
        method: 'get',
        params: query
    })
}

// 查询出入社区人员记录详细
export function getRecord(recordId) {
    return request({
        url: '/epidemic/access/' + recordId,
        method: 'get'
    })
}

// 新增出入社区人员记录
export function addRecord(data) {
    return request({
        url: '/epidemic/access',
        method: 'post',
        data: data
    })
}

// 修改出入社区人员记录
export function updateRecord(data) {
    return request({
        url: '/epidemic/access',
        method: 'put',
        data: data
    })
}

// 删除出入社区人员记录
export function delRecord(recordId) {
    return request({
        url: '/epidemic/access/' + recordId,
        method: 'delete'
    })
}
