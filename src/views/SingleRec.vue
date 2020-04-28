<template>
	<div class="single">
		<section>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit nobis doloremque sequi fuga labore adipisci iure ipsa eveniet? Doloribus iure sint vitae dolore odit nesciunt sequi quo dolores maxime voluptate! Ea quaerat praesentium repellat voluptatem eligendi. Corporis iste vel incidunt fugiat possimus ullam accusamus hic voluptates voluptatibus quod veritatis dolores in numquam ut mollitia vero repudiandae commodi dolorem consectetur deserunt.</p>
		</section>
		<form @submit="submit">
			<p class="remark">金额单位: 万元人民币</p>
			<!-- 年份选择 -->
			<div class="years">
				<p title="复制第一年数据" class="copy" @click="copy">填充</p>
				<div 
					class="year"
					:class="currentYear === item ? 'active' : ''"
					v-for="(item,index) in years"
					:key="item"
					@click="currentYear=item"
				>
					第{{index+1}}年
				</div>
			</div>
			<!-- 主体输入 -->
			<div class="content selects">
				<div 
					class="item"
					v-for="(item,index) in selects"
					:key="index"
				>
					<p>{{item.text}}</p>
					<Select 
						:list="item.list"
						:placeholder="item.text"
						v-model="Data[currentYear][item.model]"
						@update="update()">
					</Select>
				</div>
			</div>
			<div class="content">
				<div 
					class="item"
					v-for="(item,index) in inputs"
					:key="index"
				>
					<p>{{item.text}}</p>
					<div class="input">
						<input
							type="number" 
							:placeholder="item.text"
							min=0
							:step="item.step"
							v-model="Data[currentYear][item.model]"
							@input="update()"
						>
						<i 
							v-show="Data[currentYear][item.model] != ''"
							class="iconfont icon-error"
							@click="Data[currentYear][item.model]='';update()"
						></i>
					</div>
				</div>
			</div>
			<!-- 功能键 -->
			<div class="btns">
				<checkBox class="checkBox" :models="models"></checkBox>
				<check class="check" v-model="is_impute"></check>
				<button type="submit">提交</button>
			</div>
		</form>
		
		<result></result>
	</div>
</template>

<script>
import checkBox from "../components/CheckBox.vue"
import check from "../components/Check.vue"
import Select from "../components/Select.vue"
import result from "../components/Result.vue"
export default{
	data(){
		return{
			is_impute: true,
			currentYear: "first",
			years: ["first","second","third"],
			selects: this.$store.state.selects,
			inputs: this.$store.state.inputs,
			models: [
				{name: "CNN模型",active: true,param: "use_model_CNN"},
				{name: "stacking模型",active: false,param: "use_model_stacking"},
				{name: "deeptree模型",active: false,param: "use_model_deeptree"}
			],
			Data: {}
		}
	},
	methods:{
		initData(){
			this.Data.first = {...this.$store.state.param}
			this.Data.second = {...this.$store.state.param}
			this.Data.third = {...this.$store.state.param}
		},
		update(currentYear){ //解决层级嵌套不更新问题
			const temp = this.currentYear
			this.currentYear = ""
			this.currentYear = temp
		},
		copy(){ //拷贝第一年信息
			this.$showModel({
				text: "确定使用第一年的数据填充当前年份空白数据？",
				cancelText: "取消",
				success: () => {
					for(let key in this.Data.first)
						if(this.Data[this.currentYear][key] === "")
							this.Data[this.currentYear][key] = this.Data.first[key]
					this.update()
				}
			})
		},
		submit(e){
			e.preventDefault()
			// 判断使用了什么模型
			const modelType = {}
			this.models.forEach(item => {
				modelType[item.param] = item.active 
			})
			// 将data里字符串数字转化成数字类型
			const newData = {...this.Data}
			for(let year in this.Data)
				for(let key in this.Data[year])
					if(newData[year][key] != "")
						newData[year][key] = +newData[year][key]
						
			// 构建参数
			const data = {
				...modelType,
				is_impute: this.is_impute,
				data: newData
			}
			console.log(data)
		}
	},
	created() {
		this.initData()
	},
	components:{
		checkBox,
		check,
		Select,
		result
	}
}
</script>

<style scoped>
.single section{
	margin: 15px 0;
}
.single form{
	background-color: var(--green1);
	box-shadow: var(--box-shadow1);
	color: #FFFFFF;
	padding: 10px;
	border-radius: 10px;
	position: relative;
	user-select: none;
}
.single form .remark{
	font-size: 0.9em;
	color: #f0f0f0;
}

.single form .years{
	position: absolute;
	top: 10px;
	right:20px;
	display: flex;
	align-items: center;
}
.single form .years .copy{
	margin-right: 5px;
	cursor: pointer;
}
.single form .years .year{
	margin: 0 5px;
	padding: 0 10px;
	border-radius: 5px;
	font-size: 1.2em;
	font-weight: 500;
	cursor: pointer;
}
.single form .years .year.active{
	background-color: var(--origin);
}

.single form .content{
	margin-top: 15px;
	display: grid;
	grid-template-columns: repeat(3,1fr);
	grid-gap: 10px;
}
.single form .content.selects{
	grid-template-columns: repeat(2,1fr);
}
.single form .content .item p{
	color: #F9F9F9;
	font-weight: 600;
	letter-spacing: 1px;
	font-size: 1.1em;
	user-select: none;
}
.single form .content .item .input{
	margin-top: 2px;
	position: relative;
	height: 35px;
	line-height: 35px;
}
.single form .content .item .input input{
	width: 100%;
	height: 100%;
}
.single form .content .item .input input:focus{
	border-color: var(--blue1);
	box-shadow: 0 0 10px #3775f1;
}
.single form .content .item .input i{
	position: absolute;
	margin: 0;
	right: 10px;
	color: rgba(30,148,147,0.7);
	cursor: pointer;
	visibility: hidden;
}
.single form .content .item .input:hover input + i,
.single form .content .item .input input:focus + i
{
	visibility: visible;
}

.single .btns{
	margin-top: 15px;
	width: 100%;
	position: relative;
	display: flex;
	flex-wrap: wrap;
}
.single form .btns .checkBox{
	flex: 1;
}
.single form .btns .check{
	margin: 0 20px;
}
.single form .btns button{
	width: 30%;
	max-width: 250px;
	background-color: var(--blue2);
	transition: 0.1s;
}
.single form .btns button:hover{
	background-color: #3775f1;
}
.single form .btns button:active{
	transform: scale(1.1);
}

@media (max-width:1100px) {
	.single form .content{
		grid-template-columns: repeat(2,1fr);
	}
	.single form .btns{
		justify-content: center;
	}
	.single form .btns .checkBox{
		margin-bottom: 10px;
		flex: auto;
		flex-shrink: 0;
		width: 100%;
	}
	.single form .btns .check,
	.single form .btns button{
		margin: 0;
		flex-shrink: 0;
		width: 50%;
		display: flex;
		justify-content: center;
	}
}

@media (max-width:600px){
	.single form .content{
		grid-template-columns: 1fr;
	}
	.single form .years{
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
