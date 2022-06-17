import request from '../utils/request'

export function userLogin(type,data){
    return request({
        url: '/admin/login?type=' + type,
        method: 'post',
        data: data
    })
}

export function selectAdminList(data){
    var qs=require('qs')
    return request({
        url:'/admin/selectAdminList',
        method:'post',
        data:qs.stringify({
            companyName:data.companyName,
            username:data.username,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function save(data){
    return request({
        url:'/admin',
        method:'post',
        data:data
    })
}

export function deleteAdmin(id){
    return request({
        url:'/admin?id='+id,
        method:'delete'
    })
}

export function updatePwd(data) {
    var qs=require('qs')
    return request({
        url: '/admin/updatePwd',
        method: 'post',
        data: qs.stringify({
            password:data.password,
            newPassword:data.newPassword
        })
    })
}