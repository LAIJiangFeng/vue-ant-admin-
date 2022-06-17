import request from '../utils/request'

export function save(data){
    return request({
        url: '/user',
        method: 'post',
        data: data
    })
}

export function selectUserList(data){
    var qs=require('qs')
    return request({
        url:'/user/selectUserList',
        method:'post',
        data:qs.stringify({
            name:data.name,
            username:data.username,
            type:data.type,
            companyName:data.companyName,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function deleteUser(id){
    return request({
        url:'/user?id='+id,
        method:'delete',
    })
}

export function getDriver(){
    return request({
        url:'/user',
        method:'get',
    })
}

export function getUser(){
    return request({
        url:'/user/getUser',
        method:'get',
    })
}


