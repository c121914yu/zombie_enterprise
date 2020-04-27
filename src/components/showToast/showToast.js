import Vue from 'vue';
import toast from './showToast.vue'
let Toast = Vue.extend(toast)

let showToast = (data) => {
  var dom = new Toast({
    el: document.createElement('div') //将组件挂载到新创建的div上 
  })
  document.body.appendChild(dom.$el) //把组件的dom添加到body里 
	
  dom.type = data.type || "success"
  dom.text = data.text || "提示"
	dom.time = data.time || 1500
}
export default showToast
