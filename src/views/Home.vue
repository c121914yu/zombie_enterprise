<template>
	<div class="home">
		<section class="card">	
			<h2>项目背景:</h2>
			<p>"僵尸企业"一词最早由Kane(1987)提出，它是指陷入经营困境，但因获得放贷者或政府的支持而免于倒闭的负债企业。从定义可看出，僵尸企业具有盈利性差、负债率高和吸血性三个特征。</p>
			<p>2016年7月，中国人民大学国家发展与战略研究院发布《中国僵尸企业研究报告——现状、原因和对策》（下称“报告”）。2005—2013年间，全国工业部门中僵尸企业数量约占工业企业总数的7.51%。按企业规模所做的不完全统计，大型、中型和小型企业中“僵尸企业”数量分别约1万家、5万家和13万家。报告针对1998—2015年上市公司数据库进行分析，上市公司中“僵尸企业”的数量在2013年达到高峰（约410家），此后数量有所下降，占比自2003年以来在13%左右波动。通过对十年以上存续期企业的考察和分析发现，国有企业的数量中有38.17%属于长期保持不变的僵尸企业，明显高于其他所有制的占比。</p>
			<p>这些企业难以顺利从产业内退出，不符合产能结构调整方向。僵尸企业会影响经济可持续发展、破坏金融系统稳定性和阻碍我国经济转型升级。僵尸企业无经济效益却占用大量资源，降低资源配置效率。尽管僵尸企业无效益，却依然占有大量的土地、资本、能源、劳动力等资源，导致资源无法向收益更高的部门流动，造成了严重的资源浪费。他们无竞争实力却扰乱市场秩序，还以稳定为借口占据社会资金。而且无偿债能力却吸纳大量企业拆借与银行贷款，易引发金融风险。</p>
			<p>我们对45620组企业(15971家僵尸企业,29649家正常企业)的特征进行了提取，数据图表展示了两者区别较大的特征。</p>
		</section>
		<div class="chart card" id="lost-year"></div>
		<div class="chart card" id="loan"></div>
		<div class="chart card" id="government-sub"></div>
		<div class="chart card" id="tech-content"></div>
		<div class="chart card" id="people-earn"></div>
		<div class="chart card" id="reProfits-grow"></div>
		<div class="chart card" id="reProfits-rate"></div>
	</div>
</template>

<script>
import homeData from "../assets/homeData.json"
var load_amount = 3000,load_time=200
export default{
	data(){
		return{
			barOption: {}
		}
	},
	methods:{
		loss_year(){
			let year = ["0年","1年","2年","3年"]
			let zombieData = year.map((year,i) => {
				let val = homeData.zombie.lossYear[i]
				return {
					name: year,
					value: homeData.zombie.lossYear[i],
					rate: val === 0 ? '0' : (val/homeData.zombie.amount*100).toFixed(2) + "%"
				}
			})
			let commonData = year.map((year,i) => {
				let val = homeData.common.lossYear[i]
				return {
					name: year,
					value: homeData.common.lossYear[i],
					rate: val === 0 ? '0%' : (val/homeData.common.amount*100).toFixed(2) + "%"
				}
			})
			let option = {
				title: {
					text: "亏损年数",
					left: "center"
				},
				legend: {
					right: 20
				},
				tooltip: {
					trigger : "axis",
					axisPointer : {
					  type : "shadow"
					},
					formatter: (params) => {
						let text = ""
						text += `${params[0].name}<br>`
						text += `${params[0].marker} ${params[0].seriesName}: ${params[0].data.value}<br>`
						text += `占比: ${params[0].data.rate}<br>`
						text += `${params[1].marker} ${params[1].seriesName}: ${params[1].data.value}<br>`
						text += `占比: ${params[1].data.rate}<br>`
						return text
					}
				},
				xAxis: [{
					name: "亏损年数",
					type: 'category',
					nameTextStyle: {
						padding: [40,0,0,-50]
					},
					axisTick: {
						alignWithLabel: true
					},
					data: ["0年","1年","2年","3年"]
				}],
				yAxis: [{
					type: "value"
				}],
				series: [
					{
						name: "僵尸企业",
						type: "bar",
						barWidth: "30%",
						barGap: 0,
						color: "#e86452",
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							offset: [-10,0],
							fontSize: 14,
							formatter: (param) => {
								if(param.value === 0)
									return ''
								else
									return `${param.value}`
							}
						},
						data: zombieData
					},
					{
						name: "正常企业",
						type: "bar",
						barWidth: "30%",
						barGap: 0,
						color: "#5ad8a6",
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							offset: [10,0],
							fontSize: 14,
							formatter: (param) => {
								if(param.value === 0)
									return ''
								else
									return `${param.value}`
							}
						},
						data: commonData
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("lost-year"))//初始化
			myChart.setOption(option)
		},
		loan(){
			let years = ["0年","1年","2年"]
			let zombieData = years.map((year,i) => {
				return{
					name: year,
					value: homeData.zombie.loanYear[i],
					rate: (homeData.zombie.loanYear[i] / homeData.zombie.amount*100).toFixed(2)+"%"
				}
			})
			let commonData = years.map((year,i) => {
				return{
					name: year,
					value: homeData.common.loanYear[i],
					rate: (homeData.common.loanYear[i] / homeData.common.amount*100).toFixed(2)+"%"
				}
			})
			let option = {
				title: {
					text: "常青贷款年数",
					left: "center",
					subtext: "内圈为僵尸企业,外圈为正常企业"
				},
				color: ["#5ad8a6","#f6bd16","#e86452"],
				legend: {
					right: 20,
					orient : "vertical"
				},
				tooltip: {
					formatter: (param) => {
						let text = ""
						text += `${param.marker} ${param.name}<br>`
						text += `正常企业: ${commonData[param.dataIndex].value}<br>`
						text += `占比: ${commonData[param.dataIndex].rate}<br>`
						text += `僵尸企业: ${zombieData[param.dataIndex].value}<br>`
						text += `占比: ${zombieData[param.dataIndex].rate}<br>`
						return text
					}
				},
				series: [
					{
						name: "僵尸企业",
						type: "pie",
						top: 50,
						radius: ["40%","60%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							position: "inside",
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: zombieData
					},
					{
						name: "正常企业",
						type: "pie",
						top: 50,
						radius: ["60%","80%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: commonData
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("loan"))//初始化
			myChart.setOption(option)
		},
		government_sub(){
			let years = ["0年","1年","2年","3年"]
			let zombieData = years.map((year,i) => {
				return{
					name: year,
					value: homeData.zombie.subsidy[i],
					rate: (homeData.zombie.subsidy[i] / homeData.zombie.amount*100).toFixed(2)+"%"
				}
			})
			let commonData = years.map((year,i) => {
				return{
					name: year,
					value: homeData.common.subsidy[i],
					rate: (homeData.common.subsidy[i] / homeData.common.amount*100).toFixed(2)+"%"
				}
			})
			let option = {
				title: {
					text: "政府补贴年数",
					left: "center",
					subtext: "内圈为僵尸企业,外圈为正常企业"
				},
				color: ["#5ad8a6","#f6bd16","#2E86C1","#e86452"],
				legend: {
					right: 20,
					orient : "vertical"
				},
				tooltip: {
					formatter: (param) => {
						let text = ""
						text += `${param.marker} ${param.name}<br>`
						text += `正常企业: ${commonData[param.dataIndex].value}<br>`
						text += `占比: ${commonData[param.dataIndex].rate}<br>`
						text += `僵尸企业: ${zombieData[param.dataIndex].value}<br>`
						text += `占比: ${zombieData[param.dataIndex].rate}<br>`
						return text
					}
				},
				series: [
					{
						name: "僵尸企业",
						type: "pie",
						top: 50,
						radius: ["40%","60%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							position: "inside",
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: zombieData
					},
					{
						name: "正常企业",
						type: "pie",
						top: 50,
						radius: ["60%","80%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: commonData
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("government-sub"))//初始化
			myChart.setOption(option)
		},
		tech_content(){
			let content = ['0',1,2,3]
			let zombieData = content.map((item,i) => {
				return{
					name: item,
					value: homeData.zombie.tech_content[i],
					rate: (homeData.zombie.tech_content[i] / homeData.zombie.amount*100).toFixed(2)+"%"
				}
			})
			let commonData = content.map((item,i) => {
				return{
					name: item,
					value: homeData.common.tech_content[i],
					rate: (homeData.common.tech_content[i] / homeData.common.amount*100).toFixed(2)+"%"
				}
			})
			let option = {
				title: {
					text: "科技含量",
					left: "center",
					subtext: "内圈为僵尸企业,外圈为正常企业\n数值越大表示科技含量越大"
				},
				color: ["#AED6F1","#5DADE2","#2E86C1","#21618C"],
				legend: {
					right: 20,
					orient : "vertical"
				},
				tooltip: {
					formatter: (param) => {
						let text = ""
						text += `${param.marker} ${param.name}<br>`
						text += `正常企业: ${commonData[param.dataIndex].value}<br>`
						text += `占比: ${commonData[param.dataIndex].rate}<br>`
						text += `僵尸企业: ${zombieData[param.dataIndex].value}<br>`
						text += `占比: ${zombieData[param.dataIndex].rate}<br>`
						return text
					}
				},
				series: [
					{
						name: "僵尸企业",
						type: "pie",
						top: 50,
						radius: ["40%","60%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							position: "inside",
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: zombieData
					},
					{
						name: "正常企业",
						type: "pie",
						top: 50,
						radius: ["60%","80%"],
						label: {
							show: true, //开启显示
							fontSize: 14,
							formatter: (param) => {
								return `${param.value}`
							}
						},
						data: commonData
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("tech-content"))//初始化
			myChart.setOption(option)
		},
		people_earn(){
			let zombieData = homeData.zombie.belong_People_earn.map(item => [item,Math.random()*20+15])
			let commonData = homeData.common.belong_People_earn.map(item => [item,Math.random()*20+65])
			let zombieData_times = Math.floor(zombieData.length / load_amount)
			let commonData_times = Math.floor(commonData.length / load_amount)
			let option = {
				animation: false,
				title: {
					text: "所有者权益",
					left: "center"
				},
				xAxis: [
					{
						name: "所有者权益",
						type: "value",
						nameTextStyle: {
							padding: [60,0,0,-40]
						},
					}
				],
				yAxis: [
					{
						show: false,
						type: 'value',
						axisTick: {
							alignWithLabel: true
						},
					},
					{
						type: 'category',
						position: "left",
						axisTick: {
							alignWithLabel: true
						},
						data: ["僵尸企业","正常企业"]
					}
				],
				series: [
					{
						name: "正常企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(30,148,147,0.05)",
							borderColor: "rgba(30,148,147,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					},
					{
						name: "僵尸企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(232,100,82,0.05)",
							borderColor: "rgba(232,100,82,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("people-earn"))//初始化
			myChart.setOption(option)
			let loadEnd = false
			const appendZombie = (i) => {
				setTimeout(() => {
					if(i === zombieData_times - 1){
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount)
						})
						if(loadEnd){
							myChart.resize()
							this.reProfits_grow()
						}
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount,load_amount)
						})
						appendZombie(i+1)
					}
				},load_time)
			}
			const appendcommon = (i) => {
				setTimeout(() => {
					if(i === commonData_times - 1){
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount)
						})
						if(loadEnd){
							this.reProfits_grow()
							myChart.resize()
						}
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount,load_amount)
						})
						appendcommon(i+1)
					}
				},load_time)
			}
			appendZombie(0)
			appendcommon(0)
		},
		reProfits_grow(){
			let zombieData = homeData.zombie.reProfits_grow.map(item => [item,Math.random()*20+15])
			let commonData = homeData.common.reProfits_grow.map(item => [item,Math.random()*20+65])
			let zombieData_times = Math.floor(zombieData.length / load_amount)
			let commonData_times = Math.floor(commonData.length / load_amount)
			let option = {
				animation: false,
				title: {
					text: "净利润增长率",
					left: "center"
				},
				xAxis: [
					{
						name: "净利润增长率",
						type: "value",
						nameTextStyle: {
							padding: [60,0,0,-40]
						},
					}
				],
				yAxis: [
					{
						show: false,
						type: 'value',
						axisTick: {
							alignWithLabel: true
						},
					},
					{
						type: 'category',
						position: "left",
						axisTick: {
							alignWithLabel: true
						},
						data: ["僵尸企业","正常企业"]
					}
				],
				series: [
					{
						name: "正常企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(30,148,147,0.05)",
							borderColor: "rgba(30,148,147,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					},
					{
						name: "僵尸企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(232,100,82,0.05)",
							borderColor: "rgba(232,100,82,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("reProfits-grow"))//初始化
			myChart.setOption(option)
			let loadEnd = false
			const appendZombie = (i) => {
				setTimeout(() => {
					if(i === zombieData_times - 1){
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount)
						})
						if(loadEnd){
							this.reProfits_rate()
							myChart.resize()
						}
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount,load_amount)
						})
						appendZombie(i+1)
					}
				},load_time)
			}
			const appendcommon = (i) => {
				setTimeout(() => {
					if(i === commonData_times - 1){
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount)
						})
						if(loadEnd){
							this.reProfits_rate()
							myChart.resize()
						}
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount,load_amount)
						})
						appendcommon(i+1)
					}
				},load_time)
			}
			appendZombie(0)
			appendcommon(0)
		},
		reProfits_rate(){
			let zombieData = homeData.zombie.reProfits_rate.map(item => [item,Math.random()*20+15])
			let commonData = homeData.common.reProfits_rate.map(item => [item,Math.random()*20+65])
			let zombieData_times = Math.floor(zombieData.length / load_amount)
			let commonData_times = Math.floor(commonData.length / load_amount)
			let option = {
				animation: false,
				title: {
					text: "净利润比重",
					left: "center"
				},
				xAxis: [
					{
						name: "净利润比重",
						type: "value",
						nameTextStyle: {
							padding: [60,0,0,-40]
						},
					}
				],
				yAxis: [
					{
						show: false,
						type: 'value',
						axisTick: {
							alignWithLabel: true
						}
					},
					{
						type: 'category',
						position: "left",
						axisTick: {
							alignWithLabel: true
						},
						data: ["僵尸企业","正常企业"]
					}
				],
				series: [
					{
						name: "正常企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(30,148,147,0.05)",
							borderColor: "rgba(30,148,147,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					},
					{
						name: "僵尸企业",
						type: "scatter",
						itemStyle: {
							color: "rgba(232,100,82,0.05)",
							borderColor: "rgba(232,100,82,0.7)",
							borderWidth: 0.8
						},
						symbolSize: 5,
						silent: true,
						data: []
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("reProfits-rate"))//初始化
			myChart.setOption(option)
			let loadEnd = false
			const appendZombie = (i) => {
				setTimeout(() => {
					if(i === zombieData_times - 1){
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount)
						})
						if(loadEnd)
							myChart.resize()
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 1,
							data: zombieData.slice(i*load_amount,load_amount)
						})
						appendZombie(i+1)
					}
				},load_time)
			}
			const appendcommon = (i) => {
				setTimeout(() => {
					if(i === commonData_times - 1){
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount)
						})
						if(loadEnd)
							myChart.resize()
						else
							loadEnd = true
					}
					else{
						myChart.appendData({
							seriesIndex: 0,
							data: commonData.slice(i*load_amount,load_amount)
						})
						appendcommon(i+1)
					}
				},load_time)
			}
			appendZombie(0)
			appendcommon(0)
		},
	},
	mounted() {
		console.log(homeData)
		const height = document.querySelector(".chart").clientHeight + 20
		const doms = Array.from(document.querySelectorAll(".chart"))
		doms.forEach(item => {
			item.style.height = `${height}px`
		})
		setTimeout(() => {
			this.loss_year()
			this.loan()
			this.government_sub()
			this.tech_content()
			this.people_earn()
		})
	}
}
</script>

<style scoped>
.home{
	display: grid;
	grid-template-columns: repeat(2,1fr);
	grid-gap: 10px;
}
.home .chart{
	width: 100%;
	height: 100%;
	/* height: 500px; */
	
}
</style>
