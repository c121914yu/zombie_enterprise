<template>
	<div class="result">
		<h2>识别结果</h2>
		<div class="content">
			<header>
				<p>
					运行时间: <span>{{time}}s</span>
				</p>
				<p>
					僵尸企业: <span>{{zombie_amount.length}}个</span>
				</p>
				<p>
					正常企业: <span>{{normal_amount.length}}个</span>
				</p>
			</header>
			<div class="charts">
				<div class="chart" id="sum"></div>
				<div class="chart" id="degree"></div>
				<div class="chart col-2" id="zombie-dis"></div>
			</div>
		</div>
	</div>
</template>

<script>
import data from "../assets/data.json"
var zombieDis = []
export default{
	data(){
		return{
			zombie_amount: [],
			normal_amount: [],
			time: 0
		}
	},
	methods:{
		cal_time(){
			this.time = data.time / 1000
		},
		count_sum(){ // 计算总分布情况
			for(let i in data.data){
				const item = data.data[i]
				if(item.final_pre === 1)
					this.zombie_amount.push(item)
				else
					this.normal_amount.push(item)
			}
		},
		draw_sum(){ // 计算
			let option = {
				title: {
					text: "数量分布",
					left: "center"
				},
				tooltip: {
					formatter: (params) => {
						return `
										 ${params.seriesName}<br/>
										 ${params.marker}${params.name}: ${params.data.value}个
									 `
					}
				},
				series: [
					{
						name: "数量分布",
						type: "pie",
						radius: ["50%","70%"],
						label: {
							fontSize: 16,
							fontWeight: 600
						},
						data: [
							{
								name: "僵尸企业",
								value: this.zombie_amount.length,
								itemStyle: {
									color: "#F56C6C"
								}
							},
							{
								name: "正常企业",
								value: this.normal_amount.length,
								itemStyle: {
									color: "#5ad8a6"
								}
							}
						]
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("sum"))//初始化
			myChart.setOption(option)
		},
		count_zombieDis(){ //僵尸分布情况计算
			for(let j=0;j<5;j++){
				zombieDis[j] = [[],[],[],[],[]]
				for(let i=0;i<1000;i++){
					const val = Math.random()
					for(let index=0;index<5;index++)
						if(val < (index+1)*0.2){
							zombieDis[j][index].push(val)
							break
						}
				}
				for(let index=0;index<5;index++){
					zombieDis[j][index] = {
						value: zombieDis[j][index].length,
						name: `${index*20}% - ${(index+1)*20}%`
					}
				}
			}
			// x,y互换
			for(let i=0;i<zombieDis.length;i++)
				for(let j=i+1;j<zombieDis[i].length;j++){
					const temp = zombieDis[j][i]
					zombieDis[j][i] = zombieDis[i][j]
					zombieDis[i][j] = temp
				}
		},
		draw_zombie_dis(){ // 僵尸分布情况
			let option = {
				title: {
					text: "僵尸分布",
					left: "center"
				},
				color: ["#E6CAFF","#CA8EFF","#9F35FF","#6F00D2","#3A006F"],
				tooltip: {
				  trigger : "axis",
				  axisPointer : {
				    type : "shadow"
				  },
					formatter: (params) => {
						let content = ""
						content += `${params[0].axisValue}<br>`
						params.forEach(param => {
							content += param.marker
							content += `${param.data.name}: `
							content += `${param.data.value}个<br>`
						})
						return content
					}
				},
				xAxis: {
					type: "category",
					data: ["第一类","第二类","第三类","第四类","第五类"],
					axisTick: {
						alignWithLabel: true
					}
				},
				yAxis:{
					name: "数量",
					type : 'value',
				},
				series: zombieDis.map((data,index) => {
					return{
						name: `${index*20}% - ${(index+1)*20}%`,
						type: 'bar',
						barWidth: "15%",
						barGap: 0,
						data: zombieDis[index]
					}
				})
			}
			let myChart = this.$echarts.init(document.getElementById("zombie-dis"))//初始化
			myChart.setOption(option)
		},
		draw_degree(){ // 僵尸程度分布
			let option = {
				title: {
					text: "僵尸等级",
					left: "center"
				},
				xAxis: {
					type: "category",
					// show: false
				},
				yAxis: {
					type: "value",
					// show: false
				},
				series: [
					{
						name: "僵尸程度",
						type: "bar",
						barWidth: 50,
						barGap : "-100%",
						itemStyle: {
							color: new this.$echarts.graphic.LinearGradient(
								0, 0, 0, 1,
								[
										{offset: 0, color: '#3A006F'},
										{offset: 0.4, color: '#6F00D2'},
										{offset: 0.6, color: '#9F35FF'},
										{offset: 0.8, color: '#CA8EFF'},
										{offset: 1, color: '#E6CAFF'},
								]
							)
						},
						data: [100]
					},
					{
						type: "bar",
						itemStyle: {
							// color: 'rgba(0,0,0,0.5)'
						},
						barWidth: 50,
						barGap : "-100%",
						markLine: {
							data: [
								[
									{
										// 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
										yAxis: 'max',
										x: '10%',
										symbol:'none'
									}, 
									{
										type: 'max',
										label: {
											position: "middle"
										}
									},
								]
							]
						},
						data: [50]
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("degree"))//初始化
			myChart.setOption(option)
		}
	},
	mounted() {
		this.cal_time()
		this.count_sum()
		this.draw_sum()
		this.count_zombieDis()
		this.draw_zombie_dis()
		this.draw_degree()
	},
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
	flex-direction: column;
}
.result .content header p{
	margin-right: 15px;
	line-height: 2;
	display: inline-block;
}
.result .content header p span{
	font-weight: 600;
}

.result .content .charts{
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
}
.result .content .charts .chart{
	width: 100%;
	height: 400px;
}

.result .content .charts .chart.col-2{
	grid-column-start: 1;
	grid-column-end: 3; 
}
</style>
