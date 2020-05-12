<template>
	<div class="nav" >
		<img src="http://blogs.jinlongyuchitang.cn/background.jpg" class="logo">
		<h3>僵尸企业画像</h3>
		<div class="list">
			<router-link 
				class="item"
				:class="item.active ? 'active' : ''"
				v-for="(item,index) in navs"
				:key="index"
				:to="{name:item.name}"
			>
				{{item.text}}
			</router-link>
		</div>
	</div>
</template>

<script>
var navEl
export default{
	data(){
		return{
			navs: [
				{text:"主页",name:'home',active:false},
				{text:"僵尸识别",name:'infoRec',active:false},
				// {text:"批量识别",name:'batch',active:false},
				{text:"企业查询",name:'id',active:false}
			]
		}
	},
	watch:{
		"$route":'routeChange'
	},
	methods:{
		routeChange(){
			this.navs.forEach(item => {
				item.active = false
				if(item.name === this.$route.name)
					item.active = true
			})
		}
	},
	mounted() {
		navEl = document.querySelector(".nav")
		this.routeChange()
		window.onscroll = () => {
			if(window.innerWidth > 800){
				navEl.classList.remove("lucency")
				return
			}
		  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		  if(scrollTop > 80)
		    navEl.classList.add("lucency")
		  else
		    navEl.classList.remove("lucency")
		}
	}
}
</script>

<style scoped>
.nav{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	height: 100vh;
	width: 200px;
	padding: 50px 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(91,143,249,0.05);
	box-shadow: 5px 0 5px rgba(91,143,249,0.2);
	opacity: 1;
}
.nav.lucency{
	opacity: 0.5;
}
.nav.lucency:hover{
	opacity: 1;
}

.nav .logo{
	width: 100px;
	height: 100px;
	border-radius: 50%;
}

.nav h3{
	margin: 10px 0;
	cursor: default;
}

.nav .list{
	margin-top: 10px;
	font-size: 1.1em;
	text-align: center;
}
.nav .list .item{
	margin-bottom: 25px;
	padding: 0 10px;
	border-radius: 5px;
	color: #f9f9f9;
	background-color: var(--green1);
	display: block;
	cursor: pointer;
	transition: var(--hover-speed);
}
.nav .list .item:hover,
.nav .list .item.active
{
	background-color: var(--blue2);
	transform: scale(1.2);
}

@media (max-width:800px) {
	.nav{
		width: 100%;
		height: 60px;
		padding: 0;
		flex-direction: row;
		background-color: #FFFFFF;
		box-shadow: var(--box-shadow1);
	}
	.nav .logo{
		display: none;
	}
	.nav h3{
		margin-left: 10px;
	}
	.nav .list{
		margin: 0;
		display: flex;
	}
	.nav .list .item{
		margin: 0;
		margin-left: 25px;
	}
}
@media (max-width:600px){
	.nav h3{
		margin-left: 5px;
		font-size: 1.2em;
	}
	.nav .list .item{
		margin-left: 15px;
		padding: 0 7px;
	}
	.nav .list .item:hover,
	.nav .list .item.active
	{
		transform: scale(1.1);
	}
}

/* @media (max-width:500px){
	.nav h3{
		display: none;
	}
	.nav .list{
		width: 100%;
		justify-content: space-around;
	}
	.nav .list .item{
		margin: 0;
	}
} */
</style>
