import request from '../utils/request'

export function save(data){
    return request({
        url: '/distribution',
        method: 'post',
        data: data
    })
}

export function selectDistributionList(data){
    var qs=require('qs')
    return request({
        url:'/distribution/selectDistributionList',
        method:'post',
        data:data
    })
}

export function deleteDistribution(id){
    return request({
        url:'/distribution?id='+id,
        method:'delete',
    })
}

export function getLocation(data){
    var qs=require('qs')
    return request({
        url:'/distribution/getLocation',
        method:'post',
        data:qs.stringify({
            latitude:data.latitude,
            longitude:data.longitude,
            address:data.address
        })
    })
}

export function selectDistribution(){
    return request({
        url:'/distribution/selectDistributionList',
        method:'get',
    })
}

export function selectById(id){
    return request({
        url:'/distribution?id='+id,
        method:'get',
    })
}