<template>
	<div 
		class="select"
		@mouseenter="show=true"
		@mousedown="show=true"
		@mouseleave="show=false"
	>
		<p class="select-text" :class="value === '' ? 'placeholder' : ''">
			{{value === '' ? placeholder : value}}
		</p>
		<i 
			class="iconfont icon-xiala xiala"
			:style="show ? 'transform: rotate(180deg)': 'transform: rotate(0)'"
		>
		</i>
		<div 
			class="content"
			:style="show ? 'height:' + height : 'height:0'"
		>
			<div 
				class="item"
				:class="item === value ? 'active' : ''"
				v-for="(item,index) in list"
				:key="index"
				@click="check(item)"
			>
				{{item}}
			</div>
		</div>
	</div>
</template>

<script>
export default{
	name: "Select",
	data(){
		return{
			show: false,
			height: 0,
		}
	},
	props:['value','list','placeholder'],
	model: {
		prop: 'value',
		event: 'change'
	},
	methods:{
		check(item){
			this.$emit("change",item)
			this.$emit("update")
			this.show = false
		}
	},
	mounted() {
		this.height = (this.list.length * 45) + "px"
	}
}
</script>

<style scoped>
.select{
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
.select:hover{
	z-index: 5;
}
.select .xiala{
	position: absolute;
	right: 10px;
	transition: var(--hover-speed);
}

.select .content{
	position: absolute;
	top: 35px;
	left: 0;
	height: 0;
	width: 100%;
	background-color: #FFFFFF;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	box-shadow: var(--box-shadow2);
	transition: var(--hover-speed);
	overflow: hidden;
	cursor: pointer;
	z-index: 5;
}
.select .content .item{
	text-align: center;
	height: 45px;
	line-height: 45px;
}
.select .content .item:hover{
	color: #FFFFFF;
	background-color: rgba(109,200,236,0.6);
}
.select .content .item.active{
	color: #FFFFFF;
	background-color: var(--blue1);
}
</style>
