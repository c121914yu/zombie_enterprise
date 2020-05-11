import {
	getAction,
	postAction
} from './manage.js'

const getFile = (params) => getAction("",params)

const Predict = (data) => postAction("http://10.12.42.43/predict/",data)

export {
	Predict
}