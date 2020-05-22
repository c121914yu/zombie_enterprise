import axios from 'axios'
import loading from "../../components/loading/loading.js"
import toast from "../../components/showToast/showToast.js"
var load

// 创建实例
const service = axios.create({
	baseURL: "http://10.12.41.32:8080/",
})

// 请求拦截
service.interceptors.request.use(req => {
	load = loading()
	return req
},(err) => {
	toast({
		type: "error",
		text: "请求错误"
	})
	return Promise.reject(err)
})

// 错误处理
const error = (err) => {
	if(err.response){
		console.log("错误信息：" + err)
	}
	toast({
		type: "error",
		text: "服务器错误"
	})
	load.hide()
	return Promise.reject(err)
}

// 响应拦截
service.interceptors.response.use(res => {
	load.hide()
	return res
},error)

export{
	service as axios
} 