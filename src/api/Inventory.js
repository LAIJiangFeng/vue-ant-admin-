import request from '../utils/request'


export function selectInventoryList(data,wid){
    var qs=require('qs')
    return request({
        url:'/inventory/selectInventoryList',
        method:'post',
        data:qs.stringify({
            wid:wid,
            name:data.name,
            page:data.page,
            pageSize:data.pageSize
        })
    })
}

export function inAndOut(type,data){
    return request({
        url:'/inventory/'+type,
        method:'post',
        data:data,
    })
}

export function selectByWid(wid){
    return request({
        url:'/inventory?wid='+wid,
        method:'get',
    })
}
