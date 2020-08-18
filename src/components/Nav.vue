<template>
  <div class="nav">
    <i class="logo iconfont icon-jiangshi"></i>
    <h3>僵尸企业画像</h3>
    <div class="list">
      <router-link
        class="item"
        :class="item.active ? 'active' : ''"
        v-for="(item, index) in navs"
        :key="index"
        :to="{ name: item.name }"
      >
        <i
          class="iconfont"
          :class="item.icon"
        ></i>
        {{ item.text }}
      </router-link>
    </div>
  </div>
</template>

<script>
var navEl
export default {
  data() {
    return {
      navs: [
        { text: '介绍', name: 'home', icon: 'icon-home', active: false },
        {
          text: '僵尸识别',
          name: 'infoRec',
          icon: 'icon-shibie',
          active: false,
        },
        { text: '企业查询', name: 'id', icon: 'icon-search', active: false },
      ],
    }
  },
  watch: {
    $route: 'routeChange',
  },
  methods: {
    routeChange() {
      this.navs.forEach((item) => {
        item.active = false
        if (item.name === this.$route.name) item.active = true
      })
    },
  },
  mounted() {
    navEl = document.querySelector('.nav')
    this.routeChange()
    window.onscroll = () => {
      if (window.innerWidth > 800) {
        navEl.classList.remove('lucency')
        return
      }
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 80) navEl.classList.add('lucency')
      else navEl.classList.remove('lucency')
    }
  },
}
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  height: 60px;
  width: 100vw;
  padding-left: 30px;
  background-color: #ffffff;
  box-shadow: var(--box-shadow2);
  display: flex;
  align-items: center;
  opacity: 1;
}
.nav.lucency {
  opacity: 0.5;
}
.nav.lucency:hover {
  opacity: 1;
}

.nav .logo {
  font-size: 2em;
  border-radius: 50%;
}

.nav h3 {
  margin: 0 15px;
  cursor: default;
  white-space: nowrap;
}

.nav .list {
  width: 100%;
  margin-top: 10px;
  padding-left: 1px;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  position: relative;
}
.nav .list .item {
  margin: 0 15px;
  padding: 0 15px 5px;
  color: var(--dark-remark);
  border-bottom: 3px solid transparent;
  border-radius: 2px;
  cursor: pointer;
}
.nav .list .item i {
  transform: scale(1.1);
}
.nav .list .item:hover {
  color: var(--origin);
}
.nav .list .item.active {
  border-color: var(--origin);
  color: var(--origin);
}
</style>
