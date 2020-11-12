<template>
  <div class="result-distribution">
    <div style="backgroundColor:#FDEBD0">
      <!-- 企业类型数量 -->
      <div class="content amount">
        <h4><i class="iconfont icon-dian"></i>两类企业数量统计</h4>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in amounts"
            :key="index"
          >
            <h3 class="name">{{item.text}}</h3>
            <div
              class="amount"
              :style="{
              width: `${item.rate*0.8}%`
            }"
            >{{item.rate}}%&emsp;{{item.amount}}</div>
          </div>
        </div>
      </div>

      <!-- 僵尸程度 -->
      <div class="content degree">
        <h4><i class="iconfont icon-dian"></i>企业风险值</h4>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in degrees"
            :key="index"
          >
            <div
              class="amount"
              :style="{
              width: `${item.rate*10}px`
            }"
            >{{item.rate}}%&emsp;{{item.amount}}</div>
            <h3 class="name">{{item.text}}</h3>
          </div>
        </div>
      </div>
    </div>

    <div style="backgroundColor:#FADBD8"
    >
      <div class="content type">
        <h4><i class="iconfont icon-dian"></i>异常类型统计</h4>
        <p>一个企业可能会被判断为多个类型的异常企业。</p>
        <div class="data">
          <div
            class="chart "
            id="zombie-dis"
          ></div>
          <table>
            <tr>
              <th>类型</th>
              <th>吸血表现</th>
              <th colspan="2">异常特征描述</th>
            </tr>
            <tr
              v-for="(item,index) in degreeDescription"
              :key="index"
            >
              <td>{{item.type}}</td>
              <td>{{item.suckBlood}}</td>
              <td>{{item.describe}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amounts: [
        { text: '正常企业', amount: 0, rate: 0 },
        { text: '异常企业', amount: 0, rate: 0 },
      ],
      degrees: [
        { text: '0-0.2', amount: 0, rate: 0 },
        { text: '0.2-0.4', amount: 0, rate: 0 },
        { text: '0.4-0.6', amount: 0, rate: 0 },
        { text: '0.6-0.8', amount: 0, rate: 0 },
        { text: '0.8-1', amount: 0, rate: 0 },
      ],
      typeDis: [],
      degreeDescription: [
        {
          type: '第Ⅰ类',
          suckBlood: '政府补贴',
          describe:
            '资产负债率超过50%，日常经营活动能产生利润，但需要靠政府补贴来维持经营状态，从而避免被"特殊处理"',
        },
        {
          type: '第Ⅱ类',
          suckBlood: '政府补贴',
          describe:
            '资产负债率超过50%，日常经营活动亏损，政府补贴也挽回不了亏损。',
        },
        {
          type: '第Ⅲ类',
          suckBlood: '常青贷款',
          describe:
            '资产负债率超过50%，日常经营活动能产生利润，但息税前利润不足以支付贷款利息，经营状态持续恶化，资产负债率增加。',
        },
        {
          type: '第Ⅳ类',
          suckBlood: '常青贷款',
          describe:
            '资产负债率超过50%，日常经营活动亏损，而且息税前利润不足以支付利息，经营状态持续恶化，资产负债率增加。',
        },
        {
          type: '第Ⅴ类',
          suckBlood: '政府补贴',
          describe:
            '日常经营活动亏损，经营状态持续恶化，资产负债率增加，需要政府补贴来弥补一定的亏损经营状态。',
        },
      ],
    }
  },
  props: ['data', 'zombie', 'normal', 'features'],
  methods: {
    draw() {
      this.cal_amount()
      this.cal_degree()
      if (this.zombie.length === 0) return
      this.draw_zombie_dis()
    },
    cal_amount() {
      this.amounts[0].amount = this.normal.length
      this.amounts[0].rate = (
        (this.normal.length / this.data.length) *
        100
      ).toFixed(2)
      this.amounts[1].amount = this.zombie.length
      this.amounts[1].rate = (
        (this.zombie.length / this.data.length) *
        100
      ).toFixed(2)
    },
    cal_type() {
      this.typeDis = [
        { name: 'Ⅰ类', value: 0 },
        { name: 'Ⅱ类', value: 0 },
        { name: 'Ⅲ类', value: 0 },
        { name: 'Ⅳ类', value: 0 },
        { name: 'Ⅴ类', value: 0 },
      ]
      this.zombie.forEach((item) => {
        item.zombie_type.forEach((type) => {
          this.typeDis[type - 1].value++
        })
      })
    },
    cal_degree() {
      this.data.forEach((item) => {
        for (let i = 1; i <= 5; i++)
          if (item.zombie_level < 0.2 * i && item.zombie_level !== 0) {
            this.degrees[i - 1].amount++
            break
          }
      })
      this.degrees.forEach((item) => {
        item.rate = ((item.amount / this.data.length) * 100).toFixed(2)
      })
    },
    draw_zombie_dis() {
      // 僵尸类型分布
      const sum = this.typeDis.reduce((sum, item) => {
        return sum + item.value
      }, 0)
      const pro = {}
      const selected = {}
      this.typeDis.forEach((item) => {
        if (item.value === 0) {
          pro[item.name] = '0%'
          selected[item.name] = false
        } else {
          pro[item.name] = ((item.value / sum) * 100).toFixed(2) + '%'
          selected[item.name] = true
        }
      })
      let option = {
        color: ['#FFB5B5', '#ff7575', '#FF2D2D', '#CE0000', '#930000'],
        tooltip: {
          formatter: (param) => {
            let content = ''
            content += param.marker
            content += `${param.data.name}<br>`
            content += `数量: ${param.data.value}家<br>`
            content += `占比: ${pro[param.data.name]}<br>`
            return content
          },
        },
        legend: {
          data: ['Ⅰ类', 'Ⅱ类', 'Ⅲ类', 'Ⅳ类', 'Ⅴ类'],
          right: 0,
          orient: 'vertical',
          icon: 'circle',
          textStyle: {
            fontSize: 14,
          },
          selected,
          formatter: (name) => {
            return name + ' ' + pro[name]
          },
        },
        series: {
          name: '僵尸等级',
          type: 'pie',
          width: '80%',
          top: 20,
          left: 0,
          label: {
            position: 'inside',
            fontSize: 14,
            fontWeight: 600,
          },
          data: this.typeDis,
        },
      }
      let myChart = this.$echarts.init(document.getElementById('zombie-dis')) //初始化
      myChart.setOption(option)
    },
  },
  created() {
    this.cal_type()
  },
}
</script>

<style scoped>
.result-distribution {
  width: 100%;
  overflow: hidden;
}

.result-distribution h4 {
  margin-bottom: 5px;
}
.result-distribution .list .item {
  height: 45px;
  line-height: 45px;
  display: flex;
}
.result-distribution .list .item .amount {
  min-width: 150px;
  padding: 0 15px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  color: #ffffff;
  text-align: end;
  transition: var(--transition-speed) ease-out;
  white-space: pre-line;
}
.result-distribution .list .item .name {
  width: 120px;
  padding-left: 15px;
}

.result-distribution .amount h4,
.result-distribution .degree h4 {
  color: #f39c12;
}
.result-distribution .amount .list .item:nth-child(1) .name,
.result-distribution .amount .list .item:nth-child(1) .amount {
  background-color: #2ecc71;
}
.result-distribution .amount .list .item:nth-child(1) .name {
  color: #138d75;
}
.result-distribution .amount .list .item:nth-child(2) .name,
.result-distribution .amount .list .item:nth-child(2) .amount {
  background-color: #ec7063;
}
.result-distribution .amount .list .item:nth-child(2) .name {
  color: #a93226;
}

.result-distribution .degree h4 {
  text-align: end;
}
.result-distribution .degree .list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.result-distribution .degree .list .item .amount {
  border-radius: 0;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  text-align: start;
}
.result-distribution .degree .list .item:nth-child(1) .name,
.result-distribution .degree .list .item:nth-child(1) .amount {
  background-color: #aab7b8;
}
.result-distribution .degree .list .item:nth-child(1) .name {
  color: #5f6a6a;
}
.result-distribution .degree .list .item:nth-child(2) .name,
.result-distribution .degree .list .item:nth-child(2) .amount {
  background-color: #f4d03f;
}
.result-distribution .degree .list .item:nth-child(2) .name {
  color: #d68910;
}
.result-distribution .degree .list .item:nth-child(3) .name,
.result-distribution .degree .list .item:nth-child(3) .amount {
  background-color: #eb984e;
}
.result-distribution .degree .list .item:nth-child(3) .name {
  color: #935116;
}
.result-distribution .degree .list .item:nth-child(4) .name,
.result-distribution .degree .list .item:nth-child(4) .amount {
  background-color: #ec7063;
}
.result-distribution .degree .list .item:nth-child(4) .name {
  color: #943126;
}
.result-distribution .degree .list .item:nth-child(5) .name,
.result-distribution .degree .list .item:nth-child(5) .amount {
  background-color: #cd6155;
}
.result-distribution .degree .list .item:nth-child(5) .name {
  color: #7b241c;
}

.result-distribution .type {
  position: relative;
  color: #e74c3c;
}
.result-distribution .type p {
  text-indent: 1.3em;
}

.result-distribution .type .data {
  margin-top: 10px;
  display: flex;
}
.result-distribution .type .data .chart {
  width: 400px;
  height: 350px;
}
.result-distribution .type .data table {
  margin-left: 10px;
  flex: 1;
  color: #e74c3c;
}
.result-distribution .type .data table tr th {
  background-color: #f5b7b1;
  font-weight: 600;
}
.result-distribution .type .data table tr:nth-child(odd) {
  background: #f5b7b1;
}
.result-distribution .type .data table tr:nth-child(even) {
  background: #fadbd8;
}
</style>