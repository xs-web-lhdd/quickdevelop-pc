<template>
  <div class="commentListCard">
    <div
      class="cardItem"
      v-for="(item, index) in commentList"
      :key="index"
      @click="gotoArticle(item.articleId)"
    >
      <div class="text">
        <div class="title">To {{ item.articleId }}</div>
        <div class="publishDate">
          {{ item.createTime | handleArticleDateShow }}
        </div>
        <div class="content">
          <span v-if="item.commentType == 2" class="toUserNickName">{{
            "@" + item.toNickname
          }}</span>
          {{ item.commentType == 1 ? item.content : item.content }}
        </div>
      </div>
      <div
        class="deleteBtn"
        @click.stop="deleteCurrentComment(item.commentId)"
        v-if="$store.state.userInfo.userId == $route.params.id"
      >
        <i class="iconfont icon-shanchu1"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { handleArticleDateShow } from "plugins/utils.js";

export default {
  name: "commentListCard",
  props: {
    commentList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 点击删除评论的回调
    deleteCurrentComment(id) {
      // console.log("删除" + id);
      this.$confirm("确认要删除此评论吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$request(`/dqcomment/remove/${id}`);
          console.log(res);
          if (res.data.code == 200) {
            this.$emit("reFreshCommentList");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 点击cardItem的回调
    gotoArticle(id) {
      this.$router.push({ name: "article", params: { id } });
      window.scrollTo(0, 0);
    },
  },
  filters: {
    handleArticleDateShow,
  },
};
</script>

<style scoped>
.commentListCard {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.cardItem {
  position: relative;
  width: 23.5%;
  height: 150px;
  margin-bottom: 30px;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
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
  top: -40px;
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
  top: 10px;
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

.toUserNickName {
  color: #999;
}
</style>
