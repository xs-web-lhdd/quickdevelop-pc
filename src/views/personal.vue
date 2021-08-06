<template>
  <div class="personalContainer" v-if="userInfo">
    <div class="personal">
      <div class="background">
        <div class="left">
          <div class="avatar">
            <img
              :src="userInfo.avatar || require('assets/img/defaultAvatar.jpg')"
              fit="cover"
            />
          </div>
          <div class="userInfo">
            <div class="userName">
              {{ userInfo.nickName }}
              <div class="tag" v-if="userInfo.role != ''">
                {{ userInfo.role }}
              </div>
            </div>
            <div class="email">{{ userInfo.email }}</div>
          </div>
        </div>
        <div class="right">
          <div @click="changeType('post')">
            Posts: <span>{{ articleListData && articleListData.total }}</span>
          </div>
          <div @click="changeType('comment')">
            Comments:
            <span>{{ commentData && commentData.total }}</span>
          </div>
          <div>Views: <span>1.2k</span></div>
        </div>
        <!-- 用户信息操作栏 -->
        <div
          class="userInfoControl"
          v-if="$store.state.userInfo.userId == $route.params.id"
        >
          <div class="userInfoControlItem add" @click="isWriteCardShow = true">
            <i class="iconfont icon-tianjiajiahaowubiankuang"></i>
          </div>
          <div class="userInfoControlItem edit" @click="editUserInfo">
            <i class="iconfont icon-bianji1"></i>
          </div>
          <div class="userInfoControlItem logout" @click="logout">
            <i class="iconfont icon-zhuxiao1"></i>
          </div>
        </div>
      </div>
      <div class="articleCardContainer" v-loading="isDataLoad">
        <!-- 文章组件 -->
        <article-card
          v-if="$route.query.type == 'post'"
          class="articleCard"
          :articleList="articleListData && articleListData.list"
          @reFreshArticleList="getArticleById($route.params.id)"
          @addArticle="isWriteCardShow = true"
        ></article-card>
        <!-- 评论组件 -->
        <comment-list-card
          v-else-if="$route.query.type == 'comment'"
          :commentList="commentData.list"
          @reFreshCommentList="getCommentData($route.params.id)"
        ></comment-list-card>
        <!-- 底部 -->
        <div class="bottom" v-if="!isDataLoad">
          <!-- 分页组件 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="
              $route.query.type == 'post'
                ? articleListData
                  ? articleListData.total
                  : 1
                : commentData
                ? commentData.total
                : 1
            "
            :page-size="
              $route.query.type == 'post'
                ? this.$store.state.userInfo.userId == this.$route.params.id
                  ? 7
                  : 8
                : 16
            "
            :current-page="$route.query.page * 1"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 返回顶部组件 -->
    <go-top></go-top>

    <!-- 编辑用户信息的dialog -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="isEditDialogShow"
      top="calc(50vh - 250px)"
    >
      <div class="dialogInputItem">
        <div class="inputTitle">用户名:</div>
        <el-input
          v-model="editUserData.userName"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">昵称:</div>
        <el-input
          v-model="editUserData.nickName"
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
          v-model="editUserData.phoneNumber"
          autocomplete="off"
          size="small"
        ></el-input>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">性别:</div>
        <!-- <el-input
          v-model="editUserData.sex"
          autocomplete="off"
          size="small"
        ></el-input> -->
        <el-radio v-model="editUserData.sex" label="0">保密</el-radio>
        <el-radio v-model="editUserData.sex" label="1">男生</el-radio>
        <el-radio v-model="editUserData.sex" label="2">女生</el-radio>
      </div>
      <div class="dialogInputItem">
        <div class="inputTitle">头像:</div>
        <!-- <el-input
          v-model="editUserData.avatar"
          autocomplete="off"
          size="small"
        ></el-input> -->
        <el-upload
          action="/xiaopopan/eduoss/fileoss/upload/1413125531471233026?catalogue=/root/drawingBed"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeImgUpload"
        >
          <img :src="editUserData.avatar" alt="" class="uploadAvatar" />
        </el-upload>
      </div>
      <!-- <div class="dialogInputItem">
        <div class="inputTitle">密码:</div>
        <el-input
          v-model="editUserData.password"
          autocomplete="off"
          size="small"
        ></el-input>
      </div> -->
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

    <!-- 添加文章组件 -->
    <write-card
      :isCardShow="isWriteCardShow"
      @reFreshArticleList="changePage($route.query.page)"
      @closeCard="isWriteCardShow = false"
    ></write-card>
  </div>
</template>

<script>
import ArticleCard from "components/articleCard/ArticleCard.vue";
import GoTop from "components/goTop/GoTop.vue";
import WriteCard from "components/writeCard/WriteCard.vue";
import CommentListCard from "../components/commentListCard/CommentListCard.vue";
export default {
  components: { ArticleCard, GoTop, WriteCard, CommentListCard },
  name: "personal",
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 文章列表数据
      articleListData: {},
      // 编辑用户信息
      editUserData: {
        userId: this.$route.params.id,
        userName: "",
        nickName: "",
        email: "",
        phoneNumber: "",
        sex: "",
        avatar: "",
        signature: "",
      },
      // 是否显示编辑用户的dialog
      isEditDialogShow: false,
      // 是否正在加载中
      isDataLoad: false,
      // 是否显示添加文章组件
      isWriteCardShow: false,
      // 该用户的所有评论数据
      commentData: {},
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
      this.isDataLoad = true;
      let res = await this.$request(`/dqarticle/author/${id}`, {
        pageNum: this.$route.query.page,
        pageSize:
          this.$store.state.userInfo.userId == this.$route.params.id ? 7 : 8,
      });
      console.log(res);
      this.isDataLoad = false;
      // this.articleList = res.data.data;
      this.articleListData = res.data.data;
    },

    // 确认修改用户信息
    async commitEdit() {
      let res = await this.$request(
        `/dquser/update`,
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

    // 请求当前用户的所有评论数据
    async getCommentData(id) {
      let res = await this.$request(`/dqcomment/dquser/${id}`, {
        pageNum: this.$route.query.page,
        pageSize: 16,
      });
      console.log(res);
      this.commentData = res.data.data;
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
      // 这里不深拷贝 因为editUserData没有password 两者不是完全一样的
      // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致
      Object.keys(this.editUserData).forEach((key) => {
        this.editUserData[key] = this.userInfo[key];
      });

      this.isEditDialogShow = true;
    },

    // 切换分页的回调
    async changePage(e) {
      // this.currentPage = e;
      // console.log(e);
      // 滚动到card的offsettop
      this.$router.push({
        name: "personal",
        params: { id: this.$route.params.id },
        query: { type: this.$route.query.type, page: e },
      });

      let top;

      if (this.$route.query.type == "post") {
        let articleCard = document.querySelector(".articleCard");
        top = articleCard.offsetTop - 94;

        await this.getArticleById(this.$route.params.id);
      } else if (this.$route.query.type == "comment") {
        let commentListCard = document.querySelector(".commentListCard");
        top = commentListCard.offsetTop - 94;

        await this.getCommentData(this.$route.params.id);
      }

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    },

    // 点击切换分类的回调
    changeType(type) {
      this.$router.push({
        name: "personal",
        params: { id: this.$route.params.id },
        query: { type, page: 1 },
      });

      // 重新获取列表数据
      if (this.$route.query.type == "post") {
        this.getArticleById(this.$route.params.id);
      } else if (this.$route.query.type == "comment") {
        this.getCommentData(this.$route.params.id);
      }
    },

    // 封面上传成功的回调
    uploadSuccess(e) {
      console.log(e);
      this.editUserData.avatar = e.data.file.url;
      this.$message.success("头像上传成功!");
    },

    // 封面上传失败的回调
    uploadError(e) {
      console.log(e);
      this.$message.error("头像上传失败, 请稍后重试!");
    },

    // 图片上传前的回调
    beforeImgUpload(file) {
      console.log(file);
      // 上传的图片不能超过 1m
      const isImg1M = file.size / 1024 / 1024 <= 1;
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";

      if (!isImg) {
        this.$message.warning("上传的头像只能是 JPG/PNG/BMP 格式!");
      }
      if (!isImg1M) {
        this.$message.warning("上传的头像大小不能超过 1MB 哦!");
      }
      // 返回false可以阻止图片上传
      return isImg && isImg1M;
    },
  },
  watch: {
    "$store.state.userInfo"(current) {
      // 当在personal页面刷新时，vuex中的userInfo需要重新获取，而获取数据需要一定时间
      // 这时候判断this.$store.state.userInfo.userId == this.$route.params.id  如果原本应为true  但因为数据没有及时拿到 所以仍判断是false
      // 而false会请求8条数据 加上如果是本人主页的话 加上添加的card 则会存在9条数据 影响格式美观  而下面处理方法不用.pop直接处理数组是因为
      // 获取文章的数据请求是已经通过判断发出去了，但在userInfo获取到后触发这个回调时，文章数据有可能还没有获取到 这是直接操作的数组可能还是undefined
      // 所以最保险的做法是直接重新发送请求 覆盖之前的请求数据
      if (current.userId == this.$route.params.id) {
        // this.articleListData.list.pop();
        this.getArticleById(this.$route.params.id);
      }
    },
  },
  created() {
    window.scrollTo(0, 0);
    this.getUserInfoById(this.$route.params.id);
    this.getArticleById(this.$route.params.id);
    this.getCommentData(this.$route.params.id);
  },
};
</script>

<style scoped>
.personalContainer {
  display: flex;
  justify-content: center;
  font-size: 15px;
  background-color: #f8f8f8;
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
  box-shadow: 0 25px 25px -10px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.avatar {
  margin-right: 20px;
}

.avatar img {
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
  cursor: pointer;
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
  right: -85px;
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

.add {
  background-color: #fdce02;
}

.dialogInputItem {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.inputTitle {
  width: 85px;
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0 50px;
}

.personal /deep/ .el-loading-spinner {
  margin-top: 0px;
  top: 20%;
}

.tips {
  margin: 60px 0;
  font-size: 14px;
  color: rgb(133, 133, 133);
  text-align: center;
}

.uploadAvatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.el-input {
  width: 83%;
}
</style>
