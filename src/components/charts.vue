<template>
	<div class="charts">
		<h2>结果展示</h2>
		<div class="sorts">
			<div 
				class="sort"
				:class="index===currentSort ? 'active' : ''"
				v-for="(item,index) in sorts"
				:key="index"
				@click="currentSort=index">
				{{item}}
			</div>
		</div>
		
		<div class="container" v-show="currentSort===0">
			<div class="chart" id="is-evloan"></div>		
			<div class="chart" id="evload-year"></div>
			<div class="chart" id="is-gov-subsidy"></div>
			<div class="chart" id="gov-subsidy-year"></div>
			<div class="chart" id="loss-year"></div>
		</div>
	</div>
</template>

<script>
var isEvLoans_normal=[0,0],isEvLoans_zombie = [0,0]
var lossYear_normal=[],lossYear_zombie = []
var evloansYear_normal=[2,3],evloansYeat_zombie=[0]

export default{
	data(){
		return{
			currentSort: 0,
			sorts: [
				"僵尸表现","分布","企业特征","成本与融资","成长能力","营运能力"
			]
		}
	},
	props:{
		enterprise: Array
	},
	methods:{
		count_isEvLoans(item){ //计算是否常青贷款
			if(item[0].flag === 0)
				isEvLoans_zombie[item[0].常青贷款与否] += 1
			else
				isEvLoans_normal[item[0].常青贷款与否] += 1
		},
		isEvLoans(){ // 常青贷款与否
			const option = {
			  title: {
			    text : "常青贷款与否",
					left: "center"
			  },
			  color: ['#5ad8a6',"#e86452"],
				legend : {
					right: 0,
					orient: "vertical",
					data : ['正常企业','僵尸企业'],
				},
			  tooltip: {
			    trigger : "axis",
			    axisPointer : {
			      type : "shadow"
			    },
					formatter: (params) => {
						const head = `${params[0].axisValue}<br>`
						const data1 = `${params[0].marker}${params[0].seriesName}: ${params[0].value}个<br>`
						const data2 = `${params[1].marker}${params[1].seriesName}: ${params[1].value}个`
						return head + data1 + data2
					}
			  },
			  xAxis: {
					type: "category",
					data: ["是","否"],
					axisTick: {
						alignWithLabel: true
					}
			  },
			  yAxis:{
					name: "数量",
					type : 'value',
			  },
			  series: [
			    {
			      name: '正常企业',
			      type: 'bar',
			      data: isEvLoans_normal,
						barWidth: "30%",
						barGap: 0
			    },
			    {
			      name: '僵尸企业',
			      type: 'bar',
			      data: isEvLoans_zombie,
						barWidth: "30%",
						barGap: 0
			    }
			  ]
			}
			let myChart = this.$echarts.init(document.getElementById('is-evloan'))//初始化
			myChart.setOption(option)
		},
		evloansYear(){ // 常青贷款年数
			const option = {
			  title: {
			    text : "常青贷款年数",
					left: "center"
			  },
			  color: ['#5ad8a6',"#e86452"],
				legend : {
					right: 0,
					orient: "vertical",
					data : ['正常企业','僵尸企业'],
				},
			  tooltip: {
			    trigger : "axis",
			    axisPointer : {
			      type : "shadow"
			    },
					formatter: (params) => {
						// console.log(params)
						const head = `常青贷款 ${params[0].axisValue}<br>`
						const data1 = `${params[0].marker}${params[0].seriesName}: ${params[0].value}个<br>`
						const data2 = `${params[1].marker}${params[1].seriesName}: ${params[1].value}个`
						return head + data1 + data2
					}
			  },
			  xAxis: {
					name: "年数",
					type: "category",
					axisTick: {
						alignWithLabel: true
					},
					nameTextStyle: {
						padding: [30,0,0,0]
					},
					nameGap: 0,
					boundaryGap: ['20%', '20%'],
					data: ["0年","1年","2年","3年"]
			  },
			  yAxis:{
					name: "数量",
					type : 'value',
			  },
			  series: [
			    {
			      name: '正常企业',
			      type: 'bar',
			      data: [2,5,4,10],
						barWidth: "30%",
						barGap: 0,
			    },
			    {
			      name: '僵尸企业',
			      type: 'bar',
			      data: [10,4,4,2],
						barWidth: "30%",
						barGap: 0
			    }
			  ]
			}
			let myChart = this.$echarts.init(document.getElementById('evload-year'))//初始化
			myChart.setOption(option)
		},
		isGovSubsidy(){ //是否接受接受政府补贴
			const option = {
			  title: {
			    text : "是否接受政府补贴",
					left: "center"
			  },
			  color: ['#5b8ff9',"#F56C6C"],
				legend : {
					right: 0,
					orient: "vertical",
					data : ['正常企业','僵尸企业'],
				},
			  tooltip: {
			    trigger : "axis",
			    axisPointer : {
			      type : "shadow"
			    },
					formatter: (params) => {
						const head = `${params[0].axisValue}<br>`
						const data1 = `${params[0].marker}${params[0].seriesName}: ${params[0].value}个<br>`
						const data2 = `${params[1].marker}${params[1].seriesName}: ${params[1].value}个`
						return head + data1 + data2
					}
			  },
			  xAxis: {
					type: "category",
					data: ["是","否"],
					axisTick: {
						alignWithLabel: true
					}
			  },
			  yAxis:{
					name: "数量",
					type : 'value',
			  },
			  series: [
			    {
			      name: '正常企业',
			      type: 'bar',
			      data: [30,10],
						barWidth: "30%",
						barGap: 0
			    },
			    {
			      name: '僵尸企业',
			      type: 'bar',
			      data: [5,60],
						barWidth: "30%",
						barGap: 0
			    }
			  ]
			}
			let myChart = this.$echarts.init(document.getElementById('is-gov-subsidy'))//初始化
			myChart.setOption(option)
		},
		govSubsidyYear(){ //补贴年数
			const option = {
			  title: {
			    text : "政府补贴年数",
					left: "center"
			  },
			  color: ['#5b8ff9',"#F56C6C"],
				legend : {
					right: 0,
					orient: "vertical",
					data : ['正常企业','僵尸企业'],
				},
			  tooltip: {
			    trigger : "axis",
			    axisPointer : {
			      type : "shadow"
			    },
					formatter: (params) => {
						const head = `补贴 ${params[0].axisValue}<br>`
						const data1 = `${params[0].marker}${params[0].seriesName}: ${params[0].value}个<br>`
						const data2 = `${params[1].marker}${params[1].seriesName}: ${params[1].value}个`
						return head + data1 + data2
					}
			  },
			  xAxis: {
					name: "年数",
					type: "category",
					axisTick: {
						alignWithLabel: true
					},
					nameTextStyle: {
						padding: [30,0,0,0]
					},
					nameGap: 0,
					boundaryGap: ['20%', '20%'],
					data: ["0年","1年","2年","3年"]
			  },
			  yAxis:{
					name: "数量",
					type : 'value',
			  },
			  series: [
			    {
			      name: '正常企业',
			      type: 'bar',
			      data: [2,5,4,10],
						barWidth: "30%",
						barGap: 0
			    },
			    {
			      name: '僵尸企业',
			      type: 'bar',
			      data: [10,4,4,2],
						barWidth: "30%",
						barGap: 0
			    }
			  ]
			}
			let myChart = this.$echarts.init(document.getElementById('gov-subsidy-year'))//初始化
			myChart.setOption(option)
		},
		count_lossYear(item){
			const year = item[0].亏损年数
			if(item[0].flag === 0)
				lossYear_zombie[item[0].常青贷款与否] += 1
			else
				lossYear_normal[item[0].常青贷款与否] += 1
		},
		lossYear(){
			const option = {
			  title: {
			    text : "亏损年数",
					left: "center"
			  },
			  color: ['#1e9493',"#F56C6C"],
				legend : {
					right: 0,
					orient: "vertical",
					data : ['正常企业','僵尸企业'],
				},
			  tooltip: {
			    trigger : "axis",
			    axisPointer : {
			      type : "shadow"
			    },
					formatter: (params) => {
						const head = `亏损 ${params[0].axisValue}<br>`
						const data1 = `${params[0].marker}${params[0].seriesName}: ${params[0].value}个<br>`
						const data2 = `${params[1].marker}${params[1].seriesName}: ${params[1].value}个`
						return head + data1 + data2
					}
			  },
			  xAxis: {
					name: "年数",
					type: "category",
					axisTick: {
						alignWithLabel: true
					},
					boundaryGap: ['20%', '20%'],
					nameTextStyle: {
						padding: [30,0,0,0]
					},
					nameGap: 0,
					data: ["0年","1年","2年","3年","4年","5年"]
			  },
			  yAxis:{
					name: "数量",
					type : 'value',
			  },
			  series: [
			    {
			      name: '正常企业',
			      type: 'bar',
			      data: [10,5,2,1,1,0],
						barWidth: "30%",
						barGap: 0,
			    },
			    {
			      name: '僵尸企业',
			      type: 'bar',
			      data: [2,4,10,15,10,5],
						barWidth: "30%",
						barGap: 0,
			    }
			  ]
			}
			let myChart = this.$echarts.init(document.getElementById('loss-year'))//初始化
			myChart.setOption(option)
		}
	},
	mounted() {
		this.enterprise.forEach((item,i) => {
			// 计算常青贷款
			this.count_isEvLoans(item)
			// 计算
		})
		this.isEvLoans()
		this.evloansYear()
		this.isGovSubsidy()
		this.govSubsidyYear()
		this.lossYear()
	}
}
</script>

<style scoped>
.charts{
	margin: 10px 0;
	width: 100%;
}

.charts .sorts{
	margin: 5px 0;
	display: flex;
	justify-content: space-around;
}
.charts .sorts .sort{
	font-weight: 500;
	font-size: 1.1em;
	padding: 5px 10px;
	cursor: pointer;
	border-bottom: 3px solid transparent;
	transition: 0.2s;
}
.charts .sorts .sort:hover{
	color: rgba(255,152,69,0.7);
	border-bottom-color: rgba(255,152,69,0.7);
}
.charts .sorts .sort.active{
	color: #ff9845;
	border-bottom-color: #ff9845;
}

.charts .container{
	margin-top: 15px;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
}
.charts .container .chart{
	width: 100%;
	height: 300px;
}
.charts .container .chart#loss-year{
	grid-column-start: 1;
	grid-column-end: 3; 
}
</style>
