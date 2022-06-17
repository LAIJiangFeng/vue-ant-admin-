import request from '../utils/request'

export function save(data){
    return request({
        url: '/vehicle',
        method: 'post',
        data: data
    })
}

export function selectVehicleList(search){
    var qs=require('qs')
    return request({
        url:'/vehicle/selectVehicleList',
        method:'post',
        data:qs.stringify({
            search:search,
        })
    })
}

export function deleteVehicle(id){
    return request({
        url:'/vehicle?id='+id,
        method:'delete',
    })
}
