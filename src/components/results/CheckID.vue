<template>
  <div class="checkID">
    <span class="text">ID:</span>
    <span class="val">{{zombie[currentIndex].id}}</span>
    <i class="iconfont icon-xiala"></i>
    <div class="list">
      <div
        class="item"
        v-for="(item,index) in zombie"
        :key="index"
        @click="changeIndex(index)"
      >
        <!-- ;changeNav(currentNav)" -->
        {{item.id}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
    }
  },
  props: {
    zombie: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    changeIndex(i) {
      this.currentIndex = i
      this.$emit('changeIndex', i)
    },
  },
}
</script>

<style scoped>
.checkID {
  position: relative;
  width: 150px;
  border: var(--border1);
  border-radius: 5px;
  text-align: center;
  display: flex;
  align-items: center;
  padding-left: 30px;
}
.checkID .text {
  position: absolute;
  left: 5px;
}
.checkID .list {
  position: absolute;
  left: 0;
  top: 36px;
  width: 100%;
  height: 0;
  overflow-y: hidden;
  border-radius: 5px;
  box-shadow: var(--box-shadow2);
  background-color: #ffffff;
  z-index: 10;
  transition: var(--hover-speed);
}
.checkID .list .item {
  padding: 5px 0;
  cursor: pointer;
}
.checkID .list .item:hover {
  background-color: var(--origin);
  color: #ffffff;
}
.checkID i {
  position: absolute;
  right: 5px;
  transition: var(--hover-speed);
}
.checkID:hover i {
  transform: rotate(180deg);
}
.checkID:hover .list {
  height: 170px;
  overflow-y: scroll;
}
</style>