<template>
	<div class="result">
		<h2>识别结果</h2>
		<div class="content">
			<div class="left">
				<p>
					识别结果: <span>{{result.data.final_pre === 0 ? "僵尸企业" : "正常企业"}}</span>
				</p>
				<p>
					运行时间: <span>{{result.time/1000}}s</span>
				</p>
			</div>
			<div class="right">
				<div id="chart"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			result: {
				code: 1,
				error_msg: "",
				data: {
					proba_normal: 0.8,
					proba_zombie: 0.2,
					final_pre: 1
				},
				time: 50000
			}
		}
	},
	mounted() {
		let option = {
			series : [
				{
					name : "识别结果",
					type: 'pie',
					label: {
						formatter: '{b}:{c}',
						fontSize: 16
					},
					data: [
						{
							value: this.result.data.proba_zombie, 
							name: '僵尸企业',
							itemStyle: {
								color: "#e86452"
							}
						},
						{
							value: this.result.data.proba_normal, 
							name: '正常企业',
							itemStyle: {
								color: "#1e9493"
							}
						},
					]
				}
			]
		}
		let myChart = this.$echarts.init(document.getElementById('chart'))//初始化
		myChart.setOption(option)
	}
}
</script>

<style scoped>
.result{
	margin-top: 15px;
}
.result .content{
	padding: 10px;
	border-radius: 10px;
	box-shadow: var(--box-shadow1);
	display: flex;
}
.result .content .left p{
	white-space: nowrap;
}
.result .content .left p span{
	margin-right: 15px;
	font-weight: 600;
}

.result .content .right{
	width: 450px;
	height: 300px;
}
.result .content .right #chart{
	width: 100%;
	height: 100%;
}

@media (max-width:1100px) {
	.result .content{
		flex-direction: column;
	}
}
@media (max-width:600px){
	.result .content .right{
		width: 100%;
		height: 250px;
	}
}
</style>
