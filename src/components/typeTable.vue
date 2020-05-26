<template>
	<div class="degree">
		<span class="title">僵尸类型表</span>
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
					describe:"资产负债率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被\"特殊处理\""
				},
				{
					type:"第Ⅱ类",
					suckBlood:"政府补贴",
					standard:"grant_prpofit<-0.5\nEBIT<0\nLev>50%",
					describe:"资产负债率超过50%，日常经营活动亏损，政府补贴也挽回不了亏损。"
				},
				{
					type:"第Ⅲ类",
					suckBlood:"常青贷款",
					standard:"grant_prpofit<1\ndebt_int>0\nEBIT<0\nLev>50%",
					describe:"资产负债率超过50%，日常经营活动能产生利润，但息税前利润不足以支付贷款利息，经营状态持续恶化，资产负债率增加。"
				},
				{
					type:"第Ⅳ类",
					suckBlood:"常青贷款",
					standard:"inter_cover<1\ndbet_inc>0\nEBIT<0\nLev>50%",
					describe:"资产负债率超过50%，日常经营活动亏损，而且息税前利润不足以支付利息，经营状态持续恶化，资产负债率增加。"
				},
				{
					type:"第Ⅴ类",
					suckBlood:"政府补贴",
					standard:"dbet_inc>0.3\nprofit_inc<-0.5\ngrant_deficit>-0.5\nEBIT<0",
					describe:"日常经营活动亏损，经营状态持续恶化，资产负债率增加，需要政府补贴来弥补一定的亏损经营状态。"
				}
			]
		}
	},
}
</script>

<style scoped>
.degree{
	white-space: pre-wrap;
	display: inline-block;
	z-index: 20;
}
.degree:hover .card{
	display: block;
}
.degree .title{
	border: var(--border1);
	padding: 5px;
	border-radius: 5px;
	cursor: pointer;
}
.degree:hover .title{
	color: #FFFFFF;
	background-color: var(--origin);
	border-color: transparent;
}
.degree .card{
	position: absolute;
	transform: translate(-100%,-50%);
	max-width: 650px;
	display: none;
	box-shadow: var(--box-shadow1);
}
</style>
