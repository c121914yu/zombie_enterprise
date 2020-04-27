import {
	getAction,
	postAction
} from './manage.js'

const getActivity = (params) => getAction("api/getActivity",params)
const checkID = (params) => getAction("api/checkID",params)

const login = (data) => postAction("api/login",data)
const sendRand = (data) => postAction("api/sendRand",data)
const findPsw = (data) => postAction("api/findPsw",data)
const register = (data) => postAction("api/register",data)
const updateObj = (data) => postAction("api/updateObj",data)

export {
	getActivity,
	checkID,
	login,
	sendRand,
	findPsw,
	register,
	updateObj
}