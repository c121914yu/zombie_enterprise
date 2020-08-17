<template>
  <div class="item detail">
    <ul class="describe card">
      <h3 class="center">画像描述</h3>
      <li>该企业为 <strong>{{describeInfo.type}}</strong>僵尸企业</li>
      <li>判断为僵尸的概率高达 <strong>{{describeInfo.zombie_pro}}</strong></li>
      <div v-html="describeInfo.feature_des"></div>
    </ul>
    <div
      class="chart card"
      id="type"
    ></div>
    <div class="card">
      <p class="center">特征贡献色块-cnn模型</p>
      <p class="remark">包含81个特征对判断为僵尸企业的贡献度，每个色块代表一个特征，<strong style="color: #e86452;">红色</strong>越深表示贡献度越大。</p>
      <ul class="grad-cam center">
        <li
          class="center"
          :class="item.value === 0 ? '' : 'contribute'"
          :style="item.value === 0 ? 'border:var(--border1)' : `background-color: rgba(206,0,0,${item.value*0.9+0.1})`"
          v-for="(item,index) in describeInfo.grad_cam"
          :key="index"
          @click="getFeatureIndex(item.text)"
        >
          <div class="message">{{item.text}}: {{item.value}}</div>
        </li>
      </ul>
    </div>
    <div class="card">
      <p class="center">特征贡献色块-stacking模型</p>
      <p class="remark">包含81个特征对判断为僵尸企业的贡献度，每个色块代表一个特征，<strong style="color: #e86452;">红色</strong>越深表示贡献度正影响越大，<strong style="color: #1e9493;">绿色</strong>代表对贡献度负影响越大。</p>
      <ul class="grad-cam center">
        <li
          class="center"
          :class="item.value === 0 ? '' : 'contribute'"
          :style="item.value > 0  ? `background-color: rgba(206,0,0,${item.value*0.9+0.1})` : item.value === 0 ? 'border:var(--border1)' : `background-color: rgba(30,148,147,${-item.value*0.9+0.1})`"
          v-for="(item,index) in describeInfo.contribute_matrix"
          :key="index"
          @click="getFeatureIndex(item.text)"
        >
          <div class="message">{{item.text}}: {{item.value}}</div>
        </li>
      </ul>
    </div>
    <div class="card col-2 feature">
      <i
        class="iconfont icon-last"
        @click="changeFeatureIndex(-1)"
      ></i>
      <div
        class="chart"
        id="feature-data"
      ></div>
      <i
        class="iconfont icon-next"
        @click="changeFeatureIndex(1)"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      describeInfo: {},
      currentFeature: 0,
      typeChart: '',
      featureChart: '',
    }
  },
  props: ['data', 'zombie', 'currentIndex', 'features'],
  methods: {
    draw() {
      if (this.typeChart) this.typeChart.clear()
      if (this.featureChart) this.featureChart.clear()
      this.cal_enterpriseInfo()
      this.draw_type(this.zombie[this.currentIndex].zombie_level)
      this.reDraw_feature()
    },
    cal_enterpriseInfo() {
      const enterprise = this.zombie[this.currentIndex]
      if (!enterprise) {
        return
      }
      this.describeInfo = {
        id: enterprise.company_id,
        zombie_pro: (enterprise.zombie_pro * 100).toFixed(2) + '%',
        grad_cam: enterprise.grad_cam,
        contribute_matrix: enterprise.contribute_matrix,
        feature_des: '',
      }
      // 僵尸类型
      this.describeInfo.type = enterprise.zombie_type
        .map((item) => {
          switch (item) {
            case 1:
              return 'Ⅰ类'
            case 2:
              return 'Ⅱ类'
            case 3:
              return 'Ⅲ类'
            case 4:
              return 'Ⅳ类'
            case 5:
              return 'Ⅴ类'
          }
        })
        .join(',')
      // 特征描述
      const features = enterprise.zombie_type_featrues
      if (features.debt_inc < 0 && features.profit_inc > 0 && features.Ebit < 0)
        this.describeInfo.feature_des +=
          '<li>经营状态有好转趋势，负债率下降，亏损减少</li>'
      if (features.EBit > 0)
        this.describeInfo.feature_des += '<li>日常经营活动能产生利润</li>'
      else this.describeInfo.feature_des += '<li>日常经营活动亏损</li>'
      if (features.grant_profit > 0)
        this.describeInfo.feature_des += '<li>需要政府补贴来维持经营状态</li>'
      else this.describeInfo.feature_des += '<li>政府补贴也挽回不了亏损</li>'
      if (features.grant_defit < 0.3)
        this.describeInfo.feature_des += '<li>政府补贴弥补超过30%的亏损</li>'
      if (features.inner_cover < 1)
        this.describeInfo.feature_des += '<li>息税前利润不足以支付贷款利息</li>'
      if (features.debt_inc > 0)
        this.describeInfo.feature_des +=
          '<li>经营状态持续恶化，资产负债率增加</li>'
    },
    changeFeatureIndex(i) {
      let temp = this.currentFeature
      temp += i
      if (temp >= this.features.length) temp = 0
      else if (temp < 0) temp = this.features.length - 1
      this.currentFeature = temp
      this.reDraw_feature()
    },
    getFeatureIndex(key) {
      let index = this.features.indexOf(key)
      if (index > -1) {
        this.currentFeature = index
        this.reDraw_feature()
      }
    },
    reDraw_feature() {
      if (this.featureChart) {
        this.featureChart.clear()
        this.featureChart = ''
      }
      this.draw_featureData(this.zombie[this.currentIndex].featured_data)
    },

    draw_type(data) {
      // 僵尸程度
      const val = Math.round((data * 100).toFixed(2))
      let option = {
        title: {
          text: '僵尸程度',
          left: 'center',
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
          name: '僵尸程度%',
        },
        series: [
          {
            name: '僵尸程度',
            type: 'bar',
            barWidth: '10%',
            barGap: '-100%',
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#930000' },
                { offset: 0.4, color: '#CE0000' },
                { offset: 0.6, color: '#FF2D2D' },
                { offset: 0.8, color: '#ff7575' },
                { offset: 1, color: '#FFB5B5' },
              ]),
            },
            markLine: {
              silent: true,
              animationDuration: 600,
              lineStyle: {
                type: 'solid',
                width: 3,
              },
              data: [
                [
                  {
                    x: '10%',
                    coord: [0, val],
                    symbol: 'none',
                  },
                  {
                    x: '46%',
                    coord: [0, val],
                    value: val,
                    symbolSize: 12,
                    symbolOffset: [0, '20%'],
                    label: {
                      position: 'middle',
                    },
                  },
                ],
              ],
            },
            data: [100],
          },
        ],
      }
      this.typeChart = this.$echarts.init(document.getElementById('type')) //初始化
      this.typeChart.setOption(option)
    },
    draw_featureData(feature) {
      // 僵尸企业特征
      const feature_key = this.features[this.currentFeature]
      let data_year = [],
        data = []
      feature.forEach((item) => {
        data_year.push(item.year + '年')
        data.push(item[feature_key].toFixed(2))
      })
      let option = {
        title: {
          text: feature_key,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          name: '年份',
          type: 'category',
          boundaryGap: false,
          data: data_year,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: feature_key,
            type: 'line',
            itemStyle: {
              color: '#1e9493',
            },
            areaStyle: {
              color: 'rgba(30,148,147,0.5)',
            },
            animationDuration: 600,
            data: data,
          },
        ],
      }
      this.featureChart = this.$echarts.init(
        document.getElementById('feature-data')
      ) //初始化
      this.featureChart.setOption(option)
    },
  },
}
</script>

<style>
.detail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
.detail .chart {
  min-height: 350px;
  height: 100%;
  overflow: hidden;
}
.detail .describe {
  padding-left: 25px;
  list-style: disc;
}
.detail .grad-cam {
  margin-top: 5px;
  width: 270px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 5px;
  padding: 0;
}
.detail .grad-cam li {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  position: relative;
  font-size: 1em;
  z-index: 11;
  transition: var(--hover-speed);
}
.detail .grad-cam li.contribute {
  background-color: #ffffff;
  transition: var(--hover-speed);
}
.detail .grad-cam li.contribute:hover {
  transform: scale(1.3);
  cursor: pointer;
}
.detail .grad-cam li .message {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-80%, -120%);
  width: 150px;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: var(--box-shadow1);
  color: #ffffff;
  padding: 5px;
  border-radius: 5px;
  cursor: default;
  transition: 0.2s;
  display: none;
}
.detail .grad-cam li:hover .message {
  display: block;
}
.detail .feature {
  grid-column-start: 2;
  grid-column-end: 4;
  display: flex;
  align-items: center;
}
.detail .feature i {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.4em;
  background-color: rgba(30, 148, 147, 0.8);
  cursor: pointer;
}
.detail .feature .chart {
  flex: 1;
}
</style>