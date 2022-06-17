import request from '../utils/request'

export function save(data){
    return request({
        url: '/warehouse',
        method: 'post',
        data: data
    })
}

export function selectWarehouseList(name){
    var qs=require('qs')
    return request({
        url:'/warehouse/selectWarehouseList',
        method:'post',
        data:qs.stringify({
            name:name,
        })
    })
}

export function deleteWarehouse(id){
    return request({
        url:'/warehouse?id='+id,
        method:'delete',
    })
}
