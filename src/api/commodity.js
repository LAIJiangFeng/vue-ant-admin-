import request from '../utils/request'

export function save(data){
    return request({
        url: '/commodity',
        method: 'post',
        data: data
    })
}

export function selectCommodityList(data){
    var qs=require('qs')
    return request({
        url:'/commodity/selectCommodityList',
        method:'post',
        data:qs.stringify({
            name:data.name,
            price:data.price,
            companyName:data.companyName,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function deleteCommodity(id){
    return request({
        url:'/commodity?id='+id,
        method:'delete',
    })
}


export function findByCompanyCode(){
    return request({
        url:'/commodity/findByCompanyCode',
        method:'post',
    })
}