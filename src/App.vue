<template>
  <div id="app">
		<Nav></Nav>
		<div class="view">
			<keep-alive>
				<router-view class="body"/>
			</keep-alive>
		</div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue"
export default{
	components:{
		Nav
	}
}
</script>

<style>
@import url("./assets/common.css");
@import url("./assets/icon/iconfont.css");
#app{
	width: 100%;
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
}

.view{
	width: 100%;
	min-height: 100vh;
	background-color: rgba(120,210,236,0.1);
	padding-left: 170px;
}
.view .body{
	width: 100%;
	height: 100%;
	padding: 0 10px 10px;
}
@media (max-width:800px) {
	.view{
		margin-top: 60px;
	}
}
</style>
