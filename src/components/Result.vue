<template>
	<div class="result">
		<h2>识别结果</h2>
		<div class="content">
			<header>
				运行时间: <span>{{time}}s</span>
			</header>
			<div class="navs">
				<div 
					class="item"
					:class="index === currentNav ? 'active' : ''"
					v-for="(item,index) in navs"
					:key="item"
					@click="currentNav=index"
				>
					{{item}}
				</div>
				<div v-if="currentNav === 1" class="item id">
					<span class="text">ID:</span>
					<span class="val">{{zombie_amount[currentID].ID}}</span>
					<i class="iconfont icon-xiala"></i>
					<div class="list">
						<div 
							class="item"
							v-for="(item,index) in zombie_amount"
							:key="index"
							@click="currentID=index;getIDInfo()"
						>
							{{item.ID}}
						</div>
					</div>
				</div>
			</div>
			<div class="charts">
				<div 
					:class="currentNav === 0 ? 'show' : ''" 
					class="item">
					<div class="chart" id="sum"></div>
					<div class="chart col-2" id="zombie-dis"></div>
				</div>
				<div 
					:class="currentNav === 1 ? 'show' : ''" 
					class="item">
					<div class="chart" id="degree"></div>
					<div class="chart" id="feature"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import data from "../assets/data.json"
var sum_charts=[],single_charts=[]
var zombieDis = []
export default{
	data(){
		return{
			navs: [
				"分布情况","企业画像"
			],
			currentNav: 0,
			currentID: 0,
			time: 0,
			zombie_amount: [],
			normal_amount: [],
		}
	},
	watch:{
		currentNav:'changeNav'
	},
	methods:{
		changeNav(index){
			if(index === 0){
				sum_charts.forEach(chart => {
					chart.clear()
				})
				sum_charts = []
				this.draw_sum()
				this.draw_zombie_dis()
			}
			else if(index === 1){
				this.getIDInfo()
			}
		},
		getIDInfo(){
			single_charts.forEach(chart => {
				chart.clear()
			})
			single_charts = []
			this.draw_degree(this.zombie_amount[this.currentID])
		},
		cal_time(){
			this.time = data.time / 1000
		},
		cal_sum(){ // 计算总分布情况
			for(let i in data.data){
				const item = data.data[i]
				if(item.final_pre === 1)
					this.zombie_amount.push(item)
				else
					this.normal_amount.push(item)
			}
		},
		draw_sum(){ // 计算
			const sum = this.zombie_amount.length + this.normal_amount.length
			const zombiePro = (this.zombie_amount.length / sum*100).toFixed(1) + "%"
			const normalPro = (this.normal_amount.length / sum*100).toFixed(1) + "%"
			let option = {
				title: {
					text: "数量分布",
					left: "0",
				},
				tooltip: {
					formatter: (params) => {
						return `
										 ${params.marker}${params.name}<br>
										 总数: ${params.data.value}家<br>
										 占比: ${(params.data.value/sum*100).toFixed(1)}%
									 `
					}
				},
				legend: {
					right: 5,
					orient: "vertical",
					icon: "circle",
					selectedMode : false,
					textStyle: {
						fontSize: 14
					},
					formatter: (name) => {
						let str = name + " "
						return name === "正常企业" ? str+normalPro : str+zombiePro
					}
				},
				series: [
					{
						name: "数量分布",
						type: "pie",
						radius: ["50%","70%"],
						label: {
							fontSize: 16,
							fontWeight: 600,
							formatter: (params) => {
								return `${params.data.value}家`
							}
						},
						data: [
							{
								name: "僵尸企业",
								value: this.zombie_amount.length,
								itemStyle: {
									color: "#e86452"
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
			sum_charts.push(myChart)
		},
		cal_zombieDis(){ //僵尸分布情况计算
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
					left: "0"
				},
				color: ["#FFB5B5","#ff7575","#FF2D2D","#EA0000","#CE0000"],
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
				legend: {
					data: ["0% - 20%","20% - 40%","40% - 60%","60% - 80%","80% - 100%"],
					left: 0,
					top: "25%",
					orient: "vertical",
					icon: "circle",
				},
				toolbox: {
					feature: {
						magicType: {show: true, type: ['stack']},
						saveAsImage: {show: true}
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
				grid: {
					left: 150
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
			sum_charts.push(myChart)
		},
		draw_degree(data){ // 僵尸程度分布
			// const val = Math.round(data.zombie_pro*100)
			let val = 35
			let option = {
				title: {
					text: "僵尸等级",
					left: "center"
				},
				xAxis: {
					type: "category",
					data: ["第三类"]
				},
				yAxis: {
					type: "value",
					name: "僵尸程度"
				},
				series: [
					{
						name: "僵尸程度",
						type: "bar",
						barWidth: "10%",
						barGap : "-100%",
						itemStyle: {
							color: new this.$echarts.graphic.LinearGradient(
								0, 0, 0, 1,
								[
										{offset: 0, color: '#930000'},
										{offset: 0.4, color: '#EA0000'},
										{offset: 0.6, color: '#FF2D2D'},
										{offset: 0.8, color: '#ff7575'},
										{offset: 1, color: '#FFB5B5'},
								]
							)
						},
						markLine: {
							silent: true,
							animationDuration: 500,
							lineStyle: {
								type: "solid",
								width: 3
							},
							data: [
								[
									{
										x: '10%',
										coord: [0,val],
										symbol:'none'
									}, 
									{
										x: "46%",
										coord: [0,val],
										value: val,
										symbolSize: 12,
										symbolOffset: [0,"20%"],
										label: {
											position: "middle"
										}
									},
								]
							]
						},
						data: [100]
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("degree"))//初始化
			myChart.setOption(option)
			single_charts.push(myChart)
		},
		draw_feature(){ // 僵尸企业特征色块n*n
			let option = {
				
			}
			let myChart = this.$echarts.init(document.getElementById("feature"))//初始化
			myChart.setOption(option)
			charts.push(myChart)
		}
	},
	mounted() {
		this.cal_time()
		this.cal_sum()
		this.cal_zombieDis()
		
		this.changeNav(0)
		
		window.onresize = () => {
			setTimeout(() => {
				sum_charts.forEach(chart => {
					chart.resize()
				})
				single_charts.forEach(chart => {
					chart.resize()
				})
			})
		}
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
.result .content header span{
	font-weight: 600;
}

.result .content .navs{
	margin: 10px 0;
	display: flex;
}
.result .content .navs>.item{
	margin-right: 15px;
	padding: 5px 10px;
	cursor: pointer;
}
.result .content .navs>.item.active{
	background-color: var(--origin);
	color: #FFFFFF;
	border-radius: 5px;
}
.result .content .navs .id{
	position: relative;
	width: 150px;
	border: var(--border1);
	border-radius: 5px;
	text-align: center;
}
.result .content .navs .id .text{
	position: absolute;
	left: 5px;
}
.result .content .navs .id .list{
	position: absolute;
	left: 0;
	top: 36px;
	width: 100%;
	height: 0;
	overflow-y: hidden;
	border-radius: 5px;
	box-shadow: var(--box-shadow2);
	background-color: #FFFFFF;
	z-index: 10;
	transition: var(--hover-speed);
}
.result .content .navs .id .list .item{
	padding: 5px 0;
	cursor: pointer;
}
.result .content .navs .id .list .item:hover{
	background-color: var(--green1);
	color: #FFFFFF;
}
.result .content .navs .id i{
	position: absolute;
	right: 5px;
	transition: var(--hover-speed);
}
.result .content .navs .id:hover i{
	transform: rotate(180deg);
}
.result .content .navs .id:hover .list{
	height: 170px;
	overflow-y: scroll;
}

.result .content .charts{
	position: relative;
	height: 800px;
}
.result .content .charts .item{
	position: absolute;
	height: 100%;
	width: 100%;
	visibility: hidden;
	display: grid;
	grid-template-columns: 1fr 1fr;
}
.result .content .charts .item.show{
	visibility: visible;
}
.result .content .charts .item .chart{
	width: 100%;
	height: 400px;
}

.result .content .charts .chart.col-2{
	grid-column-start: 1;
	grid-column-end: 3; 
}
</style>
