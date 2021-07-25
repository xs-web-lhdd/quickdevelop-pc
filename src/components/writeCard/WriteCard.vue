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
            userInfo.avatar
              ? userInfo.avatar
              : require('assets/img/userAvatar.png')
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
          <textarea
            class="content"
            placeholder="说点什么吧"
            v-model="newArticleData.articleContent"
          ></textarea>
          <el-image
            :src="'/imgreq' + newArticleData.articleImage.split('.com')[1]"
            fit="contain"
          ></el-image>
        </div>
      </div>
    </div>
    <!-- 卡片底部控制栏 -->
    <div class="cardBottomContorl">
      <el-button type="primary" size="medium" @click="addArticle"
        >发布</el-button
      >
    </div>
  </div>
</template>

<script>
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
          "https://chen110.oss-cn-guangzhou.aliyuncs.com/2021/07/10/jisoo.png",
      },
      // 文章分类
      articleType: [],
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
        this.$emit("reFreshArticalList");
        // 关闭当前组件
        this.closeCard();
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
      if (!this.originArticle.articleId) {
        this.newArticleData = {
          typeId: null,
          articletitle: "",
          articlecontent: "",
          articleimage:
            "https://chen110.oss-cn-guangzhou.aliyuncs.com/2021/07/10/jisoo.png",
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
};
</script>

<style scoped>
.writeCard {
  background-color: white;
  position: fixed;
  z-index: 2000;
  left: calc(50vw - 435px);
  bottom: -300px;
  height: 300px;
  width: 870px;
  transition: all 0.4s ease;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
}

.showCard {
  bottom: 0px;
}

.minimize {
  bottom: -260px;
}

.hideCard {
  bottom: -300px;
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

.title {
  font-size: 16px;
  letter-spacing: 1px;
}

.contentContainer {
  display: flex;
  width: 100%;
  height: 100%;
}

.content {
  line-height: 22px;
  letter-spacing: 0.8px;
  resize: none;
  height: calc(100% - 30px);
  flex: 1;
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
</style>
