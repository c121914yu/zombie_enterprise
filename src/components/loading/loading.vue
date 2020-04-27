<template>
	<div class="loading">
		<div class="animate"></div>
	</div>
</template>

<style scoped>
.loading{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	background-color: rgba(255,255,255,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}
.loading .animate{
	position: relative;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: #ff9845;
	animation: rotate 1.5s infinite linear alternate;
}
.loading .animate:after{
	content:'';
	position:absolute;
	width:50px;
	height:50px;
	border-top:10px solid #6dc8ec;
	border-bottom:10px solid #5ad8a6;
	border-left:10px solid transparent;
	border-right:10px solid transparent;
	border-radius:50px;
	top:-20px;
	left:-20px;
	animation: border-rotate 1.5s infinite linear alternate;
}
@keyframes rotate {
	from {
		transform: rotate(0deg) scale(1);
		background-color: #ff9845;
	}
	to {
		transform: rotate(360deg) scale(1.3);
		background-color: #f6bd16;
	}
}
@keyframes border-rotate {
	from{
		border-top-color: #6dc8ec;
		border-bottom-color: #5b8ff9;
	}
	to{
		border-top-color: #5ad8a6;
		border-bottom-color: #1e9493;
	}
}
</style>
