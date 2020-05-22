import {
	getAction,
	postAction
} from './manage.js'

const Query = (url) => getAction(`query/${url}/`)

const Predict = (data) => postAction("predict/",data)

export {
	Query,
	Predict
}