<template>
  <div class="item result-distribution">
    <div
      class="chart card"
      id="sum"
    ></div>
    <div
      class="chart card"
      id="zombie-dis"
    ></div>
    <div
      class="chart card col-2"
      id="type-dis"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      charts: [],
      zombieDis: [],
      typeDis: [],
    }
  },
  props: ['data', 'zombie', 'normal', 'features'],
  methods: {
    draw() {
      this.draw_sum()
      if (this.zombie.length === 0) return
      this.draw_zombie_dis()
      this.draw_type_dis()
    },
    cal_zombieDis() {
      this.zombieDis = [
        { name: 'Ⅰ类', value: 0 },
        { name: 'Ⅱ类', value: 0 },
        { name: 'Ⅲ类', value: 0 },
        { name: 'Ⅳ类', value: 0 },
        { name: 'Ⅴ类', value: 0 },
      ]
      this.zombie.forEach((item) => {
        item.zombie_type.forEach((type) => {
          this.zombieDis[type - 1].value++
        })
      })
    },
    cal_typeDis() {
      this.typeDis = [
        { name: '0-0.2', value: 0 },
        { name: '0.2-0.4', value: 0 },
        { name: '0.4-0.6', value: 0 },
        { name: '0.6-0.8', value: 0 },
        { name: '0.8-1', value: 0 },
      ]
      this.data.forEach((item) => {
        for (let i = 1; i <= 5; i++)
          if (item.zombie_level < 0.2 * i && item.zombie_level !== 0) {
            this.typeDis[i - 1].value++
            break
          }
      })
    },
    draw_sum() {
      // 计算
      const sum = this.zombie.length + this.normal.length
      const zombiePro = ((this.zombie.length / sum) * 100).toFixed(1) + '%'
      const normalPro = ((this.normal.length / sum) * 100).toFixed(1) + '%'
      let option = {
        title: {
          text: '数量分布',
          left: '0',
        },
        tooltip: {
          formatter: (params) => {
            return `
										 ${params.marker}${params.name}<br>
										 总数: ${params.data.value}家<br>
										 占比: ${((params.data.value / sum) * 100).toFixed(1)}%
									 `
          },
        },
        legend: {
          right: 5,
          orient: 'vertical',
          icon: 'circle',
          selectedMode: false,
          textStyle: {
            fontSize: 14,
          },
          formatter: (name) => {
            let str = name + ' '
            return name === '正常企业' ? str + normalPro : str + zombiePro
          },
        },
        series: [
          {
            name: '数量分布',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              fontSize: 16,
              fontWeight: 600,
              formatter: (params) => {
                return `${params.data.value}家`
              },
            },
            data: [
              {
                name: '僵尸企业',
                value: this.zombie.length,
                itemStyle: {
                  color: '#e86452',
                },
              },
              {
                name: '正常企业',
                value: this.normal.length,
                itemStyle: {
                  color: '#5ad8a6',
                },
              },
            ],
          },
        ],
      }
      let myChart = this.$echarts.init(document.getElementById('sum')) //初始化
      myChart.setOption(option)
      this.charts.push(myChart)
    },
    draw_zombie_dis() {
      // 僵尸类型分布
      const sum = this.zombieDis.reduce((sum, item) => {
        return sum + item.value
      }, 0)
      const pro = {}
      const selected = {}
      this.zombieDis.forEach((item) => {
        if (item.value === 0) {
          pro[item.name] = '0%'
          selected[item.name] = false
        } else {
          pro[item.name] = ((item.value / sum) * 100).toFixed(2) + '%'
          selected[item.name] = true
        }
      })
      let option = {
        title: {
          text: '僵尸类型分布',
          left: '0',
          subtext: '一个企业可能会被判别为多种僵尸类型',
        },
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
          data: this.zombieDis,
        },
      }
      let myChart = this.$echarts.init(document.getElementById('zombie-dis')) //初始化
      myChart.setOption(option)
      this.charts.push(myChart)
    },
    draw_type_dis() {
      // 僵尸程度分布
      const sum = this.typeDis.reduce((sum, item) => {
        return sum + item.value
      }, 0)
      let option = {
        title: {
          text: '僵尸程度分布',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params) => {
            return `
							${params[0].marker} ${params[0].name}<br>
							数量: ${params[0].value}家<br>
							占比: ${((params[0].value / sum) * 100).toFixed(1)}%
						`
          },
        },
        xAxis: {
          name: '僵尸程度',
          type: 'category',
          data: ['0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1'],
        },
        yAxis: {
          type: 'value',
          name: '数量',
        },
        series: [
          {
            name: '僵尸程度分布',
            type: 'bar',
            barWidth: '40%',
            itemStyle: {
              normal: {
                color: (params) => {
                  const colors = [
                    '#FFB5B5',
                    '#ff7575',
                    '#FF2D2D',
                    '#CE0000',
                    '#930000',
                  ]
                  return colors[params.dataIndex]
                },
              },
            },
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              fontSize: 16,
              formatter: (param) => {
                if (param.data.value === 0) return ''
                else return `${param.data.value}家`
              },
            },
            data: this.typeDis,
          },
        ],
      }
      let myChart = this.$echarts.init(document.getElementById('type-dis')) //初始化
      myChart.setOption(option)
      this.charts.push(myChart)
    },
  },
  created() {
    this.cal_zombieDis()
    this.cal_typeDis()
  },
}
</script>

<style scoped>
.result-distribution {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  overflow: hidden;
}
.result-distribution .chart {
  height: 400px;
}
.result-distribution .chart.col-2 {
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>