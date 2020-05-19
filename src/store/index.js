import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		selects: [
			{
				text:"行业",
				model:"bussiness",
				list: ["商业服务业","交通运输业","工业","社区服务","服务业","零售业"]
			},
			{
				text:"区域",
				model:"area",
				list: ["广西","江西","福建","湖北","山东","广东","湖南"]
			},
			{
				text:"企业类型",
				model:"company_type",
				list: ["农民专业合作社","有限责任公司","股份有限公司","集体所有制企业","合伙企业"]
			},
			{
				text:"控制人类型",
				model:"controller_type",
				list: ["自然人","企业法人"]
			},
		],
		inputs: [
			{text:"ID",step:1,model:"ID"},
			{text:"注册时间",step:1,model:"regist_time"},
			{text:"注册资本",step:0.01,model:"capital"},
			{text:"控制人持股比例",step:0.01,model:"main_equity_per"},
			{text:"专利",step:1,model:"patent_num"},
			{text:"商标",step:1,model:"brand_num"},
			{text:"著作权",step:1,model:"copyright_num"},
			{text:"year",step:1,model:"year"},
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
		grad_cam_text: ['注册资本', '控制人持股比例', '行业_交通运输业', '行业_商业服务业', '行业_工业', '行业_服务业', '行业_社区服务', '行业_零售业', '区域_山东','区域_广东', '区域_广西', '区域_江西', '区域_湖北', '区域_湖南', '区域_福建', '企业类型_农民专业合作社', '企业类型_合伙企业', '企业类型_有限责任公司','企业类型_股份有限公司', '企业类型_集体所有制企业', '控制人类型_企业法人', '控制人类型_自然人', '债权融资额度', '债权融资成本', '股权融资额度', '股权融资成本', '内部融资和贸易融资额度','内部融资和贸易融资成本', '项目融资和政策融资额度', '项目融资和政策融资成本', '从业人数', '资产总额', '负债总额', '营业总收入', '主营业务收入', '利润总额','纳税总额', '所有者权益合计', '科技含量', '资产负债率', '资产收益率', '负债增长率', '总营业收入增长率', '主营收入增长率', '总利润增长率','净利润增长率', '纳税增长率', '所有者权益增长率', '总资产增长率', '员工成长性', '债权融资趋势', '股权融资趋势', '政府补贴趋势', '息税前利润','利息保障倍数', '偿债能力', '成立时长', '亏损年数', '平均净利润', '政府补贴依赖程度', '净收益率', '独立性指标', '官方补贴比例_总','纳税比', '主营比重', '净利润比重', '所有者权益比重', '资产集中水平', '资产周转率', '还息力', '债权融资比例', '股权融资比例','内部融资和贸易融资比例', '项目融资和政策融资比例', '融资净额度', '融资成本比例', '融资额占利比', '融资额占资比', '接受政府补贴与否', '常青贷款与否', '多种吸血方式']
	},
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
