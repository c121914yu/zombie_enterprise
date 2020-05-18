<template>
	<div class="model popup">
		<div class="container">
			<h3>{{head}}</h3>
			<p class="content">{{text}}</p>
			<div class="btns">
				<p 
					:style="'color:' + confirmColor"
					@click="confirm"
				>
					{{confirmText}}
				</p>
				<p 
					class="cancel" 
					v-if="cancelText != ''"
					@click="cancel"
				>
					{{cancelText}}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			head: "",
			text: "",
			confirmText: "",
			cancelText: "",
			confirmColor: "var(--green2)"
		}
	},
	methods:{
		confirm(){
			if(this.success)
				this.success()
			this.cancel()
		},
		cancel(){
			const dom = document.querySelector(".model")
			document.body.removeChild(dom)
		}
	}
}
</script>

<style>
.model{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(0,0,0,0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}
.model .container{
	width: 80%;
	max-width: 450px;
	height: 150px;
	padding: 10px;
	background-color: rgba(250,250,250,1);
	border-radius: 5px;
	box-shadow: var(--box-shadow2);
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
}

.model .content{
	margin-top: 5px;
	width: 100%;
}
.model .btns{
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color: #f4f4f4;
	display: flex;
	text-align: center;
	font-weight: 500;
	font-size: 1.1em;
	cursor: pointer;
}
.model .btns p{
	flex: 1;
	padding: 5px 0;
}
.model .btns .cancel{
	border-left: var(--border1);
}
</style>
