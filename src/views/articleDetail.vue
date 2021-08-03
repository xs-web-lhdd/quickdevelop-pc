<template>
  <div class="articleDetailContainer">
    <div class="articleDetail">
      <div class="left">
        <div class="card">
          <img :src="articleData.articleImage" alt="" class="coverImg" />
          <div class="leftContent">
            <div class="title">
              {{ articleData.articleTitle }}
            </div>
            <!-- 用户信息 -->
            <div class="author">
              <div class="authorAvatar">
                <el-image
                  class="avatar"
                  :src="
                    articleData.avatar && articleData.avatar != ''
                      ? '/imgreq' + articleData.avatar.split('.com')[1]
                      : require('assets/img/defaultAvatar.jpg')
                  "
                  alt=""
                  lazy
                  fit="cover"
                  @click="gotoPersonal(articleData.authorId)"
                />
              </div>
              <div
                class="authorName"
                @click="gotoPersonal(articleData.authorId)"
              >
                {{ articleData.authorNickname }}
              </div>
              <div class="publishDate">
                {{ articleData.createTime }}
                <div
                  class="updatearticle"
                  v-if="articleData.authorId == $store.state.userInfo.userId"
                >
                  <div @click="isWriteCardShow = true">更新文章</div>
                  <div class="fenge">|</div>
                  <div @click="deleteCurrentArticle">删除文章</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 文章内容 -->
          <div class="content detailtContent" v-html="handleMarkDown"></div>
          <div class="commentControl">
            <div
              class="commentControlItem"
              :class="isUserLike ? 'controlItemDone' : ''"
              @click="likeCurrentArticle(!isUserLike)"
            >
              <i class="iconfont icon-dianzan"></i>
              {{ (isUserLike ? "已点赞" : "点赞") + "  " + this.likeCount }}
            </div>
            <div class="likeUsersAvatar">
              <el-image
                v-for="(item, index) in likeUserList"
                :key="index"
                :src="
                  item.avatar && item.avatar.split('.com')[1]
                    ? '/imgreq' + item.avatar.split('.com')[1]
                    : require('assets/img/defaultAvatar.jpg')
                "
                fit="cover"
              ></el-image>
            </div>
          </div>
        </div>
        <div class="card leftContent">
          <!-- 评论区 -->
          <comment-area
            :commentData="commentData"
            :floorCommentList="floorCommentList"
            :currentPage="currentCommentPage"
            @reFreshComment="({ type, index }) => reFreshComment(type, index)"
            @getFloorCommentList="({ id, index }) => getFloorComment(id, index)"
            @changePage="changeCommentPage"
          ></comment-area>
        </div>
      </div>
      <div class="right">广告位招租</div>
    </div>
    <!-- 返回顶部组件 -->
    <!-- 编辑组件 -->
    <write-card
      :isCardShow="isWriteCardShow"
      :originArticle="articleData"
      @closeCard="isWriteCardShow = false"
      @reFreshArticleList="getarticleData($route.params.id)"
    ></write-card>
    <go-top></go-top>
  </div>
</template>

<script>
import MarkDownIt from "markdown-it";

import CommentArea from "../components/commentArea/CommentArea.vue";
import GoTop from "../components/goTop/GoTop.vue";
import WriteCard from "../components/writeCard/WriteCard.vue";
export default {
  name: "articleDetail",
  components: {
    CommentArea,
    GoTop,
    WriteCard,
  },

  data() {
    return {
      // 文章数据
      articleData: {},
      // 评论数据
      commentData: {},
      // 楼层评论数据
      floorCommentList: [],
      // 当前用户是否点赞了该文章
      isUserLike: false,
      // 该文章的点赞数量
      likeCount: 0,
      // 点赞了该文章的用户
      likeUserList: [],
      // 是否显示编辑组件
      isWriteCardShow: false,
      // 当前评论页数
      currentCommentPage: 1,
    };
  },
  methods: {
    // 请求
    // 请求文章数据
    async getarticleData(id) {
      let res = await this.$request(`/dqarticle/${id}`);
      // console.log(res);
      this.articleData = res.data.data;
    },

    // 获取文章的点赞数
    async getArticleLike(id) {
      let res = await this.$request(`/dqlike/getlikes/${id}`);
      // console.log(res);
      this.likeCount = res.data.data;
    },

    // 获取当前用户的点赞状态
    async getIsUserLike(id) {
      if (!window.localStorage.getItem("tokenValue")) return;

      let res = await this.$request(`/dqlike/status/${id}`);
      // console.log(res);
      this.isUserLike = res.data.data == 1;
    },

    // 请求文章的所有根评论
    async getarticleComment(id) {
      let res = await this.$request(
        `/dqcomment/superlist?articleId=${id}&pageSize=20&pageNum=${this.currentCommentPage}`
      );
      console.log(res);
      if (res.data.code == 200) {
        res.data.data.list.forEach((item, index, arr) => {
          arr[index].floorCommentList = [];
        });

        this.commentData = res.data.data;
      } else if (res.data.code == 404) {
        // 文章数据为空
        this.commentData = {};
      }
    },

    // 请求当前评论的二级回复
    async getFloorComment(id, index) {
      let res = await this.$request(`/dqcomment/dqroot/${id}`);
      // console.log(res);
      // this.floorCommentList = res.data.data.list;
      if (res.data.code == 200) {
        this.commentData.list[index].floorCommentList = res.data.data.list;
      } else {
        // 随便往数组添加个数
        this.commentData.list[index].floorCommentList.push(1);
        this.$message.warning("此评论暂无回复哦!");
      }
    },

    // 请求点赞指定文章的所有用户
    async getLikeUsers(id) {
      let res = await this.$request(`/dqlike/getlikeusers/${id}?pageSize=3`);
      // console.log(res);

      if (res.data.code == 200) {
        this.likeUserList = res.data.data.list;
      } else if (res.data.code == 404) {
        this.likeUserList = [];
      }
    },

    // 事件
    // 更新评论数据
    reFreshComment(type, index) {
      if (type == 1) {
        this.getarticleComment(this.$route.params.id);
      } else if (type == 2) {
        // console.log(index);
        this.getFloorComment(this.commentData.list[index].commentId, index);
      }
    },

    // 点击喜欢文章的回调
    async likeCurrentArticle(flag) {
      if (flag) {
        // 判断是否登录
        if (!window.localStorage.getItem("tokenValue")) {
          this.$message.info("登录后才能为该文章点赞哦!");
          return;
        }
        let res = await this.$request(`dqlike/like/${this.$route.params.id}`);
        // console.log(res);
        if (res.data.code == 200) {
          this.isUserLike = flag;
          this.getLikeUsers(this.$route.params.id);
          this.getArticleLike(this.$route.params.id);
        } else if (res.data.data == "登陆无效") {
          // token失效了 清空token 和 vuex中的用户信息
          window.localStorage.removeItem("tokenValue");
          this.$store.commit("updateUserInfo", {});
          this.$message.info("登录失效,请重新登录后重试!");
          return;
        }
      } else {
        let res = await this.$request(`dqlike/unlike/${this.$route.params.id}`);
        if (res.data.code == 200) {
          this.isUserLike = flag;
          this.getLikeUsers(this.$route.params.id);
          this.getArticleLike(this.$route.params.id);
        }
      }
    },

    // 点击删除当前文章的回调
    async deleteCurrentArticle() {
      this.$confirm("确认要删除此文章吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$request(
            `/dqarticle/delete/${this.$route.params.id}`
          );
          // console.log(res);
          if (res.data.code == 200) {
            this.$router.replace("/community");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 跳转至个人主页
    gotoPersonal(id) {
      this.$router.push({
        name: "personal",
        params: { id },
        query: { type: "post", page: 1 },
      });
    },

    // 分页的回调
    changeCommentPage(e) {
      this.currentCommentPage = e;
      this.getarticleComment(this.$route.params.id);
    },
  },

  computed: {
    handleMarkDown() {
      if (!this.articleData.articleContent) return;
      const md = new MarkDownIt();
      const result = md.render(this.articleData.articleContent);
      return result;
    },
  },

  async created() {
    await this.getarticleData(this.$route.params.id);
    await this.getarticleComment(this.$route.params.id);
    await this.getArticleLike(this.$route.params.id);
    await this.getIsUserLike(this.$route.params.id);
    await this.getLikeUsers(this.$route.params.id);
  },

  mounted() {},
};
</script>

<style scoped>
.articleDetailContainer {
  display: flex;
  justify-content: center;
}

.articleDetail {
  display: flex;
  max-width: 1200px;
  width: 90vw;
  padding: 40px 0;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.left {
  flex: 1;
  margin: 0 20px;
}

.card {
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 30px;
}

.leftContent {
  padding: 30px 30px 0px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.right {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 90px;
  width: 250px;
  height: 500px;
  background-color: #bc1a25;
  color: #e3da48;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  letter-spacing: 15px;
  /* 文字竖直排列 */
  writing-mode: vertical-lr;
  font-weight: bold;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.title {
  font-weight: bold;
  font-size: 28px;
  line-height: 37px;
  margin-bottom: 20px;
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.author {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.authorName {
  color: #4480c9;
  cursor: pointer;
  margin: 0 20px 0 10px;
}

.publishDate {
  font-size: 13px;
  color: rgb(136, 136, 136);
  position: relative;
  flex: 1;
}

.updatearticle {
  position: absolute;
  right: 0;
  top: 0px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  display: flex;
}

.updatearticle .fenge {
  margin: 0 10px;
  color: #ccc;
}

.content {
  font-size: 15px;
  color: #111;
  line-height: 23px;
  word-break: break-all;
  margin-bottom: 20px;
  padding: 0 30px;
}

.contentImg {
  margin-top: 20px;
  width: 85%;
  margin-left: 7.5%;
}

.commentControl {
  margin: 30px 0 50px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  position: relative;
}

.commentControlItem {
  padding: 8px 15px;
  background-color: #e5efff;
  color: #0066ff;
  cursor: pointer;
  font-size: 14px;
  border-radius: 7px;
}

.commentControlItem:hover {
  background-color: #d9e8ff;
}

.controlItemDone {
  background-color: #0066ff;
  color: white;
}

.controlItemDone:hover {
  background-color: #0066ff;
}

.likeUsersAvatar {
  position: absolute;
  right: 30px;
  width: 70px;
}

.likeUsersAvatar .el-image {
  position: absolute;
  right: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.el-image:nth-child(1) {
  z-index: 3;
}

.likeUsersAvatar .el-image:nth-child(2) {
  z-index: 2;
  right: 17.5px;
}

.likeUsersAvatar .el-image:nth-child(3) {
  z-index: 1;
  right: 35px;
}

.coverImg {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>