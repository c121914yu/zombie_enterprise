<template>
  <div class="result">
    <div style="backgroundColor:#F7F9F9">
      <div class="content header">
        <h3><i class="iconfont icon-dian"></i>识别结果</h3>
        <div class="navs">
          <div
            class="item"
            :class="index === currentNav ? 'active' : ''"
            v-for="(item,index) in navs"
            :key="item"
            @click="currentNav=index"
          >
            {{item}}
          </div>
          <checkID
            v-if="currentNav === 1 && zombie.length>0"
            :zombie="zombie"
            @changeIndex="changeIndex"
          ></checkID>
        </div>
        <span><strong>运行时间: {{result.time}}s</strong></span>
      </div>
    </div>
    <!-- 画像分布 -->
    <resultDis
      ref="distribution"
      v-if="currentNav === 0"
      :data="data"
      :normal="normal"
      :zombie="zombie"
      :features="features"
    ></resultDis>

    <!-- 画像详情 -->
    <resultDetail
      ref="detail"
      v-if="currentNav === 1 && zombie.length>0"
      :data="[...result.data]"
      :zombie="zombie"
      :currentIndex="currentIndex"
      :features="features"
    ></resultDetail>

    <!-- 多图并列 -->
    <resultCompare
      ref="compare"
      v-if="currentNav === 2 && zombie.length>1"
      :data="zombie"
      :features="features"
    ></resultCompare>
  </div>
</template>

<script>
/* 
	EBit：息税前利润
	Lev:负债率
	debt_inc：负债增长率
	profit_inc：净利润增长率
	inter_cover:利息保障倍数
	grant_profit:政府补贴依赖程度
*/
import typeTable from '../typeTable.vue'
import resultDis from './Result_dis'
import resultDetail from './Result_detail'
import resultCompare from './Result_compare'
import checkID from './CheckID'
export default {
  data() {
    return {
      navs: ['画像分布', '画像详情', '画像比较'],
      currentNav: 0, // 分布/详情/并列
      currentIndex: 0, // 选中企业的下标
      data: [],
      normal: [],
      zombie: [],
      features: [],
    }
  },
  props: {
    result: Object,
  },
  watch: {
    currentNav: 'changeNav',
  },
  methods: {
    changeNav() {
      setTimeout(() => {
        if (this.currentNav === 0) {
          this.$refs.distribution.draw()
        } else if (this.currentNav === 1) {
          this.$refs.detail.draw()
        }
      })
    },
    changeIndex(i) {
      //修改选择企业id
      this.currentIndex = i
      this.changeNav()
    },
    cal_sum() {
      // 计算总分布情况
      this.data.forEach((item) => {
        if (item.final_pre === 1) this.zombie.push(item)
        else this.normal.push(item)
      })
      for (let key in this.data[0].featured_data[0]) {
        if (key != 'year') this.features.push(key)
      }
    },
  },
  created() {
    this.data = [...this.result.data]
    console.log(this.data)
    this.cal_sum()
  },
  mounted() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      delay: 100,
      anchorPlacement: 'top-bottom',
      once: true,
    })
    this.changeNav(this.currentNav)
  },
  components: {
    typeTable,
    checkID,
    resultCompare,
    resultDis,
    resultDetail,
  },
}
</script>

<style >
.result {
  position: relative;
  height: 100%;
}
.result .content {
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  padding: 20px 0;
}

.result .header {
  color: #7b7d7d;
  display: flex;
  align-items: flex-end;
}
.result .header span {
  margin-left: 10px;
}
.result .header .navs {
  margin-left: 15px;
  flex: 1;
  display: flex;
}
.result .header .navs > .item {
  margin-right: 15px;
  height: 35px;
  line-height: 35px;
  padding: 0 10px;
  cursor: pointer;
}
.result .header .navs > .item.active {
  background-color: #797d7f;
  color: #ffffff;
  border-radius: 5px;
}

.result .icon-dian {
  margin-right: 5px;
  animation: flicker 1.5s infinite;
  filter: brightness(110%);
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
