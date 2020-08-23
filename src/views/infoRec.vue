<template>
  <div class="info-res">
    <!-- 操作说明 -->
    <header style="backgroundColor:#D4E6F1">
      <div class="content explain">
        <h3><i class="iconfont icon-dian"></i>所需信息</h3>
        <p>僵尸企业识别需要提供企业三年的数据信息,包含企业所属行业，类型，所属区域，控制人类型等28个信息。</p>

        <h3><i class="iconfont icon-dian"></i>数据填写方式</h3>
        <p>通过点击<strong>增加企业</strong>可以增加一组空白企业信息进行手动填写；也可以通过<strong>csv导入</strong>从文件中批量导入数据,导入数据将自动填写至输入框,可根据需要进行修改或填补。
          <a
            href="http://load.jinlongyuchitang.cn/temp.csv?attname="
            target="_blank"
          >
            <strong>csv文件模板</strong>
          </a>
          导入数据注意事项:
        </p>
        <ul>
          <li>首行标题文本请勿删除。</li>
          <li>可根据需求划分为多个文件,但必须保证第一列为企业的唯一ID。</li>
          <li>保存为csv UTF-8(逗号分隔)格式。</li>
        </ul>

        <h3><i class="iconfont icon-dian"></i>三种模型</h3>
        <p>系统提供3种模型使用，不同模型运算的时间不同，可以选择单个模型或者联合多个模型使用:</p>
        <ul>
          <li>CNN: 基于grad_cam的特征贡献矩阵,可获取:僵尸程度,企业画像文字描述,同类企业推荐,详细企业画像。</li>
          <li>stacking: 基于shap和模型特征重要度的特征贡献矩阵,可获取:僵尸程度,企业画像文字描述,同类企业推荐,详细企业画像,特征贡献矩阵。</li>
          <li>deeptree: 基于shap和模型特征重要度的特征贡献矩阵,可获取:僵尸程度,企业画像文字描述,同类企业推荐,详细企业画像。</li>
        </ul>

        <h3><i class="iconfont icon-dian"></i>识别结果</h3>
        <ol>
          <li>对所有企业画像分布的统计，包括数量、类型、程度分布。</li>
          <li>每个企业的详细画像，包括企业画像的文字描述，具体僵尸程度值，不同特征值对结果的影响，不同特征的具体值。</li>
          <li>可以选择至多3个企业进行同屏并列比较。</li>
        </ol>
      </div>
    </header>

    <!-- 内容输入 -->
    <div style="backgroundColor:#A3E4D7">
      <div class="content container">
        <div class="slide">
          <h3><i class="iconfont icon-dian"></i>企业信息</h3>
          <label class="check-file btn">
            <input
              type="file"
              @change="checkFile"
              multiple
            >
            csv导入
          </label>

          <div
            class="btn"
            @click="addEn"
          >
            增加企业
          </div>

          <div
            v-if="resultID.length > 0"
            class="btn"
            @click="removeEn"
          >
            删除当前企业
          </div>

          <div
            v-if="resultID.length > 0"
            class="btn"
            :class="isOperate ? 'active' : ''"
            @click="isOperate=!isOperate"
          >
            {{isOperate ? "隐藏输入" : "手动填写"}}
          </div>

          <div
            class="id"
            v-if="Data[currentIndex]"
          >
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
              @click="search=!search"
            >
            </i>
            <div
              v-if="search"
              class="search-list"
            >
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

          <div
            class="page"
            v-show="resultID.length > 0"
          >
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
          :style="isOperate ? 'max-height: 5000px' : 'max-height: 0'"
        >
          <p class="remark">金额单位: 万元人民币</p>
          <!-- 年份选择 -->
          <div class="years">
            <p
              title="复制第一年数据"
              class="copy btn"
              @click="copy"
            >拷贝</p>
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
          <div class="content">
            <div
              class="item"
              v-for="item in selects"
              :key="item.text"
            >
              <p>{{item.text}}</p>
              <Select
                :list="item.list"
                :placeholder="item.text"
                v-model="Data[currentIndex][currentYear][item.model]"
                @update="update()"
              >
              </Select>
            </div>
            <div
              v-if="index2!=0"
              class="item"
              v-for="(item,index2) in inputs"
              :key="index2"
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
          <checkBox
            class="checkBox"
            :models="models"
          ></checkBox>
          <check
            class="check"
            v-model="is_impute"
          ></check>
          <button @click="submit">提交</button>
        </div>
      </div>
    </div>

    <result
      v-if="resultData"
      :result="resultData"
    ></result>
  </div>
</template>

<script>
import checkBox from '../components/CheckBox.vue'
import check from '../components/Check.vue'
import Select from '../components/Select.vue'
import result from '../components/results/Result.vue'
import { Predict } from '../assets/axios/api.js'
import testData from '../assets/data2.json'
export default {
  data() {
    return {
      currentIndex: 0,
      search: false,
      searchText: '',
      currentYear: 0,
      isOperate: false, //手动填写
      is_impute: true,
      selects: [],
      inputs: [],
      models: [
        { name: 'CNN模型', active: true, param: 'use_model_CNN' },
        { name: 'stacking模型', active: true, param: 'use_model_stacking' },
        { name: 'deeptree模型', active: true, param: 'use_model_deeptree' },
      ],
      Data: [],
      resultID: [],
      fileData: [],
      resultData: null,
    }
  },
  methods: {
    update() {
      //解决层级嵌套不更新问题
      const temp = this.currentYear
      this.currentYear = ''
      this.currentYear = temp
      this.inputIndex()
    },
    inputID(e) {
      const val = e.target.value
      this.Data[this.currentIndex].forEach((item) => {
        item.ID = +val
      })
      this.update()
    },
    searchRes(id) {
      if (id != '无数据') this.getCurrentData(this.resultID.indexOf(id))
      this.search = false
      this.searchText = ''
    },
    changeIndex(index) {
      if (this.resultID.length === 0) return
      let tempIndex = this.currentIndex + index
      if (tempIndex === this.resultID.length) tempIndex = 0
      else if (tempIndex === -1) tempIndex = this.resultID.length - 1
      this.getCurrentData(tempIndex)
    },
    inputIndex(e) {
      setTimeout(() => {
        const dom = document.querySelector('.current-index')
        let len = dom.value.length
        dom.style.width = `${10 * len}px`
      })
    },
    outInputIndex(e) {
      const val = +e.target.value
      if (val > 0 && val <= this.resultID.length) this.getCurrentData(val - 1)
      else {
        this.$showToast({
          type: 'warn',
          text: '超出范围',
        })
        this.getCurrentData(this.currentIndex)
      }
    },
    addEn() {
      let ID = (+new Date()).toString().substr(8)
      while (this.resultID.indexOf(ID) > 1) {
        ID = (+new Date()).toString().substr(8)
      }
      let index = this.resultID.push(+ID)
      this.getCurrentData(index - 1)
    },
    removeEn() {
      this.resultID.splice(this.currentIndex, 1)
      this.Data.splice(this.currentIndex, 1)
      this.changeIndex(-1)
    },
    checkFile(e) {
      if (e.target.files.length === 0) return
      //选择文件
      let load = this.$loading()
      this.Data.forEach((item) => {
        item[0].loaded = false
      })
      let worker = new Worker('./computedID.js')
      worker.postMessage({
        files: Array.from(e.target.files),
        resultID: this.resultID,
      })
      worker.onmessage = (e) => {
        worker.terminate()
        this.fileData = this.fileData.concat(e.data.fileData)
        this.resultID = e.data.resultID
        load.hide()
        this.getCurrentData(this.currentIndex)
      }
    },
    getCurrentData(index) {
      //获取当前企业的信息
      let enterprise
      // 如果当前下标的<已加载的数据长度，则直接显示
      if (this.Data[index] && index < this.Data.length) {
        if (this.Data[index][0].loaded === true) {
          this.currentIndex = index
          this.update()
          return
        } else {
          enterprise = this.Data[index]
          enterprise[0].loaded = true
        }
      } else {
        let param = this.$store.state.param
        let ID = this.resultID[index]
        enterprise = [
          { ...param, ID, loaded: true },
          { ...param, ID },
          { ...param, ID },
        ]
      }

      let load = this.$loading()
      let worker = new Worker('./getEnterpriseData.js')
      worker.postMessage({
        enterprise,
        tempArr: [].concat(this.selects, this.inputs),
        fileData: this.fileData,
      })
      worker.onmessage = (e) => {
        worker.terminate()
        setTimeout(() => {
          load.hide()
        }, 200)
        this.Data[index] = e.data.enterprise
        this.currentIndex = index
        this.currentYear = 0
        this.isOperate = false
        this.isOperate = true
        this.update()
      }
    },
    copy() {
      //拷贝第一年信息
      this.$showModel({
        text: '确定使用第一年的数据填充当前年份空白数据？',
        cancelText: '取消',
        success: () => {
          for (let key in this.Data[this.currentIndex][0])
            if (this.Data[this.currentIndex][this.currentYear][key] === '')
              this.Data[this.currentIndex][this.currentYear][key] = this.Data[
                this.currentIndex
              ][0][key]
          this.update()
        },
      })
    },
    submit(e) {
      e.preventDefault()
      if (this.Data.length === 0) return
      let startTime = Date.now()
      let load = this.$loading()
      // 判断使用了什么模型
      const modelType = {}
      this.models.forEach((item) => {
        modelType[item.param] = item.active
      })
      let resSrt = ''
      let worker = new Worker('./cutCsv.js')
      worker.postMessage({
        resultID: this.resultID,
        Data: this.Data,
        fileData: this.fileData,
        tempArr: [].concat(this.selects, this.inputs),
        param: this.$store.state.param,
      })
      worker.onmessage = (e) => {
        const data = {
          is_impute: this.is_impute,
          ...modelType,
          merged: e.data,
        }
        console.log('字符串切割时间: ' + (Date.now() - startTime) / 1000 + 's')
        startTime = Date.now()
        setTimeout(() => {
          this.cutData(testData)
          load.hide()
        }, 1000)
        // Predict(JSON.stringify(data))
        // .then(res => {
        // 	console.log("请求运行时间: " + (new Date() - startTime) / 1000 + "s")
        // 	this.cutData(res.data)
        // 	let a = document.createElement("a")
        // 	a.download = "data.json"
        // 	let blob = new Blob([JSON.stringify(res.data,"","\t")])
        // 	a.href = URL.createObjectURL(blob)
        // 	document.body.appendChild(a)
        // 	a.click()
        // 	document.body.removeChild(a)
        // })
      }
    },
    cutData(data) {
      this.resultData = null
      setTimeout(() => {
        const modelType = {}
        this.models.forEach((item) => {
          modelType[item.param] = item.active
        })
        let result = {
          time: (data.time / 1000).toFixed(1),
          data: [],
          ...modelType,
        }
        for (let i in data.predict) {
          let predict = data.predict[i]
          let zombie_type = data.zombie_type[i] //僵尸类型
          let zombie_type_featrues = data.zombie_type_featrues[i] //僵尸特征
          delete zombie_type_featrues.ID
          delete zombie_type.ID
          // 不同模型不同的返回值
          let grad_cam = {},
            zombie_level = {},
            contribute_matrix = {}
          if (result.use_model_CNN) {
            grad_cam = data.grad_cam[i] //81个特征
            delete grad_cam.ID
          }
          if (result.use_model_stacking) {
            zombie_level = data.zombie_level[i] //僵尸程度
            contribute_matrix = data.contribute_matrix[i] //贡献度
            delete contribute_matrix.ID
          }

          const item = {
            id: predict.company_id,
            final_pre: predict.final_pre,
            zombie_pro: predict.zombie_pro,
            featured_data: [],
            zombie_type: [],
            zombie_level: zombie_level.僵尸性程度,
            grad_cam: [],
            contribute_matrix: [],
            zombie_type_featrues: zombie_type_featrues,
          }
          // 获取特征
          for (let index in data.featured_data) {
            if (item.featured_data.length >= 3) break
            const featured = { ...data.featured_data[index] }
            if (featured.company_id === item.id) {
              delete featured.company_id
              delete featured.企业类型
              delete featured.区域
              delete featured.控制人类型
              delete featured.行业
              item.featured_data.push(featured)
            }
          }
          // 获取僵尸类型
          for (let index in zombie_type) {
            if (zombie_type[index] != 0)
              switch (index) {
                case 'I':
                  item.zombie_type.push(1)
                  break
                case 'II':
                  item.zombie_type.push(2)
                  break
                case 'III':
                  item.zombie_type.push(3)
                  break
                case 'IV':
                  item.zombie_type.push(4)
                  break
                case 'V':
                  item.zombie_type.push(5)
                  break
              }
          }

          // 提取81个特征值贡献度-cnn
          for (let key in grad_cam) {
            item.grad_cam.push({
              text: this.$store.state.grad_cam_text[key],
              value: Number(grad_cam[key].toFixed(2)),
            })
          }
          // 提取81个特征值贡献度stacking
          for (let key in contribute_matrix) {
            item.contribute_matrix.push({
              text: key,
              value: Number(contribute_matrix[key].toFixed(2)),
            })
          }
          result.data.push(item)
        }
        this.resultData = result
      })
    },
  },
  computed: {
    searchID() {
      let list = this.resultID.filter((item) => {
        const reg = new RegExp(`${this.searchText}`, 'i')
        return reg.test(item)
      })
      if (this.searchText === '') list = [...this.resultID]
      if (list.length === 0) list.push('无数据')
      return list
    },
  },
  created() {
    this.selects = [...this.$store.state.selects]
    this.inputs = [...this.$store.state.inputs]
  },
  components: {
    checkBox,
    check,
    Select,
    result,
  },
}
</script>

<style scoped>
.info-res {
  min-height: 110vh;
  /* overflow-y: hidden; */
}

.info-res .content {
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  padding: 20px 0;
}

.info-res .explain {
  color: #2471a3;
}

.info-res .explain p {
  text-indent: 2em;
}
.info-res .explain a {
  color: #2471a3;
  text-decoration: underline;
}
.info-res .explain ul {
  margin-left: 2em;
  list-style: disc;
  white-space: pre-wrap;
}
.info-res .explain ul li {
  white-space: pre-wrap;
}

.info-res .container {
  position: relative;
  user-select: none;
}
.info-res .container .active,
.info-res .container .btn:hover {
  color: #ffffff;
  background-color: #17a589;
}
.info-res .container .slide {
  display: flex;
  align-items: center;
  position: relative;
  color: #17a589;
}
.info-res .container .slide .btn {
  margin-left: 15px;
  border: 1px solid #17a589;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.info-res .container .slide .id {
  margin-left: 15px;
  display: flex;
  align-items: center;
  position: relative;
}
.info-res .container .slide .id span {
  position: absolute;
  left: 5px;
  color: var(--dark-common);
}
.info-res .container .slide .id input {
  width: 170px;
  height: 35px;
  padding-left: 30px;
}
.info-res .container .slide .id .search {
  position: absolute;
  right: 5px;
  color: var(--dark-common);
  cursor: pointer;
}
.info-res .container .slide .id .search-list {
  z-index: 10;
  position: absolute;
  top: 35px;
  width: 100%;
  max-height: 165px;
  background-color: #ffffff;
  box-shadow: var(--box-shadow2);
  border-radius: 5px;
  color: var(--dark-common);
  text-align: center;
  overflow-y: scroll;
}
.info-res .container .slide .id .search-list .item {
  padding: 5px 0;
  cursor: pointer;
}
.info-res .container .slide .id .search-list .item:hover {
  background-color: #17a589;
  color: #ffffff;
}

.info-res .container .slide .page {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
}
.info-res .container .slide .page i {
  margin: 0 5px;
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
}
.info-res .container .slide .page .current-index {
  width: 14px;
  padding: 0;
  background-color: transparent;
  border: 0;
  text-align: right;
}

.info-res form {
  margin-top: 5px;
  position: relative;
  overflow-y: hidden;
  transition: height var(--hover-speed);
}
.info-res form .remark {
  font-size: 0.9em;
  color: var(--dark-remark);
}

.info-res form .years {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
}
.info-res form .years .copy {
  padding: 0 5px;
  cursor: pointer;
  border-color: #17a589;
}
.info-res form .years .year {
  margin: 0 5px;
  padding: 0 10px;
  border-radius: 5px;
  font-size: 1.2em;
  font-weight: 500;
  cursor: pointer;
}

.info-res form .content {
  margin-top: 15px;
  white-space: nowrap;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.info-res form .content .item p {
  color: var(--dark-remark);
  letter-spacing: 1px;
  font-size: 1.1em;
  user-select: none;
}
.info-res form .content .item .input,
.info-res .container .slide .list .main {
  margin-top: 2px;
  position: relative;
  height: 35px;
  line-height: 35px;
}
.info-res form .content .item .input input {
  width: 100%;
  height: 100%;
}
.info-res form .content .item .input input:focus,
.info-res .container .slide .list .main input:focus {
  border-color: #17a589;
  box-shadow: 0 0 5px rgba(23, 165, 137, 0.4);
}
.info-res form .content .item .input i {
  position: absolute;
  margin: 0;
  right: 10px;
  color: #17a589;
  cursor: pointer;
  visibility: hidden;
}
.info-res form .content .item .input:hover input + i,
.info-res form .content .item .input input:focus + i {
  visibility: visible;
}

.info-res .container .btns {
  padding-top: 10px;
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.info-res .container .btns .checkBox {
  flex: 1;
}
.info-res .container .btns .check {
  margin: 0 20px;
}
.info-res .container .btns button {
  width: 30%;
  max-width: 250px;
  background-color: #17a589;
  transition: 0.1s;
}
.info-res .container .btns button:hover {
  filter: brightness(110%);
}
.info-res .container .btns button:active {
  transform: scale(0.98);
}

.info-res .icon-dian {
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
