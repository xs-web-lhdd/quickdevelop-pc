<template>
  <div class="index">
    <nav-bar :isAlphaChange="isAlphaChange"></nav-bar>
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import NavBar from "components/navBar/NavBar.vue";
export default {
  name: "",
  components: {
    NavBar,
  },
  data() {
    return {
      // navbar的背景颜色是否随高度变化而变化
      isAlphaChange: false,
    };
  },
  methods: {},
  created() {
    // 判断所处当前的页面
    // console.log(this.$route.path);
    // 如果是 /home 则监听页面滚动
    if (this.$route.path == "/home") {
      this.isAlphaChange = true;
    }
  },
  watch: {
    "$route.path"(current) {
      if (current == "/home") {
        this.isAlphaChange = true;
      } else {
        this.isAlphaChange = false;
      }
      // console.log(this.isAlphaChange);
    },
  },
};
</script>

<style scoped>
</style>
