<template>
	<div class="single">
		<section>
			<p>僵尸企业识别需要提供企业三年的数据信息,可以通过手动填写,也可以通过csv文件导入。导入数据将自动填写至输入框,可根据需要进行修改或填补。</p>
			<a href="http://load.jinlongyuchitang.cn/temp.csv?attname=" target="_blank">
				csv文件模板
			</a> 导入数据注意事项:
			<ul>
				<li>首行标题文本请勿删除</li>
				<li>可根据需求划分为多个文件,但必须保证第一列为企业的唯一ID</li>
				<li>保存为csv UTF-8(逗号分隔)格式</li>
			</ul>
		</section>
		
		<div class="container">
			<div class="slide">
				<h3>企业信息</h3>
				<label class="check-file btn">
					<input type="file" @change="checkFile" multiple>
					csv导入
				</label>
				
				<div 
					class="btn"
					@click="addEn">
					增加企业
				</div>
				
				<div
					v-if="resultID.length > 0"
					class="btn"
					@click="removeEn">
					删除当前企业
				</div>
				
				<div
					v-if="resultID.length > 0"
					class="btn" 
					:class="isOperate ? 'active' : ''"
					@click="isOperate=!isOperate">
					{{isOperate ? "隐藏输入" : "手动填写"}}
				</div>
				
				<div class="id" v-if="Data[currentIndex]">
					<span>ID:</span>
					<input 
						v-if="!search"
						type="number"
						placeholder="当前企业编号ID"
						min=0
						step="1"
						@input="inputID"
						:value="Data[currentIndex][0].ID"
					>
					<input
						v-if="search"
						type="number"
						placeholder="ID查询企业"
						min=0
						step="1"
						v-model="searchText"
					/>
					<i 
						class="iconfont search"
						:class="search ? 'icon-error' : 'icon-search'"
						@click="search=!search">
					</i>
					<div v-if="search" class="search-list">
						<div 
							class="item"
							v-for="id in searchID"
							:key="id"
							@click="searchRes(id)"
						>
							{{id}}
						</div>
					</div>
				</div>
				
				<div class="page" v-show="resultID.length > 0">
					<i 
						class="iconfont icon-last"
						@click="changeIndex(-1)"
					></i>
					<p>
						<input 
							class="current-index"
							type="number"
							step="1"
							:value="currentIndex+1"
							@input="inputIndex"
							@focusout="outInputIndex"
						>
						/ {{resultID.length}}
					</p>
					<i 
						class="iconfont icon-next"
						@click="changeIndex(1)"
					></i>
				</div>
			</div>
			
			<form 
				v-if="Data.length>0"
				:style="isOperate ? 'max-height: 5000px' : 'max-height: 0'">
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
						 v-if="index!=0"
						class="item"
						v-for="(item,index) in inputs"
						:key="index"
					>
						<p>{{item.text === "year" ? "第几年企业信息" : item.text}}</p>
						<div class="input">
							<input
								type="number" 
								:placeholder="item.text === 'year' ? '第几年企业信息' : item.text"
								min=0
								:step="item.step"
								v-model.number="Data[currentIndex][currentYear][item.model]"
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
		
		<result></result>
	</div>
</template>

<script>
import checkBox from "../components/CheckBox.vue"
import check from "../components/Check.vue"
import Select from "../components/Select.vue"
import result from "../components/Result.vue"
import {Predict} from "../assets/axios/api.js"
export default{
	data(){
		return{
			currentIndex: 0,
			search: false,
			searchText: "",
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
			Data: [],
			resultID: [],
			fileData: []
		}
	},
	methods:{
		update(){ //解决层级嵌套不更新问题
			const temp = this.currentYear
			this.currentYear = ""
			this.currentYear = temp
			this.inputIndex()
		},
		inputID(e){
			const val = e.target.value
			this.Data[this.currentIndex].forEach(item => {
				item.ID = +val
			})
			this.update()
		},
		searchRes(id){
			if(id != "无数据")
				this.getCurrentData(this.resultID.indexOf(id))
			this.search = false
			this.searchText=''
		},
		changeIndex(index){
			if(this.resultID.length === 0) return
			let tempIndex = this.currentIndex + index
			if(tempIndex === this.resultID.length)
				tempIndex = 0
			else if(tempIndex === -1)
				tempIndex = this.resultID.length - 1
			this.getCurrentData(tempIndex)
		},
		inputIndex(e){
			setTimeout(() => {
				const dom = document.querySelector(".current-index")
				let len = dom.value.length
				dom.style.width = `${10*len}px`
			})
		},
		outInputIndex(e){
			const val = +e.target.value
			if(val > 0 && val <= this.resultID.length)
				this.getCurrentData(val - 1)
			else{
				this.$showToast({
					type: "warn",
					text: "超出范围"
				})
				this.getCurrentData(this.currentIndex)
			}
		},
		addEn(){
			let ID = (+new Date()).toString().substr(8)
			while(this.resultID.indexOf(ID) > 1){
				ID = (+new Date()).toString().substr(8)
			}
			let index = this.resultID.push(+ID)
			this.getCurrentData(index - 1)
		},
		removeEn(){
			this.resultID.splice(this.currentIndex,1)
			this.Data.splice(this.currentIndex,1)
			this.changeIndex(-1)
		},
		checkFile(e){ //选择文件
			let load = this.$loading()
			this.Data.forEach(item => {
				item[0].loaded = false
			})
			let worker = new Worker('./computedID.js')
			worker.postMessage({
				files: Array.from(e.target.files),
				resultID: this.resultID
			})
			worker.onmessage = (e) => {
				worker.terminate()
				this.fileData = this.fileData.concat(e.data.fileData)
				this.resultID = e.data.resultID
				load.hide()
				this.getCurrentData(this.currentIndex)
			}
		},
		getCurrentData(index){ //获取当前企业的信息
			let enterprise
			// 如果当前下标的<已加载的数据长度，则直接显示
			if(this.Data[index] && index < this.Data.length){
				if(this.Data[index][0].loaded === true){
					this.currentIndex = index
					this.update()
					return
				}
				else{
					enterprise = this.Data[index]
					enterprise[0].loaded = true
				}
			}
			else{
				let param = this.$store.state.param
				let ID = this.resultID[index]
				enterprise = [
					{...param,ID,loaded:true},
					{...param,ID},
					{...param,ID}
				]
			}	
			
			let load = this.$loading()
			let worker = new Worker('./getEnterpriseData.js')
			worker.postMessage({
				enterprise,
				tempArr: [].concat(this.selects,this.inputs),
				fileData: this.fileData,
			})
			worker.onmessage = (e) => {
				worker.terminate()
				setTimeout(() => {
					load.hide()
				},200)
				this.Data[index] = e.data.enterprise
				this.currentIndex = index
				this.currentYear = 0
				this.isOperate = false
				this.isOperate = true
				this.update()
			}
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
			let startTime = +(new Date())
			let load = this.$loading()
			// 判断使用了什么模型
			const modelType = {}
			this.models.forEach(item => {
				modelType[item.param] = item.active 
			})
			let resSrt = ""
			let worker = new Worker("./cutCsv.js")
			worker.postMessage({
				resultID: this.resultID,
				Data: this.Data,
				fileData: this.fileData,
				tempArr: [].concat(this.selects,this.inputs),
				param : this.$store.state.param
			})
			worker.onmessage = (e) => {
				const data = {
					is_impute: this.is_impute,
					...modelType,
					merged: e.data
				}
				load.hide()
				console.log("字符串转化时间: " + (new Date() - startTime) / 1000 + "s")
				startTime = +(new Date())
				Predict(JSON.stringify(data))
				.then(res => {
					console.log("请求运行时间: " + (new Date() - startTime) / 1000 + "s")
					let a = document.createElement("a")
					a.download = "data.json"
					let blob = new Blob([JSON.stringify(res.data,"","\t")])
					a.href = URL.createObjectURL(blob)
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
				})
			}
		}
	},
	computed:{
		searchID(){
			let list = this.resultID.filter(item => {
				const reg = new RegExp(`${this.searchText}`,'i')
				return reg.test(item)
			})
			if(this.searchText === "")
				list = [...this.resultID]
			if(list.length === 0)
				list.push("无数据")
			return list
		}
	},
	created() {
		this.selects = [...this.$store.state.selects]
		this.inputs = [...this.$store.state.inputs]
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
	flex-wrap: wrap;
	align-items: center;
	position: relative;
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
.single .container .slide .id{
	margin-left: 15px;
	display: flex;
	align-items: center;
	position: relative;
}
.single .container .slide .id span{
	position: absolute;
	left: 5px;
	color: var(--dark-common);
}
.single .container .slide .id input{
	width: 170px;
	height: 35px;
	padding-left: 30px;
}
.single .container .slide .id .search{
	position: absolute;
	right: 5px;
	color: var(--dark-common);
	cursor: pointer;
}
.single .container .slide .id .search-list{
	z-index: 10;
	position: absolute;
	top: 35px;
	width: 100%;
	max-height: 165px;
	background-color: #FFFFFF;
	box-shadow: var(--box-shadow2);
	border-radius: 5px;
	color: var(--dark-common);
	text-align: center;
	overflow-y: scroll;
}
.single .container .slide .id .search-list .item{
	padding: 5px 0;
	cursor: pointer;
}
.single .container .slide .id .search-list .item:hover{
	background-color: var(--green1);
	color: #FFFFFF;
}

.single .container .slide .page{
	position: absolute;
	top: 10px;
	right: 15px;
	display: flex;
	align-items: center;
}
.single .container .slide .page i{
	margin: 0 5px;
	font-size: 1.2em;
	font-weight: 600;
	cursor: pointer;
}
.single .container .slide .page .current-index{
	width: 14px;
	color: #FFFFFF;
	padding: 0;
	background-color: transparent;
	border: 0;
	text-align: right;
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
.single form .content .item .input,
.single .container .slide .list .main{
	margin-top: 2px;
	position: relative;
	height: 35px;
	line-height: 35px;
}
.single form .content .item .input input{
	width: 100%;
	height: 100%;
}
.single form .content .item .input input:focus,
.single .container .slide .list .main input:focus{
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

@media (max-width:1230px) {
	.single .container .slide h3{
		width: 100%;
		text-align: center;
	}
	.single .container .slide{
		justify-content: center;
	}
	.single .container .slide .btn{
		margin-top: 5px;
	}
	.single .container .slide .id{
		margin-top: 5px;
	}
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
@media (max-width:900px) {
	.single .container .slide .btn{
		margin-left: 5px;
	}
	.single .container .slide .id{
		margin-left: 5px;
	}
}
@media (max-width:600px){
	.single .container .slide .btn{
		margin-left: 5px;
	}
	.single form .years{
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}
	.single form .content{
		grid-template-columns: 1fr;
	}
}
</style>
