<template>
  <div class="navBarContainer">
    <div
      class="navBar"
      :style="'background-color:rgba(24, 54, 91,' + backgroundAlpha + ')'"
    >
      <div class="left">
        <div class="logo"><img src="~assets/img/logo.png" alt="" /></div>
        <div class="nav">
          <div class="navItem" @click="goCurrentPage('/home')">Home</div>
          <div class="navItem" @click="goCurrentPage('/community')">
            Community
          </div>
          <div class="navItem" @click="goCurrentPage('/blogs')">Blogs</div>
        </div>
      </div>
      <div class="right">
        <!-- 搜索组件 -->
        <div class="user">
          <div
            class="avatar"
            @click="
              $router.push({
                name: 'personal',
                params: { id: userInfo.userId },
              })
            "
          >
            <el-image
              :src="
                userInfo.avatar
                  ? '/articleImg' + userInfo.avatar.split('.com')[1]
                  : ''
              "
              fit="cover"
            ></el-image>
          </div>
          <div class="userName">{{ userInfo.userName }}</div>
        </div>
      </div>
    </div>
    <div class="placeHolder" v-if="!isAlphaChange"></div>
  </div>
</template>

<script>
export default {
  name: "navBar",
  props: {
    isAlphaChange: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // 背景色透明度
      backgroundAlpha: 1,
      // 用户信息
      userInfo: {},
    };
  },
  methods: {
    // 请求
    // 请求用户信息
    async getUserInfo() {
      let res = await this.$request("/dquser/getnowuser", {
        userName: window.localStorage.getItem("userName"),
      });
      // console.log(res);
      this.userInfo = res.data.data;
    },

    // 事件
    // 点击navItem 的回调
    goCurrentPage(path) {
      if (this.$route.path != path) {
        this.$router.push(path);
        // 回到顶部
        window.scrollTo(0, 0);
      }
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.pageHeight = document.body.clientHeight;

    // 判断是否需要根据高度动态改变navbar的背景色
    // console.log(123);
    this.backgroundAlpha = this.isAlphaChange ? 0 : 1;

    // 监听页面滚动
    window.addEventListener("scroll", () => {
      if (this.isAlphaChange) {
        this.backgroundAlpha = 0;
        // 有可能滑下去后透明度还没到 1，这里如果判断到已经滑下去但透明度还没到1 则直接置为 1
        if (window.scrollY <= document.body.clientHeight) {
          this.backgroundAlpha = window.scrollY / document.body.clientHeight;
          // console.log(this.backgroundAlpha);
        } else {
          if (this.backgroundAlpha < 1) {
            this.backgroundAlpha = 1;
          }
        }
      }
    });
  },
  watch: {
    isAlphaChange(current) {
      this.backgroundAlpha = current ? 0 : 1;
    },
  },
};
</script>

<style scoped>
.navBar {
  display: flex;
  position: fixed;
  color: white;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(24, 54, 91);
  width: 100%;
  z-index: 1000;
  height: 74px;
}

.left,
.nav {
  display: flex;
  align-items: center;
}

.logo,
.navItem,
.button {
  margin: 20px;
  cursor: pointer;
  user-select: none;
}

.logo {
  margin: 20px 40px 20px 30px;
}

.user {
  margin: 20px 60px;
  display: flex;
  align-items: center;
}

.left img {
  width: 150px;
}

.placeHolder {
  height: 74px;
}

.avatar .el-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.avatar {
  margin-right: 10px;
  cursor: pointer;
}
</style>
