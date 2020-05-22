<template>
	<div class="id-search">
		<header>
			<div class="card left">
				<p>
					根据企业的唯一ID查询企业的画像，如果是第一次查询请移步
					<router-link to="/infoRec">僵尸识别</router-link> ,
					企业首次识别后的结果将存储在数据库中。
				</p>
				<div class="input">
					<input
						class="new-input"
						type="text" 
						placeholder="输入企业ID"
						v-model="id" 
						@focusout="add_newID">
					<button @click="search">查询</button>
				</div>
				<div class="id-list">
					<div 
						class="item"
						:class="item.class"
						v-for="(item,index) in idList"
						:key="index"
						@click="removeID(index)">
						{{item.id}}
						<i class="iconfont icon-lajitong"></i>
					</div>
				</div>
			</div>
			<div class="card type-table">
				<table class="card">
					<tr>
						<th>类型</th>
						<th>吸血表现</th>
						<th>判别标准</th>
						<th colspan="2">僵尸特征描述</th>
					</tr>
					<tr
						v-for="(item,index) in degree"
						:key="index"
					>
						<td>{{item.type}}</td>
						<td>{{item.suckBlood}}</td>
						<td>{{item.standard}}</td>
						<td>{{item.describe}}</td>
					</tr>
				</table>
			</div>
		</header>
		<result v-if="resultData" :result="resultData"></result>
	</div>
</template>

<script>
import {Query} from "../assets/axios/api.js"
import result from "../components/Result.vue"
import testData from "../assets/singleData.json"
export default{
	data(){
		return{
			id: "",
			idList: [],
			resultData: null,
			degree: [
				{
					type:"第Ⅰ类",
					suckBlood:"政府补贴",
					standard:"grant_prpofit>1\nEBIT>0\nLev>50%",
					describe:"资产负载率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				},
				{
					type:"第Ⅱ类",
					suckBlood:"政府补贴",
					standard:"grant_prpofit<-0.5\nEBIT<0\nLev>50%",
					describe:"资产负载率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				},
				{
					type:"第Ⅲ类",
					suckBlood:"常青贷款",
					standard:"grant_prpofit<1\ndebt_int>0\nEBIT<0\nLev>50%",
					describe:"资产负载率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				},
				{
					type:"第Ⅳ类",
					suckBlood:"常青贷款",
					standard:"inter_cover<1\ndbet_inc>0\nEBIT<0\nLev>50%",
					describe:"资产负载率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				},
				{
					type:"第Ⅴ类",
					suckBlood:"政府补贴",
					standard:"dbet_inc>0.3\nprofit_inc<-0.5\ngrant_deficit>-0.5\nEBIT<0",
					describe:"资产负载率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				}
			]
		}
	},
	methods:{
		add_newID(){
			if(this.id === "")  return
			if(this.idList.indexOf(this.id) > -1)
				this.$showToast({
					type: "warn",
					text: "该ID已存在"
				})
			else
				this.idList.push({
					class: '',
					id: this.id
				})
			this.id = ""
		},
		removeID(index){
			this.idList.splice(index,1)
		},
		search(){
			if(this.idList.length === 0) return
			let startTime = new Date()
			this.cutData(testData,startTime)
			// Query(this.idList[0].id)
			// .then(res => {
			// 	if(res.data.error_msg != ""){
			// 		this.$showToast({
			// 			type: "warn",
			// 			text: "ID不在数据库中"
			// 		})
			// 		this.idList[0].class = "error"
			// 	}
			// 	else
			// 		cutData(res.data)
			// })
		},
		cutData(data,startTime){
			this.resultData = null
			setTimeout(() => {
				let result = {
					time: (new Date-startTime).toFixed(1),
					data: [],
				}
				for(let i in data.predict){
					let predict = data.predict[i]
					let zombie_type = data.zombie_type[i] //僵尸类型
					let zombie_type_featrues = data.zombie_type_featrues[i] //僵尸特征
					delete zombie_type_featrues.ID
					delete zombie_type.ID
					
					let grad_cam = data.grad_cam[i] //81个特征
					delete grad_cam.ID
					let	zombie_level = data.zombie_level[i] //僵尸程度
					let contribute_matrix = data.contribute_matrix[i] //贡献度
					delete contribute_matrix.ID
					
					const item = {
						// id: predict.company_id,
						id: this.idList[0].id, // 测试数据
						final_pre: predict.final_pre,
						zombie_pro: predict.zombie_pro,
						featured_data: [],
						zombie_type: [],
						zombie_level: zombie_level.僵尸性程度,
						grad_cam: [],
						contribute_matrix: [],
						zombie_type_featrues: zombie_type_featrues
					}
					// 获取特征
					for(let index in data.featured_data){
						if(item.featured_data.length >= 3) break
						const featured = {...data.featured_data[index]}
						featured.company_id = this.idList[0].id //测试数据
						if(featured.company_id === item.id){
							delete featured.company_id
							delete featured.企业类型
							delete featured.区域
							delete featured.控制人类型
							delete featured.行业
							item.featured_data.push(featured)
						}
					}
					// 获取僵尸类型
					for(let index in zombie_type){
						if(zombie_type[index] != 0)
							switch(index){
								case "I": item.zombie_type.push(1);break;
								case "II": item.zombie_type.push(2);break;
								case "III": item.zombie_type.push(3);break;
								case "IV": item.zombie_type.push(4);break;
								case "V": item.zombie_type.push(5);break;
							}
					}
					// 提取81个特征值贡献度-cnn
					for(let key in grad_cam){
						item.grad_cam.push({
							text: this.$store.state.grad_cam_text[key],
							value: Number(grad_cam[key].toFixed(2))
						})
					}
					// 提取81个特征值贡献度stacking
					for(let key in contribute_matrix){
						item.contribute_matrix.push({
							text: key,
							value: Number(contribute_matrix[key].toFixed(2))
						})
					}
					result.data.push(item)
				}
				this.resultData = result
			})
		}
	},
	components:{
		result
	}
}
</script>

<style scoped>
.id-search header{
	display: grid;
	grid-template-columns: 2fr 3fr;
	grid-gap: 10px;
}
.id-search header .left{
	display: flex;
	flex-direction: column;
}
.id-search header .left a{
	color: var(--origin);
	text-decoration: underline;
}
.id-search header .left .input{
	margin: 5px 0;
}
.id-search header .left .input button{
	margin-left: 10px;
	width: 100px;
}
.id-search header .left .id-list{
	min-height: 42px;
	border: var(--border1);
	border-radius: 5px;
	display: flex;
	flex-wrap: wrap;
}
.id-search header .left .id-list .item{
	margin: 5px;
	height: 30px;
	line-height: 30px;
	border: var(--border1);
	padding: 0 5px;
	border-radius: 15px;
	cursor: pointer;
	transition: var(--hover-speed);
	position: relative;
}
.id-search header .left .id-list .item.error{
	background-color: #F56C6C;
	color: #FFFFFF;
}
.id-search header .left .id-list .item i{
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	color: #FFFFFF;
	display: none;
}
.id-search header .left .id-list .item:hover{
	background-color: #e86452;
	color: #e86452;
}
.id-search header .left .id-list .item:hover i{
	display: block;
}
</style>
