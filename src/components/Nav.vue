<template>
	<div class="nav">
		<i class="logo iconfont icon-jiangshi"></i>
		<h3>僵尸企业画像</h3>
		<div class="list">
			<router-link
				class="item"
				:class="item.active ? 'active' : ''"
				v-for="(item, index) in navs"
				:key="index"
				:to="{ name: item.name }"
			>
				<i class="iconfont" :class="item.icon"></i>
				{{ item.text }}
			</router-link>
		</div>
	</div>
</template>

<script>
var navEl
export default {
	data() {
		return {
			navs: [
				{ text: "介绍", name: "home", icon: "icon-home", active: false },
				{
					text: "僵尸识别",
					name: "infoRec",
					icon: "icon-shibie",
					active: false,
				},
				{ text: "企业查询", name: "id", icon: "icon-search", active: false },
			],
		}
	},
	watch: {
		$route: "routeChange",
	},
	methods: {
		routeChange() {
			this.navs.forEach((item) => {
				item.active = false
				if (item.name === this.$route.name) item.active = true
			})
		},
	},
	mounted() {
		navEl = document.querySelector(".nav")
		this.routeChange()
		window.onscroll = () => {
			if (window.innerWidth > 800) {
				navEl.classList.remove("lucency")
				return
			}
			let scrollTop =
				document.documentElement.scrollTop || document.body.scrollTop
			if (scrollTop > 80) navEl.classList.add("lucency")
			else navEl.classList.remove("lucency")
		}
	},
}
</script>

<style scoped>
.nav {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	height: 100vh;
	width: 170px;
	padding-top: 20px;
	background-color: #ffffff;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	box-shadow: var(--box-shadow2);
	display: flex;
	flex-direction: column;
	align-items: center;
	opacity: 1;
}
.nav.lucency {
	opacity: 0.5;
}
.nav.lucency:hover {
	opacity: 1;
}

.nav .logo {
	font-size: 4em;
	border-radius: 50%;
}

.nav h3 {
	margin: 10px 0;
	cursor: default;
}

.nav .list {
	width: 100%;
	margin-top: 10px;
	padding-left: 1px;
	font-size: 1.1em;
	position: relative;
}
.nav .list .item {
	margin-bottom: 25px;
	width: 100%;
	padding: 0 10px;
	color: var(--dark-remark);
	border-left: 4px solid transparent;
	border-radius: 2px;
	display: block;
	cursor: pointer;
	transition: var(--hover-speed);
}
.nav .list .item i {
	margin: 0 10px;
	transform: scale(1.1);
}
.nav .list .item:hover {
	color: var(--origin);
}
.nav .list .item.active {
	border-left: 4px solid var(--origin);
	color: var(--origin);
}

@media (max-width: 800px) {
	.nav {
		width: 100%;
		height: 60px;
		padding: 0;
		flex-direction: row;
		background-color: #ffffff;
		box-shadow: var(--box-shadow1);
	}
	.nav .logo {
		display: none;
	}
	.nav h3 {
		margin-left: 10px;
	}
	.nav .list {
		margin: 0;
		display: flex;
	}
	.nav .list .item {
		margin: 0;
		margin-left: 25px;
	}
}
@media (max-width: 600px) {
	.nav h3 {
		margin-left: 5px;
		font-size: 1.2em;
	}
	.nav .list .item {
		margin-left: 15px;
		padding: 0 7px;
	}
	.nav .list .item:hover,
	.nav .list .item.active {
		transform: scale(1.1);
	}
}
</style>
