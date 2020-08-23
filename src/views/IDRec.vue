<template>
  <div class="id-search">
    <div>
      <header class="content">
        <p>
          <i class="iconfont icon-dian"></i>根据企业的唯一ID查询企业的画像，如果是第一次查询请移步
          <router-link to="/infoRec">僵尸识别</router-link> ,
          企业首次识别后的结果将存储在数据库中。你可以选择手动输入企业的ID或者通过csv文件导入的形式批量导入ID。
        </p>
        <div class="input">
          <input
            class="id-input"
            type="text"
            placeholder="输入企业ID"
            v-model="id"
          >
          <button
            class="add"
            @click="add"
          >添加</button>
          <label class="file">
            <input
              type="file"
              @change="checkFile"
            >
            <span>导入</span>
          </label>
          <button @click="search">查询</button>
        </div>
        <div
          class="id-list"
          v-if="idList.length>0"
        >
          <div
            class="item"
            v-for="(item,index) in idList"
            :key="index"
          >
            {{item}}
            <i
              class="iconfont icon-lajitong"
              @click="removeID(index)"
            ></i>
          </div>
        </div>
      </header>
    </div>

    <result
      v-if="resultData && resultData.data.length>0"
      :result="resultData"
    ></result>
  </div>
</template>

<script>
import { Query } from '../assets/axios/api.js'
import result from '../components/results/Result.vue'
import testData from '../assets/data.json'
export default {
  data() {
    return {
      id: '',
      idList: [],
      resultData: null,
    }
  },
  methods: {
    add() {
      if (this.id === '') return
      if (this.idList.indexOf(this.id) > -1)
        this.$showToast({
          type: 'warn',
          text: '该ID已存在',
        })
      else this.idList.push(this.id)
      this.id = ''
    },
    checkFile(e) {
      //选择文件
      const load = this.$loading()
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => {
        let result = e.target.result.split('\n')
        let list = []
        for (let i = 1; i < result.length - 1; i++) {
          let item = result[i].trim()
          item = item.split(',')
          list.push((+item[0]).toString())
        }
        this.idList = [...new Set(list)]
        load.hide()
      }
    },
    removeID(index) {
      this.idList.splice(index, 1)
    },
    search() {
      if (this.idList.length === 0) {
        this.$showToast({
          type: 'warn',
          text: 'ID数量不能为空',
        })
        return
      }
      let load = this.$loading()
      let startTime = new Date()
      setTimeout(() => {
        this.cutData(testData, startTime)
        load.hide()
      }, 2670)
    },
    cutData(data, startTime) {
      this.resultData = null
      let amount = 0
      let max = this.idList.length
      console.log(this.idList)
      setTimeout(() => {
        let result = {
          time: ((new Date() - startTime) / 1000).toFixed(1),
          data: [],
        }
        for (let i in data.predict) {
          let predict = data.predict[i]

          // 判断id是否在idlist里
          if (this.idList.indexOf(predict.company_id.toString()) === -1)
            continue

          let zombie_type = data.zombie_type[i] //僵尸类型
          let zombie_type_featrues = data.zombie_type_featrues[i] //僵尸特征
          delete zombie_type_featrues.ID
          delete zombie_type.ID

          let grad_cam = data.grad_cam[i] //81个特征
          delete grad_cam.ID
          let zombie_level = data.zombie_level[i] //僵尸程度
          let contribute_matrix = data.contribute_matrix[i] //贡献度
          delete contribute_matrix.ID

          const item = {
            id: predict.company_id,
            //id: this.idList[amount], // 测试数据
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
        if (result.data.length === 0)
          this.$showToast({
            type: 'warn',
            text: '无符合企业',
          })
        this.resultData = result
      })
    },
  },
  components: {
    result,
  },
}
</script>

<style scoped>
.id-search .content {
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  padding: 20px 0;
}

.id-search header {
  margin-bottom: 10px;
}
.id-search header .input {
  margin: 10px 0;
}
.id-search header .input button,
.id-search header .input .file {
  margin-left: 15px;
  width: 60px;
}
.id-search header .input .file {
  border: none;
  outline: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  background-color: #5d7092;
}

.id-search header .id-list {
  width: 100%;
  max-height: 150px;
  padding: 5px;
  border: var(--border1);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}
.id-search header .id-list .item {
  position: relative;
  margin: 5px;
  padding: 0 5px;
  border: var(--border1);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--hover-speed);
}
.id-search header .id-list .item i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: none;
  color: #fff;
  z-index: 10;
}
.id-search header .id-list .item:hover {
  color: #f56c6c;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.id-search header .id-list .item:hover i {
  display: block;
}

.id-search .icon-dian {
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
