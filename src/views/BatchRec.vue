<template>
	<div class="batch">
		<section>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non quia veniam quas eos assumenda amet adipisci eum ipsam quos aperiam molestiae nisi sint suscipit dolore hic pariatur nam consequatur facere nemo exercitationem nulla. Aspernatur fugiat at repellat. Illo necessitatibus repellendus aut odit ea beatae vitae quisquam tempore magnam excepturi deserunt.</p>
		</section>
		<form @submit="submit">
			<checkBox class="checkBox" :models="models"></checkBox>
			
			<div class="btns">
				<label class="check-file">
					<input type="file" multiple @change="checkFile">
					选择文件
				</label>
				<check class="check" v-model="is_impute"></check>
				<button type="submit" class="submit">提交</button>
			</div>
			
			<div class="files" v-if="files.length > 0">
				<div 
					class="file"
					v-for="(item,index) in files"
					:key="index"
				>
					<span>{{item.name}}</span>
					<i v-if="item.file!=''" class="iconfont icon-lajitong remove" @click="removeFile(index)"></i>
					<i class="iconfont icon-dui" :class="item.file!='' ? 'success' : 'no-file'"></i>
				</div>
			</div>
		</form>
		
		<charts v-if="showResult" :enterprise="enterprise"></charts>
	</div>
</template>

<script>
import checkBox from "../components/CheckBox.vue"
import check from "../components/Check.vue"
import charts from "../components/charts.vue"
import {getFile} from "../assets/axios/api.js"
export default{
	data(){
		return{
			models: [
				{name: "CNN模型",active: true,param: "use_model_CNN"},
				{name: "stacking模型",active: false,param: "use_model_stacking"},
				{name: "deeptree模型",active: false,param: "use_model_deeptree"}
			],
			files: [
				{name: "base.csv",file: ""},
				{name: "money.csv",file: ""},
				{name: "kno.csv",file: ""},
				{name: "year.csv",file: ""}
			],
			is_impute: true,
			enterprise: [],
			showResult: false
		}
	},
	methods:{
		checkFile(e){
			const files = Array.from(e.target.files) 
			const keys = {
				base: 0,
				money: 1,
				kno: 2,
				year: 3
			}
		
			files.forEach(file => {
				if(file.name.indexOf(".csv") > -1){
					const key = file.name.replace(".csv","")
					if(keys.hasOwnProperty(key)){
						// 获取对应变量
						let reader = new FileReader()
						// 转化成base64
						reader.readAsDataURL(file)
						reader.onload = (e) => {
							this.files[keys[key]].file = e.target.result
						}
					}
				}
			})
		},
		removeFile(index){
			this.files[index].file = ""
		},
		submit(e){
			e.preventDefault()
			// 判断文件是否齐全
			// for(let i=0;i<this.files.length;i++)
			// 	if(this.files[i].file === ""){
			// 		this.$showToast({
			// 			type: "warn",
			// 			text: "文件未齐全"
			// 		})
			// 		return
			// 	}
			fetch("../featured_data_single.json")
			.then(res => res.json())
			.then(data => {
				let i = 0
				let temp = []
				for(let key in data){
					temp.push(data[key])
					i++
					if(i === 3){
						this.enterprise.push(temp)
						i = 0
						temp = []
					}
				}
				console.log(this.enterprise)
				this.showResult = true
			})
		}
	},
	components:{
		checkBox,
		check,
		charts
	}
}
</script>

<style scoped>
.batch section{
	margin: 15px 0;
}

.batch form{
	background-color: var(--blue1);
	box-shadow: var(--box-shadow1);
	color: #FFFFFF;
	padding: 10px;
	border-radius: 10px;
}

.batch form .checkBox{
	max-width: 500px;
}

.batch form .btns{
	margin-top: 10px;
	display: flex;
}
.batch form .btns .check-file{
	position: relative;
	width: 30%;
	max-width: 150px;
	text-align: center;
	color: var(--dark-common);
	background-color: #FFFFFF;
	padding: 5px 10px;
	border-radius: 5px;
	cursor: pointer;
	display: block;
}
.batch form .btns .check-file input{
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	opacity: 0;
}
.batch form .btns .check-file:hover{
	color: #FFFFFF;
	background-color: #3775f1;
}
.batch form .btns .check{
	margin: 0 10px;
	white-space: nowrap;
}
.batch form .btns .submit{
	margin-left: 15px;
	width: 30%;
	max-width: 150px;
	background-color: var(--blue2);
	transition: 0.1s;
}
.batch form .btns .submit:hover{
	background-color: #3775f1;
}
.batch form .btns .submit:active{
	transform: scale(1.1);
}

.batch form .files{
	margin-top: 10px;
	border: var(--border1);
	border-color: #f4f4f4;
	border-radius: 5px;
	display: inline-block;
}
.batch form .files .file{
	padding: 10px 50px 10px 5px;
	cursor: default;
}
.batch form .files .file i{
	margin-left: 10px;
	font-size: 1.2em;
	font-weight: 600;
	cursor: pointer;
	position: absolute;
}
.batch form .files .file i.remove{
	color: #e44f3b;
	visibility: hidden;
}
.batch form .files .file i.remove:hover{
	transform: scale(1.2);
}
.batch form .files .file i.success{
	color: var(--green2);
}

.batch form .files .file:hover{
	background-color: rgba(0,0,0,0.1);
}
.batch form .files .file:hover i.remove{
	visibility: visible;
}
.batch form .files .file:hover i.success,
.batch form .files .file i.no-file{
	visibility: hidden;
}

@media (max-width:800px) {
	.batch form .files{
		display: block;
	}
}
</style>
