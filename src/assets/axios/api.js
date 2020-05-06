import {
	getAction,
	postAction
} from './manage.js'

const getFile = (params) => getAction("",params)

const login = (data) => postAction("api/login",data)


export {
	getFile
}