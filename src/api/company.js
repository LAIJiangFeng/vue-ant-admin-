import request from '../utils/request'

export function save(data){
    return request({
        url: '/company',
        method: 'post',
        data: data
    })
}

export function selectCompanyList(data){
    var qs=require('qs')
    return request({
        url:'/company/selectCompanyList',
        method:'post',
        data:qs.stringify({
            companyName:data.companyName,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function deleteCompany(id){
    return request({
        url:'/company?id='+id,
        method:'delete',
    })
}

export function getCompanys(){
    return request({
        url:'/company',
        method:'get'
    })
}