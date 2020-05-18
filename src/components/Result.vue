<template>
	<div class="result">
		<header class="card">
			<h3>识别结果</h3>
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
					<span class="val">{{zombie[currentID].id}}</span>
					<i class="iconfont icon-xiala"></i>
					<div class="list">
						<div 
							class="item"
							v-for="(item,index) in zombie"
							:key="index"
							@click="currentID=index;changeNav(currentNav)"
						>
							{{item.id}}
						</div>
					</div>
				</div>
			</div>
			<span>运行时间: {{result.time}}s</span>
		</header>
		<div class="charts">
			<div 
				:class="currentNav === 0 ? 'show' : ''" 
				class="item">
				<div class="chart card" id="sum"></div>
				<div class="chart card" id="zombie-dis"></div>
				<div class="chart card col-2" id="degree-dis"></div>
			</div>
			<div 
				:class="currentNav === 1 ? 'show' : ''" 
				class="item">
				<div class="chart card" id="degree"></div>
				<div class="chart card">
					<degreeTable></degreeTable>
				</div>
				<div class="chart" id="feature"></div>
			</div>
		</div>
	</div>
</template>

<script>
/* 
	EBit：息税前利润
	Lev:负债率
	debt_inc：负债增长率
	profit_inc：净利润增长率
	inter_cover:利息保障倍数
	grant_profit:政府补贴依赖程度
*/
import degreeTable from "./degreeTable.vue"
var data
var charts = []
var zombieDis,degreeDis
export default{
	data(){
		return{
			navs: ["分布情况","僵尸画像"],
			currentNav: 0,
			currentID: 0,
			zombie: [],
			normal: [],
		}
	},
	props:{
		result: Object
	},
	watch:{
		currentNav:'changeNav'
	},
	methods:{
		changeNav(index){
			charts.forEach(chart => {
				chart.clear()
			})
			charts = []
			setTimeout(() => {
				if(index === 0){
					this.draw_sum()
					this.draw_zombie_dis()
					this.draw_degree_dis()
				}
				else if(index === 1){
					this.draw_degree(this.zombie[this.currentID])
				}
			})
		},
		cal_sum(){ // 计算总分布情况
			data.forEach(item => {
				if(item.final_pre === 1)
					this.zombie.push(item)
				else
					this.normal.push(item)
			})
		},
		cal_zombieDis(){
			zombieDis = [
				{name: "第Ⅰ类",value: 0},
				{name: "第Ⅱ类",value: 0},
				{name: "第Ⅲ类",value: 0},
				{name: "第Ⅳ类",value: 0},
				{name: "第Ⅴ类",value: 0}
			]
			this.zombie.forEach(item => {
				item.zombie_type.forEach(type => {
					zombieDis[type-1].value++
				})
			})
		},
		cal_degreeDis(){
			degreeDis = [
				{name: "0-0.2",value: 0},
				{name: "0.2-0.4",value: 0},
				{name: "0.4-0.6",value: 0},
				{name: "0.6-0.8",value: 0},
				{name: "0.8-1",value: 0}
			]
			data.forEach(item => {
				for(let i=1;i<=5;i++)
					if(item.zombie_level < 0.2*i){
						degreeDis[i-1].value++
						break
					}
			})
		},
		draw_sum(){ // 计算
			const sum = this.zombie.length + this.normal.length
			const zombiePro = (this.zombie.length / sum*100).toFixed(1) + "%"
			const normalPro = (this.normal.length / sum*100).toFixed(1) + "%"
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
								value: this.zombie.length,
								itemStyle: {
									color: "#e86452"
								}
							},
							{
								name: "正常企业",
								value: this.normal.length,
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
			charts.push(myChart)
		},
		draw_zombie_dis(){ // 僵尸等级分布
			const sum = zombieDis.reduce((sum,item) => {
				return sum+item.value
			},0)
			const pro = {}
			zombieDis.forEach(item => {
				if(item.value === 0)
					pro[item.name] = "0%"
				else
					pro[item.name] = (item.value/sum*100).toFixed(2) + "%"
			})
			let option = {
				title: {
					text: "僵尸等级分布",
					left: "0"
				},
				color: ["#FFB5B5","#ff7575","#FF2D2D","#CE0000","#930000"],
				tooltip: {
					formatter: (param) => {
						let content = ""
						content += param.marker
						content += `${param.data.name}<br>`
						content += `数量: ${param.data.value}家<br>`
						content += `占比: ${pro[param.data.name]}<br>`
						return content
					}
				},
				legend: {
					data: ["第Ⅰ类","第Ⅱ类","第Ⅲ类","第Ⅳ类","第Ⅴ类"],
					right: 5,
					orient: "vertical",
					icon: "circle",
					textStyle: {
						fontSize: 14
					},
					formatter: (name) => {
						return name + " " + pro[name]
					}
				},
				series: {
					name: "僵尸等级",
					type: 'pie',
					width: "90%",
					top: 20,
					label: {
						fontSize: 16,
						fontWeight: 600,
					},
					data: zombieDis
				}
			}
			let myChart = this.$echarts.init(document.getElementById("zombie-dis"))//初始化
			myChart.setOption(option)
			charts.push(myChart)
		},
		draw_degree_dis(){ // 僵尸程度分布
			const sum = degreeDis.reduce((sum,item) => {
				return sum+item.value
			},0)
			let option = {
				title: {
					text: "僵尸程度分布",
				},
				tooltip: {
					trigger : "axis",
					axisPointer : {
					  type : "shadow"
					},
					formatter: (params) => {
						return `
							${params[0].marker} ${params[0].name}<br>
							数量: ${params[0].value}家<br>
							占比: ${(params[0].value/sum*100).toFixed(1)}%
						`
					}
				},
				xAxis: {
					name: "僵尸程度",
					type: "category",
					axisTick: {
						alignWithLabel: true
					},
					data: ["0-0.2","0.2-0.4","0.4-0.6","0.6-0.8","0.8-1"]
				},
				yAxis: {
					type: "value",
					name: "数量"
				},
				series: [
					{
						name: "0-0.2",
						type: "bar",
						barWidth: "40%",
						itemStyle: {
							normal: {
								color: (params) => {
									const colors = ["#FFB5B5","#ff7575","#FF2D2D","#CE0000","#930000"]
									return colors[params.dataIndex]
								}
							}
						},
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							fontSize: 16,
							formatter: (param) => {
								if(param.data.value === 0)
									return ''
								else
									return `${param.data.value}家`
							}
						},
						data: degreeDis
					}
				]
			}
			console.log(degreeDis)
			let myChart = this.$echarts.init(document.getElementById("degree-dis"))//初始化
			myChart.setOption(option)
			charts.push(myChart)
		},
		draw_degree(data){ // 僵尸程度分布
			const val = Math.round((data.zombie_level*100).toFixed(2))
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
										{offset: 0.4, color: '#CE0000'},
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
			charts.push(myChart)
		},
		draw_feature(){ // 僵尸企业特征色块n*n
			let option = {
				
			}
			let myChart = this.$echarts.init(document.getElementById("feature"))//初始化
			myChart.setOption(option)
			charts.push(myChart)
		}
	},
	created() {
		data = this.result.data
		this.cal_sum()
		this.cal_zombieDis()
		this.cal_degreeDis()
	},
	mounted() {
		this.changeNav(0)
		
		window.onresize = () => {
			setTimeout(() => {
				charts.forEach(chart => {
					chart.resize()
				})
			})
		}
	},
	components:{
		degreeTable
	}
}
</script>

<style scoped>
.result{
	position: relative;
}

.result header{
	display: flex;
	align-items: flex-end;
}
.result header span{
	margin-left: 10px;
}
.result header .navs{
	margin-left: 15px;
	flex: 1;
	display: flex;
}
.result header .navs>.item{
	margin-right: 15px;
	height: 35px;
	line-height: 35px;
	padding: 0 10px;
	cursor: pointer;
}
.result header .navs>.item.active{
	background-color: var(--origin);
	color: #FFFFFF;
	border-radius: 5px;
}
.result header .navs .id{
	position: relative;
	width: 150px;
	border: var(--border1);
	border-radius: 5px;
	text-align: center;
}
.result header .navs .id .text{
	position: absolute;
	left: 0;
}
.result header .navs .id .list{
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
.result header .navs .id .list .item{
	padding: 5px 0;
	cursor: pointer;
}
.result header .navs .id .list .item:hover{
	background-color: var(--origin);
	color: #FFFFFF;
}
.result header .navs .id i{
	position: absolute;
	right: 5px;
	transition: var(--hover-speed);
}
.result header .navs .id:hover i{
	transform: rotate(180deg);
}
.result header .navs .id:hover .list{
	height: 170px;
	overflow-y: scroll;
}

.result .charts{
	margin-top: 10px;
	width: 100%;
}
.result .charts .item{
	width: 100%;
	display: none;
	grid-template-columns: repeat(2,1fr);
	grid-gap: 10px;
}
.result .charts .item.show{
	display: grid;
}
.result .charts .item .chart{
	width: 100%;
	height: 400px;
}
.result .charts .item .chart.col-2{
	grid-column-start: 1;
	grid-column-end: 3; 
}

.result .charts .item .chart img{
	width: 100%;
	height: 100%;
	
}
</style>
