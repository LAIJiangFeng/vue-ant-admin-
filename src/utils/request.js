import request from "axios"
import {message} from 'ant-design-vue'
import {initRouter} from '@/router/index'


const service = request.create({
    baseURL: 'http://localhost:8087/logistics',
    timeout: 50000,
    // headers: {'Authorization': localStorage.getItem("token")}
});

service.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        // console.log(token);
        if (!config.headers.hasOwnProperty('Authorization') && token) {
            config.headers.Authorization = token;
        }
        // response.headers['Authorization'] = token
        return config;
    },
    error=>{
        message.error(error)
        initRouter(false).push('/exception/500')
        return Promise.reject(error)
    }
);

service.interceptors.response.use(
    response => {
        
       
        const res = response.data;

        //判断response状态
        if (!res.status) message.error('请求错误: ' + res.msg)

        if (res.code === 403)initRouter(false).push("/exception/403")
        
        return res
    },

    error => {
        message.error(error)
        initRouter(false).push('/exception/500')
        return Promise.reject(error)
    }
);

export default service