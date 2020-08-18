<template>
  <div class="home">
    <header>
      <div class="content title">
        <div class="text">
          <h1>中国<span style="color:#A93226;fontWeight:700">僵尸企业</span></h1>
          <h1>现状分析</h1>
        </div>
      </div>
    </header>

    <!-- 介绍 -->
    <div style="backgroundColor:#17202A">
      <div class="content introduce">
        <p>
          <i class="iconfont icon-dian"></i>
          2016年7月，中国人民大学国家发展与战略研究院发布《中国僵尸企业研究报告——现状、原因和对策》（下称“报告”）。2005—2013年间，全国工业部门中僵尸企业数量约占工业企业总数的7.51%。按企业规模所做的不完全统计，大型、中型和小型企业中“僵尸企业”数量分别约1万家、5万家和13万家。报告针对1998—2015年上市公司数据库进行分析，上市公司中“僵尸企业”的数量在2013年达到高峰（约410家），此后数量有所下降，占比自2003年以来在13%左右波动。通过对十年以上存续期企业的考察和分析发现，国有企业的数量中有38.17%属于长期保持不变的僵尸企业，明显高于其他所有制的占比。
        </p>
        <p>
          <i class="iconfont icon-dian"></i>
          这些企业难以顺利从产业内退出，不符合产能结构调整方向。僵尸企业会影响经济可持续发展、破坏金融系统稳定性和阻碍我国经济转型升级。僵尸企业无经济效益却占用大量资源，降低资源配置效率。尽管僵尸企业无效益，却依然占有大量的土地、资本、能源、劳动力等资源，导致资源无法向收益更高的部门流动，造成了严重的资源浪费。他们无竞争实力却扰乱市场秩序，还以稳定为借口占据社会资金。而且无偿债能力却吸纳大量企业拆借与银行贷款，易引发金融风险。
        </p>
        <!-- <p>
          我们对45620组企业(<strong style="color:#e86452">15971家僵尸企业</strong>,<strong style="color:#5ad8a6">29649家正常企业</strong>)的特征进行了提取，数据图表展示了两者区别较大的特征。
        </p> -->
      </div>
    </div>

    <!-- 行业分布 -->
    <div style="backgroundColor:#D4E6F1">
      <div
        class="content hangye"
        ref="hangye"
      >
        <h4><i class="iconfont icon-dian"></i>工业企业中僵尸企业比例较高行业统计</h4>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in hangye"
            :key="index"
          >
            <div
              class="fill"
              :style="{
                transitionDuration: `${index*0.3+0.7}s`,
                height: `${item.val*1153*show_hangye}px`,
              }"
            ></div>
            <div class="circle">
              <h2>{{item.val}}</h2>
            </div>
            <span>{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 比例统计 -->
    <div style="backgroundColor:#D5F5E3">
      <div
        class="content rate"
        ref="rate"
      >
        <h4><i class="iconfont icon-dian"></i>工业企业中僵尸企业比例较高行业统计</h4>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in rate"
            :key="index"
          >
            <div class="circle">
              <h2>{{item.val}}</h2>
            </div>
            <div
              class="fill"
              :style="{
                transitionDuration: `${index*0.3+0.7}s`,
                height: `${item.val*950*show_rate}px`,
              }"
            ></div>
            <span>{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 地区统计 -->
    <div style="backgroundColor:#FADBD8">
      <div
        class="content diyu"
        ref="diyu"
      >
        <h4><i class="iconfont icon-dian"></i>僵尸企业地域分布统计</h4>
        <div class="charts">
          <div
            class="chart"
            ref="map1"
            data-aos="flip-left"
          >
          </div>
          <div
            class="chart"
            ref="map2"
            data-aos="flip-right"
          >
          </div>
        </div>
      </div>
    </div>

    <!-- 亏年数统计 -->
    <div style="backgroundColor:#FAE5D3">
      <div
        class="content lost-year"
        ref="lostYear"
      >
        <h4><i class="iconfont icon-dian"></i>正常企业与僵尸企业亏损年数统计</h4>
        <p class="text">僵尸企业往往出现多年亏损经营，并且比例远高于正常企业。</p>

        <div
          class="list"
          v-if="lostYear"
        >
          <div
            class="item"
            v-for="(item, index) in lostYear.common"
            :key="index"
            :style="{
              width: `${item/lostYear.sum_common*show_lostYear+300}px`,
              transitionDelay: `${index*0.3+0.2}s`,
            }"
          >亏损{{index}}年——{{lostYear.rate_common[index]}}</div>
          <h2>正常企业</h2>
        </div>

        <div
          class="list"
          v-if="lostYear"
        >
          <div
            class="item"
            v-for="(item, index) in lostYear.zombie"
            :key="index"
            :style="{
              width: `${item/lostYear.sum_zombie*show_lostYear+300}px`
            }"
          >亏损{{index}}年——{{lostYear.rate_zombie[index]}}</div>
          <h2>僵尸企业</h2>
        </div>
      </div>
    </div>

    <!-- 常青贷款年数统计 -->
    <div style="backgroundColor:#EBF5FB">
      <div
        class="content loan-year"
        ref="loanYear"
      >
        <h4><i class="iconfont icon-dian"></i>正常企业与僵尸企业常青贷款年数统计</h4>
        <p class="text">常青贷款是僵尸企业的吸血方式之一，以"借新还旧"来维持经营，容易造成负债积累。</p>

        <div
          class="list"
          v-if="loanYear"
        >
          <div
            class="item"
            v-for="(item, index) in loanYear.common"
            :key="index"
            :style="{
              width: `${item/loanYear.sum_common*show_loanYear+300}px`,
              transitionDelay: `${index*0.3+0.2}s`,
            }"
          >常青贷款{{index}}年——{{loanYear.rate_common[index]}}</div>
          <h2>正常企业</h2>
        </div>

        <div
          class="list"
          v-if="loanYear"
        >
          <div
            class="item"
            v-for="(item, index) in loanYear.zombie"
            :key="index"
            :style="{
              width: `${item/loanYear.sum_zombie*show_loanYear+300}px`
            }"
          >常青贷款{{index}}年——{{loanYear.rate_zombie[index]}}</div>
          <h2>僵尸企业</h2>
        </div>
      </div>
    </div>

    <div
      v-for="(item, index) in list"
      :key="index"
      :style="{
        backgroundColor: item.backgroundColor,
        color: item.color
      }"
      data-aos="flip-up"
    >
      <div class="content data">
        <p v-if="index % 2 !== 0"><i class="iconfont icon-dian"></i>{{ item.text }}</p>
        <div
          class="chart"
          :id="item.id"
        ></div>
        <p v-if="index % 2 === 0"><i class="iconfont icon-dian"></i>{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import homeData from '../assets/homeData.json'
import typeTable from '../components/typeTable'
var load_amount = 1000,
  load_time = 50
export default {
  data() {
    return {
      hangye: [
        { text: '水生成和供应业', val: '25.99' },
        { text: '电、热力生成供应', val: '19.14' },
        { text: '化学化纤制造业', val: '18.1' },
        { text: '黑色金属冶炼', val: '15.0' },
        { text: '石油，核燃料加工', val: '14.46' },
        { text: '纺织业', val: '11.24' },
        { text: '有色金属冶炼', val: '11.13' },
        { text: '石油、天然气开采', val: '9.93' },
      ],
      rate: [
        { text: '钢铁', val: '51.43' },
        { text: '房地产', val: '44.52' },
        { text: '建筑装饰', val: '31.76' },
        { text: '商业贸易', val: '28.89' },
        { text: '综合', val: '21.95' },
        { text: '公用事业', val: '20.49' },
        { text: '交通运输', val: '17.58' },
        { text: '采掘', val: '17.45' },
        { text: '有色金属', val: '16.98' },
        { text: '汽车', val: '15.32' },
      ],
      list: [
        {
          id: 'government-sub',
          backgroundColor: '#FEF9E7',
          color: '#F1C40F',
          text:
            '政府补贴也是僵尸企业的吸血方式之一，往往会造成社会资源的浪费，同时导致其他企业所受的补贴减少。正常企业需要政府补贴的占比为33.22%,低于僵尸企业50.25%，并且从补贴年数来看，僵尸企业需要补贴来维持经营的年数也普遍高于正常企业。',
        },
        {
          id: 'tech-content',
          backgroundColor: '#EAFAF1',
          color: '#2ECC71',
          text:
            '科技含量: 反应企业的科技水平，数值越高代表科技水平越高。\n正常企业与僵尸企业在科技含量上的差距不大，说明僵尸企业也是有科技水平的，但可能由于在组织管理，市场营销等方面比较落后，造成整体运营效果差，企业亏损严重。',
        },
        {
          id: 'reProfits-grow',
          backgroundColor: '#EAECEE',
          color: '#2C3E50',
          text:
            '净利润长率=(当期利润-上期利润)/上期利润\n可以发现僵尸企业的净利润增速大部分都为正，但这并不是意味着它们的经营越来越好，由于僵尸企业大部分都是亏损经营，所以净利润增速为正意味着它们的经营出现了持续恶化。',
        },
        {
          id: 'reProfits-rate',
          backgroundColor: '#FDFEFE',
          color: '#333333',
          text:
            '净利润比重反应了企业的盈利能力，僵尸企业的净利润比重大多为负，说明其净利润为负，经营持续亏损，企业盈利能力弱。',
        },
      ],
      mapData: [
        { name: '广西', amount: 50, rate: 20 },
        { name: '广东', amount: 150, rate: 10 },
        { name: '浙江', amount: 350, rate: 21 },
        { name: '山西', amount: 520, rate: 20 },
        { name: '福建', amount: 190, rate: 25 },
        { name: '云南', amount: 700, rate: 51 },
        { name: '内蒙古', amount: 990, rate: 40 },
        { name: '吉林', amount: 600, rate: 30 },
      ],
      lostYear: null,
      loanYear: null,
      show_hangye: 0,
      show_rate: 0,
      show_lostYear: 0,
      show_loanYear: 0,
    }
  },
  methods: {
    count_lostYear() {
      this.lostYear = {
        common: homeData.common.lossYear,
        zombie: homeData.zombie.lossYear,
        sum_common: 0,
        sum_zombie: 0,
      }
      let sum
      sum = homeData.common.lossYear.reduce((sum, item) => {
        return (sum += item)
      }, 0)
      this.lostYear.rate_common = this.lostYear.common.map((item) => {
        this.lostYear.sum_common += item
        if (item === 0) return '0'
        return `${((item /= sum) * 100).toFixed(2)}%`
      })

      sum = homeData.zombie.lossYear.reduce((sum, item) => {
        return (sum += item)
      }, 0)
      this.lostYear.rate_zombie = this.lostYear.zombie.map((item) => {
        this.lostYear.sum_zombie += item
        if (item === 0) return '0'
        return `${((item /= sum) * 100).toFixed(2)}%`
      })
    },
    count_loanYear() {
      this.loanYear = {
        common: homeData.common.loanYear.slice(0, 3),
        zombie: homeData.zombie.loanYear.slice(0, 3),
        sum_common: 0,
        sum_zombie: 0,
      }
      let sum
      sum = homeData.common.loanYear.reduce((sum, item) => {
        return (sum += item)
      }, 0)
      this.loanYear.rate_common = this.loanYear.common.map((item) => {
        this.loanYear.sum_common += item
        if (item === 0) return '0'
        return `${((item /= sum) * 100).toFixed(2)}%`
      })

      sum = homeData.zombie.loanYear.reduce((sum, item) => {
        return (sum += item)
      }, 0)
      this.loanYear.rate_zombie = this.loanYear.zombie.map((item) => {
        this.loanYear.sum_zombie += item
        if (item === 0) return '0'
        return `${((item /= sum) * 100).toFixed(2)}%`
      })
    },
    draw_map() {
      let maxAmount = this.mapData[0].amount,
        maxRate = this.mapData[0].rate
      let minAmount = maxAmount,
        minRate = maxRate
      for (let i = 1; i < this.mapData.length; i++) {
        maxAmount =
          this.mapData[i].amount > maxAmount
            ? this.mapData[i].amount
            : maxAmount
        minAmount =
          this.mapData[i].amount < minAmount
            ? this.mapData[i].amount
            : minAmount
        maxRate =
          this.mapData[i].rate > maxRate ? this.mapData[i].rate : maxRate
        minRate =
          this.mapData[i].rate < minRate ? this.mapData[i].rate : minRate
      }
      let option = {
        title: {
          text: '僵尸企业地区数量分布',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#e74c3c',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}',
        },
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: maxAmount,
          splitNumber: 10,
          text: [maxAmount, minAmount],
          itemGap: 2,
          inRange: {
            color: ['#FADBD8', '#F5B7B1', '#EC7063', '#CB4335', '#B03A2E'],
          },
        },
        series: [
          {
            type: 'map',
            map: 'china',
            zoom: 1.1,
            center: [104.114129, 36],
            label: {
              show: true,
              fontSize: 10,
            },
            itemStyle: {
              //区域样式
              emphasis: {
                //点击样式
                areaColor: '#CB4335',
                shadowColor: '#FADBD8',
                shadowBlur: 5,
                borderColor: '#f4f4f4',
                label: {
                  show: true,
                  color: '#ffffff',
                },
              },
            },
            data: this.mapData.map((item) => {
              return { name: item.name, value: item.amount }
            }),
          },
        ],
      }
      let chart = this.$echarts.init(this.$refs.map1)
      chart.setOption(option)
      // 比例分布
      option.title.text = '僵尸企业地区比例分布'
      option.tooltip.formatter = '{b} : {c}%'
      option.visualMap.max = maxRate
      option.visualMap.text = [maxRate + '%', minRate + '%']
      option.series[0].data = this.mapData.map((item) => {
        return { name: item.name, value: item.rate }
      })
      chart = this.$echarts.init(this.$refs.map2)
      chart.setOption(option)
    },
    government_sub() {
      let years = ['0年', '1年', '2年', '3年']
      let zombieData = years.map((year, i) => {
        return {
          name: year,
          value: homeData.zombie.subsidy[i],
          rate:
            (
              (homeData.zombie.subsidy[i] / homeData.zombie.amount) *
              100
            ).toFixed(2) + '%',
        }
      })
      let commonData = years.map((year, i) => {
        return {
          name: year,
          value: homeData.common.subsidy[i],
          rate:
            (
              (homeData.common.subsidy[i] / homeData.common.amount) *
              100
            ).toFixed(2) + '%',
        }
      })
      let option = {
        title: {
          text: '政府补贴年数',
          left: 'center',
          subtext: '内圈为僵尸企业,外圈为正常企业',
        },
        color: ['#5ad8a6', '#f6bd16', '#2E86C1', '#e86452'],
        legend: {
          right: 20,
          orient: 'vertical',
        },
        tooltip: {
          formatter: (param) => {
            let text = ''
            text += `${param.marker} ${param.name}<br>`
            text += `正常企业: ${commonData[param.dataIndex].value}<br>`
            text += `占比: ${commonData[param.dataIndex].rate}<br>`
            text += `僵尸企业: ${zombieData[param.dataIndex].value}<br>`
            text += `占比: ${zombieData[param.dataIndex].rate}<br>`
            return text
          },
        },
        series: [
          {
            name: '僵尸企业',
            type: 'pie',
            top: 50,
            radius: ['40%', '60%'],
            label: {
              show: true, //开启显示
              fontSize: 14,
              position: 'inside',
              formatter: (param) => {
                return `${param.value}`
              },
            },
            data: zombieData,
          },
          {
            name: '正常企业',
            type: 'pie',
            top: 50,
            radius: ['60%', '80%'],
            label: {
              show: true, //开启显示
              fontSize: 14,
              formatter: (param) => {
                return `${param.value}`
              },
            },
            data: commonData,
          },
        ],
      }
      let myChart = this.$echarts.init(
        document.getElementById('government-sub')
      ) //初始化
      myChart.setOption(option)
    },
    tech_content() {
      let content = ['0', 1, 2, 3]
      let zombieData = content.map((item, i) => {
        return {
          name: item,
          value: homeData.zombie.tech_content[i],
          rate:
            (
              (homeData.zombie.tech_content[i] / homeData.zombie.amount) *
              100
            ).toFixed(2) + '%',
        }
      })
      let commonData = content.map((item, i) => {
        return {
          name: item,
          value: homeData.common.tech_content[i],
          rate:
            (
              (homeData.common.tech_content[i] / homeData.common.amount) *
              100
            ).toFixed(2) + '%',
        }
      })
      let option = {
        title: {
          left: 'center',
          text: '科技含量',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          right: 0,
          data: ['正常企业', '僵尸企业'],
        },
        color: ['#58D68D', '#D35400'],
        xAxis: {
          name: '科技含量',
          type: 'category',
          data: content,
        },
        yAxis: {
          type: 'value',
          name: '企业数量',
        },
        grid: {
          right: '12%',
        },
        series: [
          {
            name: '正常企业',
            type: 'bar',
            barWidth: '40%',
            barGap: '-100%',
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              formatter: (param) => {
                if (param.value === 0) return ''
                else return `${param.value}`
              },
            },
            data: homeData.common.tech_content,
          },
          {
            name: '僵尸企业',
            type: 'bar',
            barWidth: '40%',
            barGap: '0',
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              formatter: (param) => {
                if (param.value === 0) return ''
                else return `${param.value}`
              },
            },
            data: homeData.zombie.tech_content,
          },
        ],
      }
      let myChart = this.$echarts.init(document.getElementById('tech-content')) //初始化
      myChart.setOption(option)
    },
    people_earn() {
      let zombieData = homeData.zombie.belong_People_earn.map((item) => [
        item,
        Math.random() * 20 + 15,
      ])
      let commonData = homeData.common.belong_People_earn.map((item) => [
        item,
        Math.random() * 20 + 65,
      ])
      let zombieData_times = Math.floor(zombieData.length / load_amount)
      let commonData_times = Math.floor(commonData.length / load_amount)
      let option = {
        animation: false,
        title: {
          text: '所有者权益',
          left: 'center',
        },
        xAxis: [
          {
            name: '所有者权益',
            type: 'value',
            nameTextStyle: {
              padding: [60, 0, 0, -40],
            },
          },
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            axisTick: {
              alignWithLabel: true,
            },
          },
          {
            type: 'category',
            position: 'left',
            axisTick: {
              alignWithLabel: true,
            },
            data: ['僵尸企业', '正常企业'],
          },
        ],
        series: [
          {
            name: '正常企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(30,148,147,0.05)',
              borderColor: 'rgba(30,148,147,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
          {
            name: '僵尸企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(232,100,82,0.05)',
              borderColor: 'rgba(232,100,82,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
        ],
      }
      let myChart = this.$echarts.init(document.getElementById('people-earn')) //初始化
      myChart.setOption(option)
      let loadEnd = false
      const appendZombie = (i) => {
        setTimeout(() => {
          if (i === zombieData_times - 1) {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount),
            })
            if (loadEnd) {
              myChart.resize()
              this.reProfits_grow()
            } else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount, load_amount),
            })
            appendZombie(i + 1)
          }
        }, load_time)
      }
      const appendcommon = (i) => {
        setTimeout(() => {
          if (i === commonData_times - 1) {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount),
            })
            if (loadEnd) {
              this.reProfits_grow()
              myChart.resize()
            } else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount, load_amount),
            })
            appendcommon(i + 1)
          }
        }, load_time)
      }
      appendZombie(0)
      appendcommon(0)
    },
    reProfits_grow() {
      let zombieData = homeData.zombie.reProfits_grow.map((item) => [
        item,
        Math.random() * 20 + 15,
      ])
      let commonData = homeData.common.reProfits_grow.map((item) => [
        item,
        Math.random() * 20 + 65,
      ])
      let zombieData_times = Math.floor(zombieData.length / load_amount)
      let commonData_times = Math.floor(commonData.length / load_amount)
      let option = {
        animation: false,
        title: {
          text: '净利润增长率',
          left: 'center',
        },
        xAxis: [
          {
            name: '净利润增长率',
            type: 'value',
            nameTextStyle: {
              padding: [60, 0, 0, -40],
            },
          },
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            axisTick: {
              alignWithLabel: true,
            },
          },
          {
            type: 'category',
            position: 'left',
            axisTick: {
              alignWithLabel: true,
            },
            data: ['僵尸企业', '正常企业'],
          },
        ],
        series: [
          {
            name: '正常企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(30,148,147,0.05)',
              borderColor: 'rgba(30,148,147,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
          {
            name: '僵尸企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(232,100,82,0.05)',
              borderColor: 'rgba(232,100,82,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
        ],
      }
      let myChart = this.$echarts.init(
        document.getElementById('reProfits-grow')
      ) //初始化
      myChart.setOption(option)
      let loadEnd = false
      const appendZombie = (i) => {
        setTimeout(() => {
          if (i === zombieData_times - 1) {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount),
            })
            if (loadEnd) {
              this.reProfits_rate()
              myChart.resize()
            } else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount, load_amount),
            })
            appendZombie(i + 1)
          }
        }, load_time)
      }
      const appendcommon = (i) => {
        setTimeout(() => {
          if (i === commonData_times - 1) {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount),
            })
            if (loadEnd) {
              this.reProfits_rate()
              myChart.resize()
            } else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount, load_amount),
            })
            appendcommon(i + 1)
          }
        }, load_time)
      }
      appendZombie(0)
      appendcommon(0)
    },
    reProfits_rate() {
      let zombieData = homeData.zombie.reProfits_rate.map((item) => [
        item,
        Math.random() * 20 + 15,
      ])
      let commonData = homeData.common.reProfits_rate.map((item) => [
        item,
        Math.random() * 20 + 65,
      ])
      let zombieData_times = Math.floor(zombieData.length / load_amount)
      let commonData_times = Math.floor(commonData.length / load_amount)
      let option = {
        animation: false,
        title: {
          text: '净利润比重',
          left: 'center',
        },
        xAxis: [
          {
            name: '净利润比重',
            type: 'value',
            nameTextStyle: {
              padding: [60, 0, 0, -40],
            },
          },
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            axisTick: {
              alignWithLabel: true,
            },
          },
          {
            type: 'category',
            position: 'left',
            axisTick: {
              alignWithLabel: true,
            },
            data: ['僵尸企业', '正常企业'],
          },
        ],
        series: [
          {
            name: '正常企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(30,148,147,0.05)',
              borderColor: 'rgba(30,148,147,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
          {
            name: '僵尸企业',
            type: 'scatter',
            itemStyle: {
              color: 'rgba(232,100,82,0.05)',
              borderColor: 'rgba(232,100,82,0.7)',
              borderWidth: 0.8,
            },
            symbolSize: 5,
            silent: true,
            data: [],
          },
        ],
      }
      let myChart = this.$echarts.init(
        document.getElementById('reProfits-rate')
      ) //初始化
      myChart.setOption(option)
      let loadEnd = false
      const appendZombie = (i) => {
        setTimeout(() => {
          if (i === zombieData_times - 1) {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount),
            })
            if (loadEnd) myChart.resize()
            else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 1,
              data: zombieData.slice(i * load_amount, load_amount),
            })
            appendZombie(i + 1)
          }
        }, load_time)
      }
      const appendcommon = (i) => {
        setTimeout(() => {
          if (i === commonData_times - 1) {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount),
            })
            if (loadEnd) myChart.resize()
            else loadEnd = true
          } else {
            myChart.appendData({
              seriesIndex: 0,
              data: commonData.slice(i * load_amount, load_amount),
            })
            appendcommon(i + 1)
          }
        }, load_time)
      }
      appendZombie(0)
      appendcommon(0)
    },
  },
  mounted() {
    setTimeout(() => {
      this.count_lostYear()
      this.count_loanYear()
      this.draw_map()
      this.government_sub()
      this.tech_content()
      this.reProfits_grow()
    })

    window.onscroll = (e) => {
      //滚动条高度+视窗高度 = 可见区域底部高度
      let visibleBottom = window.scrollY + document.documentElement.clientHeight
      let visibleTop = window.scrollY
      let centerY, dom
      // 行业是否在屏幕内
      dom = this.$refs.hangye
      centerY = dom.offsetTop + dom.offsetHeight / 2
      if (centerY > visibleTop && centerY < visibleBottom)
        this.show_hangye = 0.01
      // 行业比例
      dom = this.$refs.rate
      centerY = dom.offsetTop + dom.offsetHeight / 2
      if (centerY > visibleTop && centerY < visibleBottom) this.show_rate = 0.01
      // 亏损年数
      dom = this.$refs.lostYear
      centerY = dom.offsetTop + dom.offsetHeight / 2
      if (centerY > visibleTop && centerY < visibleBottom)
        this.show_lostYear = 700
      // 常青贷款年数
      dom = this.$refs.loanYear
      centerY = dom.offsetTop + dom.offsetHeight / 2
      if (centerY > visibleTop && centerY < visibleBottom)
        this.show_loanYear = 700
      // console.log(centerY, visibleBottom)
    }
  },
  components: {
    typeTable,
  },
}
</script>

<style scoped>
.home {
  overflow: hidden;
}
.home .card:not(.introduce) {
  margin: 10px 0;
}

.home .content {
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  padding: 20px 0;
}
.home .icon-dian {
  margin-right: 5px;
  animation: flicker 1.5s infinite;
  filter: brightness(110%);
}

.home header {
  background: url('../assets/bg.jpg') no-repeat center center/cover;
  padding: 15px;
}
.home .title {
  margin: 0 auto;
  width: 280px;
  height: 280px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-items: center;
  filter: brightness(110%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.home .title .text {
  margin: 0 auto;
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #333;
}
.home .title h1 {
  color: #fff;
}

.home .introduce p {
  color: #fff;
}
.home .introduce .icon-dian {
  color: #ee3a3a;
}

.home .list .item .fill {
  width: 100%;
  height: 0;
  transition-timing-function: ease-in-out;
}

.home .hangye {
  height: 500px;
}
.home .hangye h4,
.home .hangye .icon-dian {
  color: #2980b9;
}
.home .hangye .list {
  display: flex;
}
.home .hangye .list .item {
  position: relative;
  flex: 1;
  height: 100%;
  padding: 5px 0 10px;
  background-color: #3498db;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home .hangye .list .item:nth-child(even) {
  background-color: #21618c;
}
.home .hangye .list .item .circle {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  line-height: 100px;
  text-align: center;
  background-color: #21618c;
  color: #3498db;
  transition: 0.6s ease-in-out;
}
.home .hangye .list .item .circle:hover {
  transform: rotate(360deg);
}
.home .hangye .list .item:nth-child(even) .circle {
  background-color: #3498db;
  color: #21618c;
}
.home .hangye .list .item span {
  position: absolute;
  bottom: -25px;
  font-size: 0.8em;
  font-weight: 600;
  color: #21618c;
}

.home .rate {
  position: relative;
  height: 700px;
}
.home .rate h4,
.home .rate .icon-dian {
  color: #58d68d;
}
.home .rate .list {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.home .rate .list .item {
  position: relative;
  flex: 1;
  height: 100%;
  padding: 5px 0 10px;
  background-color: #2ecc71;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home .rate .list .item:nth-child(even) {
  background-color: #239b56;
}
.home .rate .list .item .circle {
  margin: 0 auto;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  line-height: 90px;
  text-align: center;
  background-color: #239b56;
  color: #2ecc71;
  transition: 0.6s ease-in-out;
}
.home .rate .list .item .circle:hover {
  transform: rotate(360deg);
}
.home .rate .list .item:nth-child(even) .circle {
  background-color: #2ecc71;
  color: #239b56;
}
.home .rate .list .item span {
  position: absolute;
  top: -25px;
  font-size: 0.8em;
  font-weight: 600;
  color: #239b56;
}

.home .diyu {
  position: relative;
  height: 530px;
}
.home .diyu h4,
.home .diyu .icon-dian {
  color: #e74c3c;
}
.home .diyu .charts {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.home .diyu .charts .chart {
  width: 49%;
  height: 450px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  filter: brightness(110%);
}

.home .lost-year h4,
.home .lost-year .text,
.home .lost-year .icon-dian {
  color: #f39c12;
}
.home .lost-year .text {
  text-indent: 1.3em;
}
.home .lost-year .list {
  position: relative;
  margin: 10px 0;
}
.home .lost-year .list h2 {
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e5109;
}
.home .lost-year .list .item {
  width: 300px;
  padding: 5px 10px 5px 100px;
  color: #fff;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  text-align: end;
  transition: var(--transition-speed);
}
.home .lost-year .list .item:nth-child(1) {
  background-color: #76d7c4;
}
.home .lost-year .list .item:nth-child(2) {
  background-color: #f4d03f;
}
.home .lost-year .list .item:nth-child(3) {
  background-color: #f39c12;
}
.home .lost-year .list .item:nth-child(4) {
  background-color: #e74c3c;
}

.home .loan-year {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.home .loan-year h4,
.home .loan-year .text,
.home .loan-year .icon-dian {
  align-self: flex-start;
  color: #2980b9;
}
.home .loan-year .text {
  text-indent: 1.3em;
}
.home .loan-year .list {
  position: relative;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.home .loan-year .list h2 {
  z-index: 2;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #7e5109;
}
.home .loan-year .list .item {
  width: 300px;
  padding: 5px 100px 5px 10px;
  color: #fff;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  transition: var(--transition-speed);
}
.home .loan-year .list .item:nth-child(1) {
  background-color: #76d7c4;
}
.home .loan-year .list .item:nth-child(2) {
  background-color: #f5b041;
}
.home .loan-year .list .item:nth-child(3) {
  background-color: #e74c3c;
}

.home .data {
  padding-top: 15px;
  display: flex;
  justify-content: center;
}
.home .data .chart {
  margin: 0 10px;
  flex-shrink: 0;
  height: 400px;
  width: 600px;
}
.home .data p {
  flex-shrink: 1;
  /* text-indent: 2em; */
  white-space: pre-line;
  font-weight: 600;
}

@keyframes flicker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
