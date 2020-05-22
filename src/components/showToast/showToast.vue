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
	z-index: 99;
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	width: 50%;
	max-width: 450px;
	height: 40px;
	line-height: 40px;
	border: var(--border2);
	border-radius: 10px;
	box-shadow: var(--box-shadow2);
	overflow: hidden;
	display: flex;
	align-items: center;
	animation: create 2s ease-out;
}
.toast.success{
	color: #67c23a;
	background-color: #f0f9eb;
}
.toast.error{
	color: #f56c6c;
	background-color: #fef0f0;
}
.toast.warn{
	color: #e6a23c;
	background-color: #fdf6ec;
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
		top: 40px;
	}
	85%{
		top: 40px;
	}
	100%{
		top: -50px;
	}
}

.toast i{
	margin: 0 20px;
	font-size: 1.2em;
	color: inherit;
}
.toast p{
	color: inherit;
}

@media (max-width:600px) {
	.toast{
		width: 70%;
	}
}
</style>
