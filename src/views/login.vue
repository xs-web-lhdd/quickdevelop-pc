<template>
  <div class="login">
    <!-- 这里navbar做登录动画美化使用 -->
    <nav-bar
      class="navbar"
      :class="isLoginSuccess ? 'showNavbar' : ''"
    ></nav-bar>
    <div class="main" :class="isLoginSuccess ? 'hideMain' : ''">
      <div class="logoContainer">
        <div class="logo"><img src="~assets/img/logo.png" alt="" /></div>
      </div>
      <div class="mainBox">
        <div class="leftButton">
          <div
            @click="handleClick('second')"
            class="buttonItem"
            :class="activeName == 'second' ? 'selectButton' : ''"
          >
            <i class="iconfont icon-denglu"></i> Registration
          </div>
          <div
            @click="handleClick('first')"
            class="buttonItem"
            :class="activeName == 'first' ? 'selectButton' : ''"
          >
            <i class="iconfont icon-denglu2"></i> Sign In
          </div>
        </div>
        <div class="loginInput" v-if="activeName == 'first'">
          <div class="tips">
            <h3>登录</h3>
            <h3>你的账户</h3>
          </div>
          <el-form ref="form" :model="login" label-width="80px">
            <el-form-item>
              <el-input
                v-model="login.userName"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="login.passWord"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <div class="resetPassword">* Reset Password</div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
          </el-form>
          <!-- 第三方登录方式 -->
          <div class="otherLoginWays">
            <a
              href="https://gitee.com/oauth/authorize?client_id=e21ada1875792c7df538e290dc403e377289ccfa94343a4aed715cd7f9297ee2&redirect_uri=http://www.codeman.ink:8848/login&response_type=code"
            >
              <div class="otherLoginItem">
                <img src="~assets/img/gitee.png" alt="" />
                <span>使用Gitee一键登录</span>
              </div>
            </a>
          </div>
        </div>
        <div class="registeredInput" v-else>
          <div class="tips">
            <h3>注册</h3>
            <h3>填写注册信息</h3>
          </div>
          <el-form ref="form" :model="login" label-width="80px">
            <el-form-item>
              <el-input
                v-model="registered.userName"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="registered.passWord"
                placeholder="请输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="registered.email"
                placeholder="请输入电子邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="registered.phoneNumber"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="clickRegistered"
                >注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/navBar/NavBar.vue";

export default {
  name: "Login",
  components: { NavBar },
  data() {
    return {
      login: {
        userName: "",
        passWord: "",
      },
      registered: {
        phoneNumber: "",
        passWord: "",
        userName: "",
        email: "",
      },
      activeName: "first",
      // 是否登录成功
      isLoginSuccess: false,
    };
  },
  methods: {
    // 请求
    // gitee登录
    async giteeLogin(code) {
      let res = await this.$request("/login/gitee", { code });
      // console.log(res);
      if (res.data.code == 200) {
        this.isLoginSuccess = true;
        setTimeout(() => {
          //   跳转至主界面
          this.$router.replace("/index");
        }, 500);
      } else {
        this.$message.warning("登录失败,请稍后重试!");
      }
    },

    //   点击登录的回调
    async onSubmit() {
      // 登录前先稍作判断，如果有空没填，则不发送请求
      if (!this.login.userName.trim() || !this.login.passWord.trim()) {
        this.$message.warning("请输入用户名和密码后再登录哦!");
        return;
      }
      let res = await this.$request("/login", this.login, "post");
      console.log(res);
      if (res.status == 200 && res.data.code == 200) {
        // 登陆成功
        // 将用户信息保存至vuex
        // this.$store.commit("updateUserInfo", res.data.data);

        // 将tokenName和tokenValue 以及用户信息保存至本地
        // window.localStorage.setItem("tokenName", res.data.data.tokenName);
        // window.localStorage.setItem("tokenValue", res.data.data.tokenValue);
        // window.localStorage.setItem("userName", this.login.userName);

        this.isLoginSuccess = true;
        setTimeout(() => {
          //   跳转至主界面
          this.$router.replace("/index");
        }, 500);
      } else if (res.status == 200 && !res.data.success) {
        this.$message.warning("登录失败,账号或密码错误!");
      }
    },

    handleClick(e) {
      this.activeName = e;
    },

    // 点击注册的回调
    async clickRegistered() {
      // 注册前先稍作判断，如果有空没填，则不发送请求
      if (
        !this.registered.userName.trim() ||
        !this.registered.passWord.trim() ||
        !this.registered.phoneNumber.trim() ||
        !this.registered.email.trim()
      ) {
        this.$message.warning("请填写注册信息后再进行注册哦!");
        return;
      }
      let res = await this.$request("/register", this.registered, "post");
      console.log(res);
      // 如果注册成功，清空所有数据并跳转至登录界面，自动填写手机号码
      if (res.data.code == 200) {
        this.$message.success("注册成功!");
        this.login.userName = this.registered.userName;
        this.login.passWord = "";
        this.activeName = "first";
        this.registered = {
          phoneNumber: "",
          passWord: "",
          userName: "",
          email: "",
        };
      } else if (res.data.code == 500) {
        this.$message.error(res.data.msg);
      } else {
        this.$message.error("注册失败,请稍后重试!");
      }
    },
  },
  created() {
    // document.cookie = document.cookie + "username=John Doe;";
    // console.log(document.cookie);
    // 判断是否是第三方登录  通过查看参数是否包含code判断
    if (this.$route.query.code) {
      console.log(this.$route.query.code);
      this.giteeLogin(this.$route.query.code);
    }
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: -74px;
  transition: all 0.5s;
}

.navbar /deep/ .navBar {
  background-color: transparent !important;
}

.showNavbar {
  top: 0;
}

.login {
  height: 100vh;
  height: 100vh;
  background: url(~assets/img/cloud.jpg);
  background-size: cover;
  background-position: 0% 100%;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.logo {
  width: 200px;
  margin-bottom: 20px;
}

.logo img {
  width: 100%;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.main {
  position: absolute;
  left: 50%;
  top: 10vh;
  transform: translateX(calc(-50% + 26px));
  transition: all 0.5s ease;
  animation: showMain 1.2s ease forwards;
}

@keyframes showMain {
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    visibility: visible;
    opacity: 1;
  }
}

.hideMain {
  top: 100vh;
}

.mainBox {
  width: 450px;
  background-color: #fff;
  border-radius: 10px;
  border-top-left-radius: unset;
  padding: 30px 50px;
  box-sizing: border-box;
  position: relative;
}

.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
}

.el-input /deep/ input {
  border: none;
  padding: 0;
  border-bottom: 1px solid #eee;
}

.el-input /deep/ .el-input__inner {
  height: 48px;
  font-size: 15px;
}

.el-button {
  width: 128px;
  height: 52px;
  background-color: #6086fc;
  border: none;
  border-radius: 10px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}

.el-button:hover {
  background-color: #5edfff;
}

.tips {
  margin: 20px 0 15px;
}

.tips h3 {
  margin: 0;
  font-size: 23px;
  line-height: 28px;
  color: #050405;
}

.resetPassword {
  text-align: right;
  cursor: pointer;
  color: #ff3d00;
  font-weight: bold;
  font-size: 15px;
  user-select: none;
}

.leftButton {
  position: absolute;
  left: -199px;
  top: 147px;
  z-index: -1;
  transform: rotate(-90deg);
  display: flex;
}

.buttonItem {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  cursor: pointer;
  background-color: #f8f8f8;
  margin-left: 10px;
  padding: 10px 30px;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: #050405;
  font-weight: bold;
  transition: all 0.4s;
  user-select: none;
}

.buttonItem i {
  margin-right: 10px;
}

.selectButton,
.buttonItem:hover {
  background-color: #5cd9f8;
  color: #f3f3f3;
}

.otherLoginWays {
  padding-top: 20px;
  text-align: center;
}

.otherLoginItem {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.otherLoginItem img {
  width: 40px;
}

.otherLoginItem span {
  color: #333;
  margin-left: 15px;
}

a {
  text-decoration: none;
}
</style>