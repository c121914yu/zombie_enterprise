import Vue from 'vue';
import model from './showModel.vue'
let Model = Vue.extend(model)

let showModel = (data) => {
  var dom = new Model({
    el: document.createElement('div') //将woast组件挂载到新创建的div上 
  })
  document.body.appendChild(dom.$el) //把toast组件的dom添加到body里 
	
  dom.head = data.head || "提示"
  dom.text = data.text || ""
	dom.confirmText = data.confirmText || "确认"
	dom.cancelText = data.cancelText || ""
	dom.confirmColor = data.cancelText || "var(--green2)"
	dom.success = data.success || null
}
export default showModel
