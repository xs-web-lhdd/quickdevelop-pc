<template>
  <div
    class="writeCard"
    :class="[
      isCardShow ? 'showCard' : 'hideCard',
      isEnlarge ? 'enlarge' : '',
      isMinimize ? 'minimize' : '',
    ]"
  >
    <!-- 卡片的控制区域 -->
    <div class="cardContorl">
      <div class="contorlItem" v-show="!isMinimize">
        <i class="iconfont icon-zuixiaohua" @click="isMinimize = true"></i>
      </div>
      <div class="contorlItem" v-show="!isMinimize">
        <i
          class="iconfont icon-fangda"
          @click="isEnlarge = true"
          v-if="!isEnlarge"
        ></i>
        <i class="iconfont icon-suoxiao" @click="isEnlarge = false" v-else></i>
      </div>
      <div class="contorlItem">
        <i class="iconfont icon-guanbi1" @click="closeCard"></i>
      </div>
    </div>
    <!-- 卡片头部 -->
    <div
      class="cardHead"
      :class="isMinimize ? 'clickAble' : ''"
      @click="clickHead"
    ></div>
    <!-- 卡片body -->
    <div class="cardBody">
      <div class="left">
        <el-image
          :src="
            $store.state.userInfo.avatar
              ? '/imgreq' + $store.state.userInfo.avatar.split('.com')[1]
              : require('assets/img/defaultAvatar.jpg')
          "
          fit="cover"
        />
      </div>
      <div class="right">
        <div>
          <el-select
            v-model="newArticleData.typeId"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in articleType"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
          <input
            class="title"
            placeholder="标题"
            v-model="newArticleData.articleTitle"
          />
        </div>
        <div class="contentContainer">
          <div class="contentInput">
            <textarea
              class="content"
              placeholder="说点什么吧"
              v-model="newArticleData.articleContent"
            ></textarea>
            <!-- <el-image
              :src="'/imgreq' + newArticleData.articleImage.split('.com')[1]"
              fit="contain"
              class="articleCover"
            ></el-image> -->
          </div>
          <!-- markdown展示框 -->
          <div
            class="mdLive"
            :class="isMdLiveShow ? 'mdLiveShow' : 'mdLiveHide'"
            v-html="handleMarkDown"
          ></div>
        </div>
      </div>
    </div>
    <!-- 卡片底部控制栏 -->
    <div class="cardBottomContorl">
      <el-button type="primary" size="medium" @click="addArticle"
        >发布</el-button
      >
      <div class="bottomBtnContainer">
        <!-- 图片上传 -->
        <el-upload
          multiple
          action="/xiaopopan/eduoss/fileoss/upload/1413125531471233026?catalogue=/root/drawingBed"
          :show-file-list="false"
          :on-success="imgUploadSuccess"
          :on-error="imgUploadError"
          :before-upload="beforeImgUpload"
        >
          <div class="bottomBtn">
            <i class="iconfont icon-tupian"></i>
          </div>
        </el-upload>
        <!-- 封面上传 -->
        <el-popover trigger="hover" width="200">
          <el-upload
            action="/xiaopopan/eduoss/fileoss/upload/1413125531471233026?catalogue=/root/drawingBed"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeImgUpload"
            slot="reference"
          >
            <div class="bottomBtn">上传封面</div>
          </el-upload>
          <img :src="newArticleData.articleImage" alt="" class="popoverImg" />
        </el-popover>
        <div class="bottomBtn" @click="isMdLiveShow = !isMdLiveShow">
          {{ isMdLiveShow ? "关闭" : "打开" }}md效果预览
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkDownIt from "markdown-it";

export default {
  name: "writeCard",
  props: {
    // 是否显示卡片
    isCardShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 用户信息
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    // 原有文章 用于文章修改
    originArticle: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 是否放大
      isEnlarge: false,
      // 是否最小化
      isMinimize: false,
      // 新建文章的数据
      newArticleData: {
        typeId: null,
        articleTitle: "",
        articleContent: "",
        articleImage:
          "https://chen110.oss-cn-guangzhou.aliyuncs.com/2021/08/03/wallhaven-4ooz99.jpg",
      },
      // 文章分类
      articleType: [],
      // 是否实时显示markdown效果
      isMdLiveShow: false,
    };
  },
  methods: {
    // 请求
    async addArticle() {
      // 先判断是否有数据没填
      if (this.newArticleData.typeId == null) {
        this.$message.warning("请选择文章分类哦!");
        return;
      } else if (this.newArticleData.articleTitle == "") {
        this.$message.warning("请填写文章标题哦!");
        return;
      } else if (this.newArticleData.articleContent == "") {
        this.$message.warning("请填写文章内容哦!");
        return;
      } else if (this.newArticleData.articleImage == "") {
        this.$message.warning("请上传背景图片哦!");
        return;
      }

      let res;
      // 如果是修改，判断内容是否有改变
      if (this.originArticle.articleId) {
        if (
          this.newArticleData.typeId == this.originArticle.typeId &&
          this.newArticleData.articleTitle == this.originArticle.articleTitle &&
          this.newArticleData.articleContent ==
            this.originArticle.articleContent &&
          this.newArticleData.articleImage == this.originArticle.articleImage
        ) {
          this.$message.warning("文章没有改动哦!");
          return;
        }

        // 发送修改请求
        res = await this.$request(
          "/dqarticle/update",
          this.newArticleData,
          "post"
        );
      } else {
        res = await this.$request(
          "/dqarticle/add",
          this.newArticleData,
          "post"
        );
      }

      console.log(res);
      if (res.data.code == 200) {
        // 让父组件更新数据
        this.$emit("reFreshArticleList");
        // 关闭当前组件
        this.closeCard();
      } else if (res.data.data == "登陆无效") {
        // token失效了 清空token 和 vuex中的用户信息
        window.localStorage.removeItem("tokenValue");
        this.$store.commit("updateUserInfo", {});
        this.$message.info("登录失效,请重新登录后重试!");
        return;
      }
    },

    // 获取文章分类
    async getArticalType() {
      let res = await this.$request("/dqtype/list", { pageSize: 30 });
      console.log(res);
      this.articleType = res.data.data.list;
    },

    // 事件
    // 点击卡片头部的回调
    clickHead() {
      if (this.isMinimize) {
        this.isMinimize = false;
      }
    },

    // 点击关闭卡片的回调
    closeCard() {
      // 重置所有数据
      this.isEnlarge = false;
      this.isMinimize = false;
      this.isMdLiveShow = false;
      if (!this.originArticle.articleId) {
        this.newArticleData = {
          typeId: null,
          articletitle: "",
          articlecontent: "",
          articleImage:
            "https://chen110.oss-cn-guangzhou.aliyuncs.com/2021/08/03/wallhaven-4ooz99.jpg",
        };
      } else {
        this.newArticleData.typeId = this.originArticle.typeId;
        this.newArticleData.articleTitle = this.originArticle.articleTitle;
        this.newArticleData.articleContent = this.originArticle.articleContent;
        this.newArticleData.articleImage = this.originArticle.articleImage;
        this.newArticleData.articleId = this.originArticle.articleId;
      }
      this.$emit("closeCard");
    },

    // 封面上传成功的回调
    uploadSuccess(e) {
      console.log(e);
      this.newArticleData.articleImage = e.data.file.url;
      this.$message.success("封面上传成功!");
    },

    // 封面上传失败的回调
    uploadError(e) {
      console.log(e);
      this.$message.error("封面上传失败, 请稍后重试!");
    },

    // 文章图片上传成功的回调
    imgUploadSuccess(e) {
      console.log(e);
      let img = `![${e.data.file.name}](${e.data.file.url} "${e.data.file.name}")   `;
      this.newArticleData.articleContent += img;
    },

    // 文章图片上传失败的回调
    imgUploadError(e) {
      console.log(e);
      this.$message.error("图片上传失败, 请稍后重试!");
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
        this.$message.warning("上传的图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isImg1M) {
        this.$message.warning("上传的图片大小不能超过 1MB 哦!");
      }
      // 返回false可以阻止图片上传
      return isImg && isImg1M;
    },
  },

  created() {
    this.getArticalType();
  },

  watch: {
    originArticle(current) {
      if (current.articleId) {
        this.newArticleData.typeId = current.typeId;
        this.newArticleData.articleTitle = current.articleTitle;
        this.newArticleData.articleContent = current.articleContent;
        this.newArticleData.articleImage = current.articleImage;
        this.newArticleData.articleId = current.articleId;
      }
    },
  },

  computed: {
    handleMarkDown() {
      if (this.isMdLiveShow) {
        const md = new MarkDownIt();
        const result = md.render(this.newArticleData.articleContent);

        return `<div class="mdTips">md效果预览:</div>` + result;
      }
    },
  },
};
</script>

<style scoped lang="less">
.writeCard {
  background-color: white;
  position: fixed;
  z-index: 3100;
  left: calc(50vw - 435px);
  bottom: -300px;
  height: 300px;
  width: 870px;
  transition: all 0.4s ease;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.11);
}

.showCard {
  bottom: 0px;
}

.minimize {
  bottom: -260px;
}

.hideCard {
  bottom: -320px;
}

.enlarge {
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  border-radius: 0;
}

.cardContorl {
  position: absolute;
  right: 8px;
  top: 3px;
  display: flex;
}

.contorlItem {
  margin: 10px 12px;
  cursor: pointer;
  color: rgb(121, 121, 121);
}

.cardHead {
  height: 40px;
  width: 100%;
}

.clickAble {
  cursor: pointer;
}

.cardBody {
  display: flex;
  padding: 0 20px;
  height: calc(100% - 100px);
  box-sizing: border-box;
}

.left {
  width: 80px;
}

.left .el-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  height: 100%;
  width: 100%;
}

.title,
.content,
.title:focus,
.content:focus {
  border: none;
  outline: none;
  margin: 10px 0;
  color: rgb(34, 34, 34);
}

.content {
  word-break: break-all;
}

.title {
  font-size: 16px;
  letter-spacing: 1px;
  width: calc(100% - 180px);
}

.contentContainer {
  display: flex;
  height: 80%;
}

.contentInput {
  position: relative;
  flex: 1;
}

.content {
  line-height: 22px;
  letter-spacing: 0.8px;
  resize: none;
  height: calc(100% - 30px);
  width: 100%;
  font-size: 15px;
}

.contentContainer .el-image {
  width: 100px;
  margin-left: 20px;
  cursor: pointer;
}

.cardBottomContorl {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.el-select {
  width: 120px;
  margin-right: 20px;
}

.el-select:focus,
.el-select /deep/ .el-input__inner:focus,
.el-select /deep/ .el-input.is-focus .el-input__inner {
  border-color: inherit;
}

.el-select-dropdown__item.selected {
  color: #355a86;
}

.articleCover {
  position: absolute;
  right: 5%;
  bottom: 0;
}

.mdLive {
  height: 100%;
  transition: all 0.5s ease;
  border-left: 1px solid #ddd;
  margin-left: 10px;
}

.mdLiveHide {
  position: relative;
  left: 35px;
}

.mdLiveShow {
  flex: 1;
  box-sizing: border-box;
  padding-left: 15px;
  overflow: scroll;
}

.bottomBtn {
  font-size: 13px;
  color: rgb(122, 122, 122);
  cursor: pointer;
  margin: 0 10px;
  user-select: none;
}

.bottomBtnContainer {
  display: flex;
  align-items: center;
}

.popoverImg {
  width: 100%;
  z-index: 10000;
}
</style>
