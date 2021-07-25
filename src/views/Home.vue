<template>
  <div class="home">
    <div class="background"><span>FORUM</span></div>
    <ul>
      <li v-for="(item, index) in 100" :key="index">{{ item }}</li>
    </ul>

    <!-- 返回顶部组件 -->
    <go-top></go-top>
    <!-- <el-backtop></el-backtop> -->
  </div>
</template>

<script>
import GoTop from "components/goTop/GoTop.vue";
export default {
  components: { GoTop },
  name: "home",
  data() {
    return {};
  },
  methods: {
    // 事件
  },
  mounted() {
    // 开启时监听滚轮事件
    const background = document.querySelector(".background");
    window.addEventListener("scroll", (e) => {
      // console.log(window.scrollY);
      let scrollY = window.scrollY;

      if (window.scrollY !== 0) {
        if (scrollY < document.body.clientHeight) {
          background.style.backgroundPosition = `calc(${scrollY}px) calc(100% + ${scrollY}px)`;
        }
      } else {
        background.style.backgroundPosition = "";
      }
    });
  },
};
</script>

<style scoped>
.home {
  margin: 0;
  padding: 0;
  height: 100vh;
}

.background {
  background-image: url("~assets/img/cloud.jpg");
  background-size: cover;
  background-position: 0% 100%;
  height: 100vh;
  font: 900 18rem "";
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-align: center;
  overflow: hidden;
  padding-top: 35vh;
  box-sizing: border-box;
  user-select: none;
}

.background::before {
  content: "";
  background-size: cover;
  background-image: inherit;
  background-position: 0% 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -100;
}
</style>
