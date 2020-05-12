import {
	getAction,
	postAction
} from './manage.js'

const getFile = (params) => getAction("",params)

const Predict = (data) => postAction("/predict/",data)

export {
	Predict
}