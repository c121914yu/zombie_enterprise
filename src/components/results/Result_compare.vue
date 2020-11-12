<template>
  <div class="compare">
    <div style="backgroundColor:#FADBD8">
      <div class="content row1">
        <div class="card check-id">
          <div class="id-list">
            <div
              class="id"
              :class="item.checked ? 'active':''"
              v-for="(item, index) in idList"
              :key="index"
              @click="checkId(index)"
            >{{item.id}}</div>
          </div>
          <div class="btns">
            <button
              style="backgroundColor:#e74c3c"
              @click="compare"
            >比较</button>
            <button
              style="backgroundColor:#5d7092"
              @click="reset"
            >重置</button>
          </div>
        </div>
        <!-- 僵尸程度 -->
        <div
          class="chart"
          :style="degreeChart ? '':'opacity:0'"
          id="degree"
        ></div>
      </div>
    </div>

    <!-- 画像描述 -->
    <div
      style="backgroundColor:#FCF3CF"
      v-if="describes.length>0"
    >
      <div class="content describe">
        <ul
          :style="i<=describes.length ? '':'opacity:0'"
          v-for="i in 3"
          :key="i"
        >
          <div v-if="i<=describes.length">
            <h3 class="center">{{describes[i-1].id}}画像</h3>
            <li><strong>{{describes[i-1].type}}</strong>异常企业</li>
            <li>判断为异常企业的概率高达 <strong>{{describes[i-1].zombie_pro}}</strong></li>
            <div v-html="describes[i-1].feature_des"></div>
          </div>
        </ul>
      </div>

    </div>

    <!-- 特征方块-cnn -->
    <div
      style="backgroundColor:#EAEDED"
      v-if="describes.length>0"
    >
      <h3 class="content"><i class="iconfont icon-dian"></i>企业风险色块——cnn</h3>
      <div class="content grid">
        <div
          class="item"
          :style="i<=describes.length ? '':'opacity:0'"
          v-for="i in 3"
          :key="i+3*1"
        >
          <div v-if="i<=describes.length">
            <p class="center"><strong>特征贡献色块-cnn模型</strong></p>
            <p class="remark center"><strong style="color: #e86452;">红色</strong>越深表示影响度越大。</p>
            <ul class="grad-cam center">
              <li
                v-for="(item,index) in describes[i-1].grad_cam"
                :key="index"
                class="center"
                :class="item.value === 0 ? '' : 'contribute'"
                :style="[
              {
                border: item.value === 0 ? 'var(--border1)' : ''
              },  
              {
                backgroundColor: item.value !== 0 ? `rgba(206,0,0,${item.value*0.9+0.1})` : ''
              },
              {
                transform: hoverIndex_cnn === index ? 'scale(1.3)': 'scale(1)'
              }
            ]"
                @click="getFeatureIndex(item.text)"
                @mouseenter="hoverIndex_cnn=index"
                @mouseleave="hoverIndex_cnn=null"
              >
                <div
                  class="message"
                  :style="hoverIndex_cnn === index ? 'display:block':''"
                >{{item.text}}: {{item.value}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 特征贡献色块-stacking模型 -->
    <div
      style="backgroundColor:#FBFCFC"
      v-if="describes.length>0"
    >
      <h3 class="content"><i class="iconfont icon-dian"></i>企业风险色块——stacking</h3>
      <div class="content grid">
        <div
          :style="i<=describes.length ? '':'opacity:0'"
          class="item"
          v-for="i in 3"
          :key="i+3*2"
        >
          <div v-if="i<=describes.length">
            <p class="center"><strong>特征影响色块-stacking模型</strong></p>
            <p class="remark center"><strong style="color: #e86452;">红色</strong>越深表示正影响越大,<strong style="color: #1e9493;">绿色</strong>表示负影响越大。</p>
            <ul class="grad-cam center">
              <li
                class="center"
                :class="item.value === 0 ? '' : 'contribute'"
                :style="[
              {
                border: item.value === 0 ? 'var(--border1)' : ''
              },  
              {
                backgroundColor: item.value > 0 ? `rgba(206,0,0,${item.value*0.9+0.1})` : item.value !== 0 ? `rgba(30,148,147,${-item.value*0.9+0.1})` : ''
              },
              {
                transform: hoverIndex_stacking === index ? 'scale(1.3)': 'scale(1)'
              }
            ]"
                v-for="(item,index) in describes[i-1].contribute_matrix"
                :key="index"
                @click="getFeatureIndex(item.text)"
                @mouseenter="hoverIndex_stacking=index"
                @mouseleave="hoverIndex_stacking=null"
              >
                <div
                  class="message"
                  :style="hoverIndex_stacking === index ? 'display:block':''"
                >{{item.text}}: {{item.value}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 特征曲线 -->
    <div
      style="backgroundColor:#D0ECE7"
      v-if="describes.length>0"
    >
      <h3
        class="content"
        style="color:#16A085;padding:10px 0 0"
      ><i class="iconfont icon-dian"></i>{{features[currentFeature]}}</h3>
      <div
        class="content feature"
        :style="featureChart ? '':'opacity:0'"
      >
        <i
          class="iconfont icon-last"
          @click="changeFeatureIndex(-1)"
        ></i>
        <div
          class="chart"
          id="feature"
        ></div>
        <i
          class="iconfont icon-next"
          @click="changeFeatureIndex(1)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idList: [],
      checkedAmount: 0, //选中数量
      checkedEnterprise: [], //选择的企业
      describes: [], // 描述信息
      hoverIndex_cnn: null,
      hoverIndex_stacking: null,
      degreeChart: null,
      currentFeature: 0, //当前特征下标
      featureChart: null,
    }
  },
  props: ['data', 'features'],
  methods: {
    checkId(i) {
      const item = this.idList[i]
      if (!item.checked && this.checkedAmount >= 3) {
        this.$showToast({
          type: 'warn',
          text: '至多选择3个企业',
        })
        return
      }
      if (item.checked) this.checkedAmount--
      else this.checkedAmount++
      this.idList[i].checked = !item.checked
    },
    reset() {
      this.idList.forEach((item) => (item.checked = false))
      this.checkedAmount = 0
    },
    compare() {
      this.describes = []
      this.checkedEnterprise = []
      for (let i = 0; i < this.idList.length; i++)
        if (this.idList[i].checked) {
          const data = this.data[i]
          this.cal_describesInfo(data) // 描述
          this.checkedEnterprise.push({
            id: data.id,
            val: Math.round((data.zombie_level * 100).toFixed(2)), // 取整数百分比
            features: data.featured_data,
          })
        }
      this.draw_degree()
      this.reDraw_feature()
    },
    cal_describesInfo(enterprise) {
      let describeInfo = {
        id: enterprise.id,
        zombie_pro: (enterprise.zombie_pro * 100).toFixed(2) + '%',
        grad_cam: enterprise.grad_cam,
        contribute_matrix: enterprise.contribute_matrix,
        feature_des: '',
      }

      // 僵尸类型
      describeInfo.type = enterprise.zombie_type
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
        describeInfo.feature_des +=
          '<li>经营状态有好转趋势，负债率下降，亏损减少</li>'
      if (features.EBit > 0)
        describeInfo.feature_des += '<li>日常经营活动能产生利润</li>'
      else describeInfo.feature_des += '<li>日常经营活动亏损</li>'
      if (features.grant_profit > 0)
        describeInfo.feature_des += '<li>需要政府补贴来维持经营状态</li>'
      else describeInfo.feature_des += '<li>政府补贴也挽回不了亏损</li>'
      if (features.grant_defit < 0.3)
        describeInfo.feature_des += '<li>政府补贴弥补超过30%的亏损</li>'
      if (features.inner_cover < 1)
        describeInfo.feature_des += '<li>息税前利润不足以支付贷款利息</li>'
      if (features.debt_inc > 0)
        describeInfo.feature_des += '<li>经营状态持续恶化，资产负债率增加</li>'
      this.describes.push(describeInfo)
    },
    // 获取方块下标
    getFeatureIndex(key) {
      let index = this.features.indexOf(key)
      if (index > -1) {
        this.currentFeature = index
        this.reDraw_feature()
      }
    },
    changeFeatureIndex(i) {
      let temp = this.currentFeature
      temp += i
      if (temp >= this.features.length) temp = 0
      else if (temp < 0) temp = this.features.length - 1
      this.currentFeature = temp
      this.reDraw_feature()
    },
    // 重新绘制特征图线
    reDraw_feature() {
      if (this.featureChart) {
        this.featureChart.clear()
        this.featureChart = null
      }
      setTimeout(() => {
        this.draw_featureData()
      })
    },
    // 绘制僵尸程度
    draw_degree() {
      let option = {
        xAxis: {
          type: 'category',
          data: this.checkedEnterprise.map((item) => item.id),
        },
        yAxis: {
          type: 'value',
          name: '异常程度%',
          nameTextStyle: {
            color: '#e74c3c',
            fontSize: 16,
          },
        },
        series: [
          {
            name: '异常程度',
            type: 'bar',
            barWidth: '30%',
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
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              fontSize: 16,
              color: '#e74c3c',
              formatter: (param) => {
                if (param.data === 0) return '0%'
                else return `${param.data}%`
              },
            },
            data: this.checkedEnterprise.map((item) => item.val),
          },
        ],
      }
      this.degreeChart = this.$echarts.init(document.getElementById('degree')) //初始化
      this.degreeChart.setOption(option)
    },
    // 绘制特征曲线
    draw_featureData() {
      // 僵尸企业特征
      const feature_key = this.features[this.currentFeature]
      let data_year = [],
        data = []
      this.checkedEnterprise.forEach((enterprise, i) => {
        data[i] = {
          id: enterprise.id,
          val: [],
        }
        enterprise.features.forEach((item) => {
          if (i === 0) data_year.push(item.year + '年')
          data[i].val.push(item[feature_key].toFixed(2))
        })
      })

      let option = {
        legend: {
          right: 0,
          data: data.map((item) => item.id.toString()),
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
        grid: {
          x: 70,
          y: 40,
          x2: 40,
          y2: 20,
        },
        series: data.map((item) => {
          return {
            name: item.id,
            type: 'line',
            animationDuration: 600,
            data: item.val,
          }
        }),
      }
      this.featureChart = this.$echarts.init(document.getElementById('feature')) //初始化
      this.featureChart.setOption(option)
    },
  },
  created() {
    this.idList = this.data.map((item) => {
      return {
        id: item.id,
        checked: false,
      }
    })
    // console.log(this.data)
  },
}
</script>

<style scoped>
.compare .content {
  display: flex;
}
.compare h3.content {
  padding: 10px 0 0 0;
}

.compare .row1 .chart {
  flex: 1;
  height: 300px;
}
.compare .row1 .check-id {
  width: 50%;
  max-width: 400px;
  height: 300px;
}
.compare .row1 .check-id .id-list {
  height: 250px;
  color: #e74c3c;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: auto;
}
.compare .row1 .check-id .id-list .id {
  margin: 5px auto;
  width: 80%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid#e74c3c;
  border-radius: 5px;
  cursor: pointer;
}
.compare .row1 .check-id .id-list .id:hover {
  color: #fff;
  background-color: rgba(231, 77, 60, 0.8);
}
.compare .row1 .check-id .id-list .id.active {
  color: #fff;
  background-color: #e74c3c;
}
.compare .row1 .check-id .btns {
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.compare .row1 .check-id .btns button {
  width: 30%;
}
.compare .row1 .check-id .id-list::-webkit-scrollbar-track {
  background: #fdedec;
  border-radius: 5px;
}
.compare .row1 .check-id .id-list::-webkit-scrollbar-thumb {
  background-color: #e74c3c;
}
.compare .row1 .check-id .id-list::-webkit-scrollbar-thumb:hover {
  background-color: #e74c3c;
}

.compare .describe {
  min-height: 220px;
  color: #f39c12;
}
.compare .describe ul {
  margin: 0 10px;
  flex: 1;
  list-style: disc;
  padding: 10px 0 10px 20px;
  border: 1px solid #f39c12;
  border-radius: 10px;
}

.compare .grid .item {
  flex: 1;
  color: #4d5656;
}
.compare .grid .item p {
  white-space: pre-line;
}

.compare.compare .grad-cam {
  margin-top: 5px;
  width: 270px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: 5px;
  padding: 0;
}
.compare .grad-cam li {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  position: relative;
  font-size: 1em;
  z-index: 11;
}
.compare .grad-cam li.contribute {
  background-color: #ffffff;
  transition: var(--hover-speed);
  cursor: pointer;
}
.compare .grad-cam li .message {
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
  display: none;
  white-space: nowarp;
}

.compare .feature {
  height: 300px;
  max-width: 900px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.compare .feature i {
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
.compare .feature .chart {
  height: 100%;
  flex: 1;
}
</style>