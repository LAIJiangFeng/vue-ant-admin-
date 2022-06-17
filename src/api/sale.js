import request from '../utils/request'

export function save(data){
    return request({
        url: '/sale',
        method: 'post',
        data: data
    })
}

export function selectSaleList(data){
    var qs=require('qs')
    return request({
        url:'/sale/selectSaleList',
        method:'post',
        data:qs.stringify({
            cname:data.cname,
            companyName:data.companyName,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function deleteSale(id){
    return request({
        url:'/sale?id='+id,
        method:'delete',
    })
}
