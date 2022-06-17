import request from '../utils/request'


export function selectByWid(wid){
    return request({
        url:'/inventoryRecord?wid='+wid,
        method:'get',
    })
}

export function inOrOutAnalysis(type){
    return request({
        url:'/inventoryRecord/inOrOutAnalysis?type='+type,
        method:'get',
    })
}
