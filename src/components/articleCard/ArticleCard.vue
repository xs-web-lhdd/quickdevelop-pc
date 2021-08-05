<template>
  <div class="articleCard">
    <!-- 添加 -->
    <div
      class="cardItem addItem"
      @click="$emit('addArticle')"
      v-if="$route.params.id == $store.state.userInfo.userId"
    >
      <div class="articleImageContainer addItemImgContainer">
        <i class="iconfont icon-tianjiajiahaowubiankuang"></i>
      </div>
      <div class="text">
        <div class="content addContent">点击添加文章</div>
      </div>
    </div>
    <!-- 文章 -->
    <div
      class="cardItem"
      v-for="(item, index) in articleList"
      :key="index"
      @click="gotoArticle(item.articleId)"
    >
      <div class="articleImageContainer">
        <el-image
          :src="item.articleImage ? item.articleImage : ''"
          lazy
          fit="cover"
          class="artileImage"
        ></el-image>
      </div>
      <div class="text">
        <div class="title">{{ item.articleTitle }}</div>
        <div class="publishDate">
          {{ item.createTime | handleArticleDateShow }}
        </div>
        <div
          class="content mdContent"
          v-html="handleMarkDown(item.articleContent)"
        ></div>
      </div>
      <div
        class="deleteBtn"
        @click.stop="deleteCurrentArticle(item.articleId)"
        v-if="$store.state.userInfo.userId == $route.params.id"
      >
        <i class="iconfont icon-shanchu1"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { handleArticleDateShow } from "plugins/utils.js";

import MarkDownIt from "markdown-it";

export default {
  name: "articleCard",
  props: {
    articleList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  filters: {
    handleArticleDateShow,
  },
  data() {
    return {};
  },
  methods: {
    // 事件
    // 点击articleItem的回调
    gotoArticle(id) {
      this.$router.push({ name: "article", params: { id } });
      window.scrollTo(0, 0);
    },

    // 点击删除当前文章的回调
    async deleteCurrentArticle(id) {
      this.$confirm("确认要删除此文章吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$request(`/dqarticle/delete/${id}`);
          console.log(res);
          if (res.data.code == 200) {
            this.$emit("reFreshArticleList");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 处理markdown文本
    handleMarkDown(content) {
      const md = new MarkDownIt();
      const result = md.render(content);
      return result;
    },
  },
};
</script>

<style scoped>
.articleCard {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.cardItem {
  position: relative;
  width: 23.5%;
  height: 410px;
  margin-bottom: 30px;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-right: 2%;
  cursor: pointer;
}

.deleteBtn {
  background-color: #ff1332;
  color: #ffffff;
  position: absolute;
  right: -40px;
  top: 10px;
  height: 0;
  width: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  display: flex;
  transition: all 0.4s ease;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
}

.deleteBtn i {
  font-size: 20px;
}

.cardItem:hover .deleteBtn {
  right: 10px;
  height: 35px;
  width: 35px;
}

.cardItem:nth-child(4n) {
  margin-right: 0;
}

.cardItem:hover .artileImage {
  transform: scale(1.1);
}

.articleImageContainer {
  height: 230px;
  overflow: hidden;
}

.artileImage {
  height: 230px;
  width: 100%;
  transition: all 0.5s ease;
}

.text {
  padding: 15px 25px;
  font-size: 14px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.publishDate {
  color: rgb(117, 117, 117);
  padding: 15px 0;
}

.content {
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.addItemImgContainer {
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addItemImgContainer .iconfont {
  font-size: 100px;
  font-weight: bold;
  color: #c4c7cf;
  transition: all 0.4s ease;
}

.cardItem:hover .iconfont {
  transform: scale(1.1);
}

.addContent {
  text-align: center;
  margin-top: 30px;
}
</style>
