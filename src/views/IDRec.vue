<template>
	<div class="id-search">
		<section>
			<p>根据企业的ID查询企业的状态,若数据库中不包含该企业,需要通过
			<router-link to="/infoRec">僵尸识别</router-link >
			后查看结果,ID查询提供模糊搜索选项,可搜索到包含输入ID的企业。
			</p>
		</section>
		<div class="container">
			11
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			
		}
	},
	methods:{
		
	}
}
</script>

<style scoped>
.id-search section a{
	color: var(--green2);
	text-decoration: underline;
}
.id-search .container{
	
}
</style>
