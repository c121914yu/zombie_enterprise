<template>
  <div id="app">
		<Nav></Nav>
		<div class="view">
			<Head></Head>
			<keep-alive>
				<router-view class="container"/>
			</keep-alive>
		</div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue"
import Head from "./components/Head.vue"
export default{
	components:{
		Nav,
		Head
	}
}
</script>

<style>
@import url("./assets/common.css");
@import url("./assets/icon/iconfont.css");
#app{
	width: 100%;
	min-height: 100vh;
	background-color: #f9f9f9;
	position: relative;
}

.view{
	width: calc(100%-200px);
	margin-left: 200px;
	height: 100%;
	padding: 20px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.view .container{
	width: 80%;
	height: 100%;
}
@media (max-width:1100px){
	.view .container{
		width: 90%;
	}
}
@media (max-width:800px) {
	.view{
		width: 100%;
		margin-top: 60px;
		margin-left: 0;
	}
}
</style>
