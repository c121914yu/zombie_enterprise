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
					<span class="val">{{zombie[currentIndex].id}}</span>
					<i class="iconfont icon-xiala"></i>
					<div class="list">
						<div 
							class="item"
							v-for="(item,index) in zombie"
							:key="index"
							@click="currentIndex=index;changeNav(currentNav)"
						>
							{{item.id}}
						</div>
					</div>
				</div>
			</div>
			<typeTable></typeTable>
			<span>运行时间: {{result.time}}s</span>
		</header>
		<div class="charts">
			<div 
				:class="currentNav === 0 ? 'show' : ''" 
				class="item batch">
				<div class="chart card" id="sum"></div>
				<div class="chart card" id="zombie-dis"></div>
				<div class="chart card col-2" id="type-dis"></div>
			</div>
			<div 
				:class="currentNav === 1 ? 'show' : ''" 
				class="item single">
				<div class="describe card">
					<h3 class="center">画像描述</h3>
					<li>该企业为 <strong>{{describeInfo.type}}</strong>僵尸企业</li>
					<li>判断为僵尸的概率高达 <strong>{{describeInfo.zombie_pro}}</strong></li>
					<div v-html="describeInfo.feature_des"></div>
				</div>
				<div class="chart card" id="type"></div>
				<div class="card">
					<p class="center">特征贡献色块-cnn模型</p>
					<p class="remark">包含81个特征对判断为僵尸企业的贡献度，每个色块代表一个特征，<strong style="color: #e86452;">红色</strong>越深表示贡献度越大，<strong style="color: #5AD8A6;">绿色</strong>代表贡献度为0。</p>
					<ul class="grad-cam center">
						<li
							class="center"
							:class="item.value === 0 ? '' : 'contribute'"
							:style="item.value === 0 ? 'border:var(--border1)' : `background-color: rgba(206,0,0,${item.value*0.9+0.1})`"
							v-for="(item,index) in describeInfo.grad_cam"
							:key="index"
							@click="getFeatureIndex(item.text)"
						>
							<div class="message">{{item.text}}: {{item.value}}</div>
						</li>
					</ul>
				</div>
				<div class="card">
					<p class="center">特征贡献色块-stacking模型</p>
					<p class="remark">包含81个特征对判断为僵尸企业的贡献度，每个色块代表一个特征，<strong style="color: #e86452;">红色</strong>越深表示贡献度正影响越大，<strong style="color: #1e9493;">绿色</strong>代表对贡献度负影响越大。</p>
					<ul class="grad-cam center">
						<li
							class="center"
							:class="item.value === 0 ? '' : 'contribute'"
							:style="item.value > 0  ? `background-color: rgba(206,0,0,${item.value*0.9+0.1})` : item.value === 0 ? 'border:var(--border1)' : `background-color: rgba(30,148,147,${-item.value*0.9+0.1})`"
							v-for="(item,index) in describeInfo.contribute_matrix"
							:key="index"
							@click="getFeatureIndex(item.text)"
						>
							<div class="message">{{item.text}}: {{item.value}}</div>
						</li>
					</ul>
				</div>
				<div class="card col-2 feature">
					<i class="iconfont icon-last" @click="changeFeatureIndex(-1)"></i>
					<div class="chart" id="feature-data"></div>
					<i class="iconfont icon-next" @click="changeFeatureIndex(1)"></i>
				</div>
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
import typeTable from "./typeTable.vue"
export default{
	data(){
		return{
			navs: ["分布情况","僵尸画像"],
			currentRoute: "",
			currentNav: 0,
			currentIndex: 0,
			currentFeature: 0,
			data: "",
			charts: [],
			featureChart: "",
			describeInfo: {},
			zombie: [],
			normal: [],
			zombieDis: "",
			typeDis: "",
			features: [],
		}
	},
	props:{
		result: Object
	},
	watch:{
		currentNav: 'changeNav'
	},
	methods:{
		changeNav(index){
			this.charts.forEach(chart => {
				chart.clear()
			})
			this.charts = []
			setTimeout(() => {
				if(index === 0){
					this.draw_sum()
					this.draw_zombie_dis()
					this.draw_type_dis()
				}
				else if(index === 1){
					this.cal_enterpriseInfo()
					this.draw_type(this.zombie[this.currentIndex].zombie_level)
					this.reDraw_feature()
				}
			})
		},
		changeFeatureIndex(i){
			let temp = this.currentFeature
			temp += i
			if(temp >= this.features.length)
				temp = 0
			else if(temp < 0)
				temp = this.features.length - 1
			this.currentFeature = temp
			this.reDraw_feature()
		},
		getFeatureIndex(key){
			let index = this.features.indexOf(key)
			if(index > -1){
				this.currentFeature = index
				this.reDraw_feature()
			}
		},
		reDraw_feature(){
			if(this.featureChart){
				this.featureChart.clear()
				this.featureChart = ""
			}
			this.draw_featureData(this.zombie[this.currentIndex].featured_data)
		},
		cal_sum(){ // 计算总分布情况
			this.data.forEach(item => {
				if(item.final_pre === 1)
					this.zombie.push(item)
				else
					this.normal.push(item)
			})
			for(let key in this.data[0].featured_data[0]){
				if(key != "year")
					this.features.push(key)
			}
			if(this.zombie.length === 0)
				this.navs = ["分布情况"]
			// console.log(data)
		},
		cal_zombieDis(){
			this.zombieDis = [
				{name: "第Ⅰ类",value: 0},
				{name: "第Ⅱ类",value: 0},
				{name: "第Ⅲ类",value: 0},
				{name: "第Ⅳ类",value: 0},
				{name: "第Ⅴ类",value: 0}
			]
			this.zombie.forEach(item => {
				item.zombie_type.forEach(type => {
					this.zombieDis[type-1].value++
				})
			})
		},
		cal_typeDis(){
			this.typeDis = [
				{name: "0-0.2",value: 0},
				{name: "0.2-0.4",value: 0},
				{name: "0.4-0.6",value: 0},
				{name: "0.6-0.8",value: 0},
				{name: "0.8-1",value: 0}
			]
			this.data.forEach(item => {
				for(let i=1;i<=5;i++)
					if(item.zombie_level < 0.2*i){
						this.typeDis[i-1].value++
						break
					}
			})
		},
		cal_enterpriseInfo(){
			const enterprise = this.zombie[this.currentIndex]
			if(!enterprise) return
			this.describeInfo = {
				id: enterprise.company_id,
				zombie_pro: (enterprise.zombie_pro*100).toFixed(2)+"%",
				grad_cam: enterprise.grad_cam,
				contribute_matrix: enterprise.contribute_matrix,
				feature_des: ''
			}
			// 僵尸类型
			this.describeInfo.type = enterprise.zombie_type.map(item => {
				switch(item){
					case 1: return "第Ⅰ类"
					case 2: return "第Ⅱ类"
					case 3: return "第Ⅲ类"
					case 4: return "第Ⅳ类"
					case 5: return "第Ⅴ类"
				}
			}).join(",")
			// 特征描述
			const features = enterprise.zombie_type_featrues
			if(features.debt_inc < 0 && features.profit_inc>0 && features.Ebit<0)
				this.describeInfo.feature_des += "<li>经营状态有好转趋势，负债率下降，亏损减少</li>"
			if(features.EBit > 0)
				this.describeInfo.feature_des += "<li>日常经营活动能产生利润</li>"
			else
				this.describeInfo.feature_des += "<li>日常经营活动亏损</li>"
			if(features.grant_profit > 0)
				this.describeInfo.feature_des += "<li>需要政府补贴来维持经营状态</li>"
			else
				this.describeInfo.feature_des += "<li>政府补贴也挽回不了亏损</li>"
			if(features.grant_defit < 0.3)
				this.describeInfo.feature_des += "<li>政府补贴弥补超过30%的亏损</li>"
			if(features.inner_cover < 1)
				this.describeInfo.feature_des += "<li>息税前利润不足以支付贷款利息</li>"
			if(features.debt_inc > 0)
				this.describeInfo.feature_des += "<li>经营状态持续恶化，资产负债率增加</li>"
			// console.log(enterprise)
			// console.log(this.describeInfo)
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
			this.charts.push(myChart)
		},
		draw_zombie_dis(){ // 僵尸类型分布
			const sum = this.zombieDis.reduce((sum,item) => {
				return sum+item.value
			},0)
			const pro = {}
			this.zombieDis.forEach(item => {
				if(item.value === 0)
					pro[item.name] = "0%"
				else
					pro[item.name] = (item.value/sum*100).toFixed(2) + "%"
			})
			let option = {
				title: {
					text: "僵尸类型分布",
					left: "0",
					subtext : "一个企业可能会被判别为多种僵尸类型"
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
					data: this.zombieDis
				}
			}
			let myChart = this.$echarts.init(document.getElementById("zombie-dis"))//初始化
			myChart.setOption(option)
			this.charts.push(myChart)
		},
		draw_type_dis(){ // 僵尸程度分布
			const sum = this.typeDis.reduce((sum,item) => {
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
					data: ["0-0.2","0.2-0.4","0.4-0.6","0.6-0.8","0.8-1"]
				},
				yAxis: {
					type: "value",
					name: "数量"
				},
				series: [
					{
						name: "僵尸程度分布",
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
						data: this.typeDis
					}
				]
			}
			let myChart = this.$echarts.init(document.getElementById("type-dis"))//初始化
			myChart.setOption(option)
			this.charts.push(myChart)
		},
		draw_type(data){ // 僵尸程度
			const val = Math.round((data*100).toFixed(2))
			let option = {
				title: {
					text: "僵尸程度",
					left: "center"
				},
				xAxis: {
					type: "category",
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
							animationDuration: 600,
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
			let myChart = this.$echarts.init(document.getElementById("type"))//初始化
			myChart.setOption(option)
			this.charts.push(myChart)
		},
		draw_featureData(feature){ // 僵尸企业特征
			const feature_key = this.features[this.currentFeature]
			let data_year=[],data = []
			feature.forEach(item => {
				data_year.push(item.year+"年")
				data.push(item[feature_key].toFixed(2))
			})
			let option = {
				title : {
					text : feature_key
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis : {
					name: "年份",
					type: 'category',
					boundaryGap: false,
					data : data_year
				},
				yAxis : {
					type : 'value'
				},
				series:[
					{
						name: feature_key,
						type : 'line',
						itemStyle: {
							color: "#1e9493"
						},
						areaStyle: {
							color: "rgba(30,148,147,0.5)"
						},
						animationDuration : 600,
						data : data
					}
				]
			}
			this.featureChart = this.$echarts.init(document.getElementById("feature-data"))//初始化
			this.featureChart.setOption(option)
		}
	},
	created() {
		this.currentRoute = this.$route.name
		this.data = [...this.result.data]
		this.cal_sum()
		this.cal_zombieDis()
		this.cal_typeDis()
	},
	mounted() {
		if(this.data.length === 1)
			this.currentNav = 1
		this.changeNav(this.currentNav)
		
		window.onresize = () => {
			setTimeout(() => {
				this.charts.forEach(chart => {
					this.chart.resize()
				})
			})
		}
	},
	components:{
		typeTable
	}
}
</script>

<style scoped>
.result{
	position: relative;
	height: 100%;
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
	grid-gap: 10px;
}
.result .charts .item.show{
	display: grid;
}
.result .charts .item .chart{
	width: 100%;
	overflow: hidden;
}

.result .charts .item.batch{
	grid-template-columns: repeat(2,1fr);
}
.result .charts .item.batch .chart{
	height: 400px;
}
.result .charts .item.batch .chart.col-2{
	grid-column-start: 1;
	grid-column-end: 3; 
}

.result .charts .item.single{
	grid-template-columns: repeat(3,1fr);
}
.result .charts .item.single .chart{
	min-height: 350px;
	height: 100%;
}
.result .charts .item.single .grad-cam{
	margin-top: 5px;
	width: 270px;
	display: grid;
	grid-template-columns: repeat(9,1fr);
	grid-gap: 5px;
	padding: 0;
}
.result .charts .item.single .grad-cam li{
	width: 25px;
	height: 25px;
	border-radius: 4px;
	position: relative;
	font-size: 1em;
	z-index: 11;
}
.result .charts .item.single .grad-cam li.contribute{
	background-color: #FFFFFF;
	transition: var(--hover-speed);
}
.result .charts .item.single .grad-cam li.contribute:hover{
	transform: scale(1.3);
	cursor: pointer;
}
.result .charts .item.single .grad-cam li .message{
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-80%,-120%);
	width: 150px;
	background-color: rgba(0,0,0,0.4);
	box-shadow: var(--box-shadow1);
	color: #FFFFFF;
	padding: 5px;
	border-radius: 5px;
	cursor: default;
	transition: 0.2s;
	display: none;
}
.result .charts .item.single .grad-cam li:hover .message{
	display: block;
}
.result .charts .item.single .feature{
	grid-column-start: 2;
	grid-column-end: 4;
	display: flex;
	align-items: center;
}
.result .charts .item.single .feature i{
	width: 30px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	border-radius: 50%;
	color: #FFFFFF;
	font-size: 1.4em;
	background-color: rgba(30,148,147,0.8);
	cursor: pointer;
}
.result .charts .item.single .feature .chart{
	flex: 1;
}
</style>
