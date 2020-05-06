<template>
	<div class="single">
		<section>
			<p>单个企业识别需要提供企业三年的数据信息,可以通过手动填写,也可以通过csv文件导入。导入数据将自动填写至输入框,可根据需要进行修改或填补。</p>
			<a href="http://load.jinlongyuchitang.cn/temp.csv?attname=" target="_blank">
				csv文件模板
			</a> 导入数据注意事项:
			<ul>
				<li>首行标题文本请勿删除</li>
				<li>最多填写3年数据(即包括标题最多4行)</li>
				<li>可缺列,缺失部分默认留空</li>
				<li>保存为csv UTF-8(逗号分隔)格式</li>
			</ul>
		</section>
		
		<div class="container">
			<div class="slide">
				<h3>企业信息</h3>
				<label class="check-file btn">
					<input type="file" @change="checkFile" multiple>
					导入数据
				</label>
				
				<div 
					class="btn" 
					:class="isOperate ? 'active' : ''"
					@click="isOperate=!isOperate"
				>
					{{isOperate ? "隐藏输入" : "手动填写"}}
				</div>
				
				<div class="list">
					<i 
						class="iconfont icon-last"
						@click="changeIndex(-1)"
					></i>
					<div class="main">
						
						<p>{{currentIndex+1}} / {{Data.length}}</p>
					</div>
					<i 
						class="iconfont icon-next"
						@click="changeIndex(1)"
					></i>
				</div>
			</div>
			
			<form :style="isOperate ? 'max-height: 5000px' : 'max-height: 0'">
				<p class="remark">金额单位: 万元人民币</p>
				<!-- 年份选择 -->
				<div class="years">
					<p title="复制第一年数据" class="copy" @click="copy">填充</p>
					<div 
						class="year"
						:class="currentYear === index ? 'active' : ''"
						v-for="(item,index) in 3"
						:key="index"
						@click="currentYear=index"
					>
						{{Data[currentIndex][index].year === "" ? '第'+(index+1)+'年' : Data[currentIndex][index].year+"年"}}
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
							v-model="Data[currentIndex][currentYear][item.model]"
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
								v-model="Data[currentIndex][currentYear][item.model]"
								@input="update()"
							>
							<i 
								v-show="Data[currentIndex][currentYear][item.model] != ''"
								class="iconfont icon-error"
								@click="Data[currentIndex][currentYear][item.model]='';update()"
							></i>
						</div>
					</div>
				</div>
			</form>
			
			<!-- 功能键 -->
			<div class="btns">
				<checkBox class="checkBox" :models="models"></checkBox>
				<check class="check" v-model="is_impute"></check>
				<button @click="submit">提交</button>
			</div>
		</div>
		
		<!-- <result></result> -->
	</div>
</template>

<script>
import checkBox from "../components/CheckBox.vue"
import check from "../components/Check.vue"
import Select from "../components/Select.vue"
import result from "../components/Result.vue"
import XLSX from "xlsx"
export default{
	data(){
		return{
			currentIndex: 0,
			datas: [],
			currentYear: 0,
			isOperate: false,
			is_impute: true,
			selects: [],
			inputs: [],
			models: [
				{name: "CNN模型",active: true,param: "use_model_CNN"},
				{name: "stacking模型",active: false,param: "use_model_stacking"},
				{name: "deeptree模型",active: false,param: "use_model_deeptree"}
			],
			Data: []
		}
	},
	methods:{
		changeIndex(index){
			const tempIndex = this.currentIndex + index
			if(tempIndex === this.Data.length)
				this.currentIndex = 0
			else if(tempIndex === 0)
				this.currentIndex = this.Data.length - 1
			else
				this.currentIndex = tempIndex
		},
		addDataLen(ID=""){
			this.Data[this.Data.length] = [
				{...this.$store.state.param,ID},
				{...this.$store.state.param,ID},
				{...this.$store.state.param,ID}
			]
			// console.log(this.Data)
		},
		update(){ //解决层级嵌套不更新问题
			const temp = this.currentYear
			this.currentYear = ""
			this.currentYear = temp
		},
		checkFile(e){ //选择文件
			const files = Array.from(e.target.files) 
			files.forEach(file => {
				let reader = new FileReader()
				reader.readAsText(file);
				reader.onload = (e) => {
					let result = e.target.result.split("\n")
					result.splice(result.length-1,1)
					// 将字符串转数字
					result.forEach((item,i) => {
						item = item.trim()
						item = item.split(",")
						item.forEach((data,index) => {
							if(data != "" && !isNaN(+data))
								item[index] = +data
						})
						result[i] = item
					})
					
					const title = result[0]
					result.splice(0,1)
					
					result.forEach(item => {
						const id = item[0]
						// 找到已存在的企业，若不存在则追加
						let enterprise = this.Data.find(item => {
							return item[0].ID === id
						})
						if(!enterprise){
							this.addDataLen(id)
							enterprise = this.Data[this.Data.length-1]
						}
						// 查找key值对应的变量
						const tempArr = [].concat(this.selects,this.inputs)
						// 判断是否是分不同年份
						let year = ""
						if(title.indexOf("year") > -1){
							year = item[1]
							enterprise.find((en,i) => {
								if(en.year === ""){
									en.year = year
									return true
								}
							})
						}
						item.forEach((val,index) => {
							let keyText = title[index]
							
							if(keyText === "year") return false
							
							let key = tempArr.find(param => keyText === param.text)
							if(key){
								if(key.hasOwnProperty("list")){
									const selectRes = key.list.find(content => {
										if(content.label === val){
											val = content.value
											return true
										}
									})
								}
								// 含年份信息
								if(year != "")
									enterprise.find((en,i) => {
										if(en.year === year){
											enterprise[i][key.model] = val
											return true
										}
									})
								// 不含年份信息
								else
									enterprise.forEach(en => {
										en[key.model] = val
									})
							}
						})
					})
					this.update()
					console.log(this.Data)
				}
			})
		},
		copy(){ //拷贝第一年信息
			this.$showModel({
				text: "确定使用第一年的数据填充当前年份空白数据？",
				cancelText: "取消",
				success: () => {
					for(let key in this.Data[this.currentIndex][0])
						if(this.Data[this.currentIndex][this.currentYear][key] === "")
							this.Data[this.currentIndex][this.currentYear][key] = this.Data[this.currentIndex][0][key]
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
		this.selects = [...this.$store.state.selects]
		this.inputs = [...this.$store.state.inputs]
		this.addDataLen()
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
.single section a{
	color: var(--green2);
	text-decoration: underline;
}
.single section ul{
	list-style: Disc;
	padding-left: 20px;
}

.single .container{
	width: 100%;
	background-color: var(--green1);
	box-shadow: var(--box-shadow1);
	color: #FFFFFF;
	border-radius: 10px;
	position: relative;
	user-select: none;
}

.single .container .slide{
	padding: 10px;
	display: flex;
	align-items: center;
}
.single .container .slide .btn{
	margin-left: 15px;
	background-color: #FFFFFF;
	color: var(--dark-common);
	padding: 5px 10px;
	border-radius: 4px;
	cursor: pointer;
}
.single .container .slide .btn.active,
.single .container .slide .btn:hover
{
	color: #FFFFFF;
	background-color: var(--origin);
}
.single .container .slide .btn:active{
	transform: scale(0.95);
}
.single .container .slide .list{
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: flex-start;
}
.single .container .slide .list i{
	margin: 0 5px;
	font-size: 1.2em;
	font-weight: 600;
	cursor: pointer;
}

.single form{
	position: relative;
	padding: 0 10px;
	overflow: hidden;
	transition: height var(--hover-speed);
}
.single form .remark{
	font-size: 0.9em;
	color: #f0f0f0;
}

.single form .years{
	position: absolute;
	top: 0;
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

.single .container .btns{
	padding: 15px 10px 10px 10px;
	width: 100%;
	position: relative;
	display: flex;
	flex-wrap: wrap;
}
.single .container .btns .checkBox{
	flex: 1;
}
.single .container .btns .check{
	margin: 0 20px;
}
.single .container .btns button{
	width: 30%;
	max-width: 250px;
	background-color: var(--blue2);
	transition: 0.1s;
}
.single .container .btns button:hover{
	background-color: #3775f1;
}
.single .container .btns button:active{
	transform: scale(1.1);
}

@media (max-width:1100px) {
	.single .container .content{
		grid-template-columns: repeat(2,1fr);
	}
	.single .container .btns{
		justify-content: center;
	}
	.single .container .btns .checkBox{
		margin-bottom: 10px;
		flex: auto;
		flex-shrink: 0;
		width: 100%;
	}
	.single .container .btns .check,
	.single .container .btns button{
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
