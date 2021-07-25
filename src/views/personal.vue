<template>
  <div class="personalContainer" v-if="userInfo">
    <div class="personal">
      <div class="background">
        <div class="left">
          <div class="avatar">
            <el-image
              :src="
                userInfo.avatar
                  ? '/articleImg' + userInfo.avatar.split('.com')[1]
                  : ''
              "
              fit="cover"
            ></el-image>
          </div>
          <div class="userInfo">
            <div class="userName">
              {{ userInfo.nickName }}
              <div class="tag">Admin</div>
            </div>
            <div class="email">{{ userInfo.email }}</div>
          </div>
        </div>
        <div class="right">
          <div>Posts: <span>30</span></div>
          <div>Comments: <span>12</span></div>
          <div>Views: <span>1.2k</span></div>
        </div>
        <!-- 用户信息操作栏 -->
        <div
          class="userInfoControl"
          v-if="$store.state.userInfo.userId == $route.params.id"
        >
          <div class="userInfoControlItem edit" @click="editUserInfo">
            <i class="iconfont icon-bianji1"></i>
          </div>
          <div class="userInfoControlItem logout" @click="logout">
            <i class="iconfont icon-zhuxiao1"></i>
          </div>
        </div>
      </div>
      <ariticel-card
        :articleList="articleList"
        @reFreshArticleList="getArticleById($route.params.id)"
      ></ariticel-card>
    </div>
    <!-- 返回顶部组件 -->
    <go-top></go-top>

    <!-- 编辑用户信息的dialog -->
    <el-dialog title="编辑用户信息" :visible.sync="isEditDialogShow">
      <div class="dialogInputItem">
        <div class="inputTitle">用户名:</div>
        <el-input
          v-model="editUserData.username"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">昵称:</div>
        <el-input
          v-model="editUserData.nickname"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">邮箱:</div>
        <el-input
          v-model="editUserData.email"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">手机号码:</div>
        <el-input
          v-model="editUserData.phonenumber"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">性别:</div>
        <el-input
          v-model="editUserData.sex"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">头像:</div>
        <el-input
          v-model="editUserData.avatar"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">密码:</div>
        <el-input
          v-model="editUserData.password"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">个性签名:</div>
        <el-input
          v-model="editUserData.signature"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogShow = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="commitEdit" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AriticelCard from "components/articleCard/AriticelCard.vue";
import GoTop from "components/goTop/GoTop.vue";
export default {
  components: { AriticelCard, GoTop },
  name: "personal",
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 文章列表
      articleList: [],
      // 编辑用户信息
      editUserData: {
        username: "",
        nickname: "",
        email: "",
        phonenumber: "",
        sex: "",
        avatar: "",
        password: "",
        signature: "",
      },
      // 是否显示编辑用户的dialog
      isEditDialogShow: false,
    };
  },
  methods: {
    // 请求
    // 根据id 查询用户信息
    async getUserInfoById(id) {
      let res = await this.$request(`/dquser/${id}`);
      // console.log(res);
      this.userInfo = res.data.data;
    },

    // 根据id查询文章
    async getArticleById(id) {
      let res = await this.$request(`/dqarticle/author/${id}`);
      console.log(res);
      // this.articleList = res.data.data;
      this.articleList = res.data.data;
    },

    // 确认修改用户信息
    async commitEdit() {
      let res = await this.$request(
        `/dquser/update/${this.userInfo.userId}`,
        this.editUserData,
        "post"
      );
      console.log(res);
      if (res.data.code == 200) {
        this.isEditDialogShow = false;
        // personal页面和navbar都需要重新获取数据
        this.getUserInfoById(this.$route.params.id);
        this.$store.commit("updateReFreshUserInfo", true);
      }
    },

    // 事件
    // 点击退出登录的回调
    logout() {
      // 清空vuex和localstorage中的数据
      window.localStorage.removeItem("tokenValue");
      this.$store.commit("updateUserInfo", {});

      // 跳转至登录界面
      this.$router.replace("/login");
    },

    // 点击编辑用户的回调
    editUserInfo() {
      // 这里不深拷贝 因为userInfo是驼峰 而更新用户的接口不是
      // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致
      Object.keys(this.editUserData).forEach((key) => {
        this.editUserData[key] = this.userInfo[key];
      });
      this.editUserData.username = this.userInfo.userName;
      this.editUserData.nickname = this.userInfo.nickName;

      this.isEditDialogShow = true;
    },
  },
  created() {
    window.scrollTo(0, 0);
    this.getUserInfoById(this.$route.params.id);
    this.getArticleById(this.$route.params.id);
  },
};
</script>

<style scoped>
.personalContainer {
  display: flex;
  justify-content: center;
  font-size: 15px;
}

.personal {
  max-width: 1200px;
  width: 91vw;
}

.background {
  width: 100%;
  height: 350px;
  border-radius: 10px;
  margin: 30px 0;
  position: relative;
  background: url("~assets/img/background.jpg") no-repeat;
  background-size: cover;
  background-position-y: 60%;
  color: #f9f9f9;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.avatar {
  margin-right: 20px;
}

.avatar .el-image {
  height: 100px;
  width: 100px;
  border-radius: 10px;
  border: 3px solid #f9f9f9;
}

.userName {
  color: white;
  font-weight: bold;
}

.left {
  position: absolute;
  bottom: 25px;
  left: 30px;
  display: flex;
}

.right {
  position: absolute;
  bottom: 35px;
  right: 30px;
  display: flex;
}

.right > div {
  margin-left: 30px;
}

.right div span {
  font-weight: 600;
}

.userName {
  font-size: 20px;
  position: relative;
  margin: 25px 0 10px;
  /* block独占一行 会撑满一行 所以下面改为inline-block*/
  display: inline-block;
}

.tag {
  font-size: 12px;
  position: absolute;
  right: -60px;
  top: 4px;
  background-color: #ffde66;
  color: #d50101;
  padding: 2px 4px;
  border-radius: 4px;
}

.background:hover .userInfoControl {
  top: 20px;
}

.userInfoControl {
  position: absolute;
  right: 20px;
  top: -50px;
  display: flex;
  transition: all 0.4s;
}

.userInfoControlItem {
  border-radius: 50%;
  margin-left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  cursor: pointer;
}

.userInfoControlItem i {
  font-size: 17px;
  font-weight: bold;
}

.logout {
  background-color: #ff1332;
}

.edit {
  background-color: #2962ff;
}

.dialogInputItem {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.inputTitle {
  width: 100px;
}
</style>
