import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		selects: [
			{
				text:"行业",
				model:"bussiness",
				list: [
					{label: "商业服务业",value: 0},
					{label: "交通运输业",value: 1},
					{label: "工业",value: 2},
					{label: "社区服务",value: 3},
					{label: "服务业",value: 4},
					{label: "零售业",value: 5}
				]
			},
			{
				text:"区域",
				model:"area",
				list: [
					{label: "广西",value: 0},
					{label: "江西",value: 1},
					{label: "福建",value: 2},
					{label: "湖北",value: 3},
					{label: "山东",value: 4},
					{label: "广东",value: 5},
					{label: "湖南",value: 6}
				]
			},
			{
				text:"企业类型",
				model:"company_type",
				list: [
					{label: "农民专业合作社",value: 0},
					{label: "有限责任公司",value: 1},
					{label: "股份有限公司",value: 2},
					{label: "集体所有制企业",value: 3},
					{label: "合伙企业",value: 4}
				]
			},
			{
				text:"控制人类型",
				model:"controller_type",
				list: [
					{label: "自然人",value: 0},
					{label: "企业法人",value: 1},
				]
			},
		],
		inputs: [
			{text:"ID",step:1,model:"ID"},
			{text:"第几年的企业信息",step:1,model:"year"},
			{text:"注册时间",step:1,model:"regist_time"},
			{text:"注册资本",step:0.01,model:"capital"},
			{text:"控制人持股比例",step:0.01,model:"main_equity_per"},
			{text:"专利",step:1,model:"patent_num"},
			{text:"商标",step:1,model:"brand_num"},
			{text:"著作权",step:1,model:"copyright_num"},
			{text:"债权融资额度",step:0.01,model:"debet_quota"},
			{text:"债权融资成本",step:0.01,model:"debet_cost"},
			{text:"股权融资额度",step:0.01,model:"equity_quota"},
			{text:"股权融资成本",step:0.01,model:"equity_cost"},
			{text:"内部融资和贸易融资额度",step:0.01,model:"inside_quota"},
			{text:"内部融资和贸易融资成本",step:0.01,model:"inside_cost"},
			{text:"项目融资和政策融资额度",step:0.01,model:"project_quota"},
			{text:"项目融资和政策融资成本",step:0.01,model:"project_cost"},
			{text:"从业人数",step:0.01,model:"employee_num"},
			{text:"资产总额",step:0.01,model:"total_assets"},
			{text:"负债总额",step:0.01,model:"total_debet"},
			{text:"营业总收入",step:0.01,model:"total_income"},
			{text:"主营业务收入",step:0.01,model:"main_income"},
			{text:"利润总额",step:0.01,model:"total_profits"},
			{text:"净利润",step:0.01,model:"net_profits"},
			{text:"纳税总额",step:0.01,model:"tax"},
			{text:"所有者权益合计",step:0.01,model:"total_equity"}
		],
		param: {
			ID: "",
			year: "",
			regist_time: "",
			capital: "",
			bussiness: "",
			area: "",
			company_type: "",
			controller_type: "",
			main_equity_per: "",
			patent_num: "",
			brand_num: "",
			copyright_num: "",
			debet_quota: "",
			debet_cost: "",
			equity_quota: "",
			equity_cost: "",
			inside_quota: "",
			inside_cost: "",
			project_quota: "",
			project_cost: "",
			employee_num: "",
			total_assets: "",
			total_debet: "",
			total_income: "",
			main_income: "",
			total_profits: "",
			net_profits: "",
			tax: "",
			total_equity: ""
		},
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
