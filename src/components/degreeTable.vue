<template>
	<div class="degree">
		<table>
			<tr>
				<th>类型</th>
				<th>吸血表现</th>
				<th>判别标准</th>
				<th>僵尸特征描述</th>
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
</template>

<script>
export default{
	data(){
		return{
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
		
	}
}
</script>

<style scoped>
.degree{
	width: 100%;
	white-space: pre-wrap;
}
</style>
