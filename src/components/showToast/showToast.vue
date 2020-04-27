<template>
	<div class="toast" :class="type">
		<i class="iconfont" :class="'icon-' + type"></i>
		<p>{{text}}</p>
	</div>
</template>

<script>
export default{
	data(){
		return{
			type: "error",
			text: "提示",
			timer: ""
		}
	},
	methods:{
		removeDom(){
			let dom = document.querySelector('.toast')
			clearInterval(this.timer)
			if(dom)
				document.body.removeChild(dom)
		}
	},
	mounted() {
		this.timer = setInterval(() => {
			this.removeDom()
		},2000)
	}
}
</script>

<style scoped>
.toast{
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	width: 50%;
	max-width: 450px;
	height: 40px;
	color: #FFFFFF;
	line-height: 40px;
	border-radius: 10px;
	overflow: hidden;
	z-index: 99;
	display: flex;
	align-items: center;
	animation: create 2s ease-out;
}
.toast.success{
	background-color: #67C23A;
}
.toast.error{
	background-color: #F56C6C;
}
.toast.warn{
	background-color: #E6A23C;
}

@keyframes create{
	0%{
		opacity: 0;
		top: -50px;
	}
	15%{
		opacity: 1;
	}
	25%{
		top: 60px;
	}
	85%{
		top: 60px;
	}
	100%{
		top: -50px;
	}
}

.toast i{
	margin: 0 20px;
	font-size: 1.2em;
	color: #FFFFFF;
}
.toast p{
	color: #FFFFFF;
}
</style>
