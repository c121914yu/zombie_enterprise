import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from "../views/Home.vue"
import Single from "../views/SingleRec.vue"
import Batch from "../views/BatchRec.vue"
import ID from "../views/IDRec.vue"

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/SingleRec',
		name: 'single',
		component: Single
	},
	{
		path: '/BatchRec',
		name: 'batch',
		component: Batch
	},
	{
		path: '/IDRec',
		name: 'id',
		component: ID
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
