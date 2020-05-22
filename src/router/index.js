import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from "../views/Home.vue"
import infoRec from "../views/infoRec.vue"
import ID from "../views/IDRec.vue"

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/infoRec',
		name: 'infoRec',
		component: infoRec
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
