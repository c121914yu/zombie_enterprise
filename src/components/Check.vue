<template>
	<div class="check">
		<span>自动填充空值</span>
		<i 
			:class="value ? 'active' : ''"
			class="iconfont icon-dui dot" 
			@click="click"></i>
	</div>
</template>

<script>
export default{
	props:{
		value: Boolean
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	methods:{
		click(){
			this.$emit("change",!this.value)
		}
	}
}
</script>

<style scoped>
.check{
	display: flex;
	align-items: center;
}
.check .dot{
	margin-left: 10px;
	width: 1.1em;
	height: 1.1em;
	line-height: 1.1em;
	border-radius: 50%;
	background-color: #FFFFFF;
	font-size: 0.9em;
	cursor: pointer;
	position: relative;
}
.check .dot.active{
	background-color: var(--blue2);
}
</style>
