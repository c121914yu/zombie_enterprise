<template>
	<div class="check-box">
		<p class="check-text" :class="checkText === '' ? 'placeholder' : ''">
			{{checkText === "" ? "选择测试模型" : checkText}}
		</p>
		<i class="iconfont icon-xiala xiala"></i>
		<div class="models">
			<p 
				class="item"
				:class="item.active ? 'active' : ''"
				v-for="(item,index) in models"
				:key="index"
				@click="item.active = !item.active"
			>
				{{item.name}}
				<i v-if="item.active" class="iconfont icon-dui"></i>
			</p>
		</div>
	</div>
</template>

<script>
export default{
	props:{
		models: {
			type: Array,
			default : () => {
				return [{name:"无数据"}]
			}
		}
	},
	computed:{
		checkText(){
			let checked = this.models.filter(item => {
				return item.active
			})
			checked = checked.map(item => {
				return item.name
			})
			return checked.join(",")
		}
	}
}
</script>

<style scoped>
.check-box{
	height: 35px;
	padding: 0 5px;
	border: var(--border1);
	border-radius: 5px;
	color: var(--dark-common);
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	position: relative;
}

.check-box .xiala{
	position: absolute;
	right: 10px;
	transition: var(--hover-speed);
}

.check-box .models{
	position: absolute;
	transform: translateY(-100%);
	top: -2px;
	left: 0;
	height: 0;
	width: 100%;
	background-color: #FFFFFF;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	box-shadow: var(--box-shadow2);
	transition: var(--hover-speed);
	overflow: hidden;
	cursor: pointer;
}
.check-box .models .item{
	height: 45px;
	line-height: 45px;
	text-align: center;
}
.check-box .models .item:hover{
	color: #FFFFFF;
	background-color: rgba(109,200,236,0.6);
}
.check-box .models .item.active{
	color: #FFFFFF;
	background-color: var(--blue1);
}
.check-box .models .item i{
	position: absolute;
	margin-left: 10px;
}

.check-box:hover .models{
	height: 135px;
}
.check-box:hover .xiala{
	transform: rotate(180deg);
}
</style>
