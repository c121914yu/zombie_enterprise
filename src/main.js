import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 引入echarts
const echarts = require('echarts')
import 'echarts-gl'
Vue.prototype.$echarts = echarts

import showModel from "./components/showModel/showModel.js"
Vue.prototype.$showModel = showModel
import showToast from "./components/showToast/showToast.js"
Vue.prototype.$showToast = showToast
import loading from "./components/loading/loading.js"
Vue.prototype.$loading = loading

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')