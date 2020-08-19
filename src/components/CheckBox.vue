<template>
  <div class="check-box">
    <p
      class="check-text"
      :class="checkText === '' ? 'placeholder' : ''"
      @mouseenter="hover"
    >
      {{checkText === "" ? "选择测试模型" : checkText}}
    </p>
    <i class="iconfont icon-xiala xiala"></i>
    <div class="models">
      <p
        class="item"
        :class="item.active ? 'active' : ''"
        v-for="(item,index) in models"
        :key="index"
        @click="item.active = !item.active"
      >
        {{item.name}}
        <i
          v-if="item.active"
          class="iconfont icon-dui"
        ></i>
      </p>
    </div>
  </div>
</template>

<script>
var timer
export default {
  props: {
    models: {
      type: Array,
      default: () => {
        return [{ name: '无数据' }]
      },
    },
  },
  methods: {
    hover(e) {
      document.querySelector('.models').className = 'models'
      if (document.body.offsetHeight - e.pageY < 100)
        document.querySelector('.models').classList.add('up')
      else document.querySelector('.models').classList.add('down')
    },
  },
  computed: {
    checkText() {
      let checked = this.models.filter((item) => {
        return item.active
      })
      checked = checked.map((item) => {
        return item.name
      })
      return checked.join(',')
    },
  },
}
</script>

<style scoped>
.check-box {
  height: 35px;
  padding: 0 5px;
  border: var(--border1);
  border-radius: 5px;
  color: var(--dark-common);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 5;
}
.check-box p {
  width: 100%;
}

.check-box .xiala {
  position: absolute;
  right: 10px;
  transition: var(--hover-speed);
}

.check-box .models {
  position: absolute;
  left: 0;
  height: 0;
  width: 100%;
  background-color: #ffffff;
  box-shadow: var(--box-shadow2);
  transition: var(--hover-speed);
  overflow: hidden;
  cursor: pointer;
}
.check-box:hover .models.up,
.check-box:hover .models.down {
  height: 135px;
}
.check-box .models.up {
  height: 0;
  top: -2px;
  transform: translateY(-100%);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.check-box .models.down {
  height: 0;
  top: 35px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.check-box .models .item {
  height: 45px;
  line-height: 45px;
  text-align: center;
}
.check-box .models .item:hover {
  color: #ffffff;
  background-color: rgba(23, 165, 137, 0.67);
}
.check-box .models .item.active {
  color: #ffffff;
  background-color: #17a589;
}
.check-box .models .item i {
  position: absolute;
  margin-left: 10px;
}

.check-box:hover .xiala {
  transform: rotate(180deg);
}
</style>
