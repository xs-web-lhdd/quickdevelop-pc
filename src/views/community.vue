<template>
  <div class="communityContainer">
    <div class="community">
      <div class="left">
        <div class="write">
          <el-button type="primary" class="writeButton" @click="writeArticle">
            写文章</el-button
          >
        </div>
        <div class="sort">
          <div
            class="sortItem"
            :class="$route.query.typeId == 0 ? 'currentItem' : ''"
            @click="changeType(0)"
          >
            <i class="iconfont icon-xiaoxi"></i>&nbsp;&nbsp;所有文章
          </div>
          <div
            class="sortItem"
            :class="$route.query.typeId == item.typeId ? 'currentItem' : ''"
            v-for="(item, index) in allType"
            :key="index"
            @click="changeType(item.typeId)"
          >
            <i class="iconfont icon-xiaoxi"></i>&nbsp;&nbsp;{{ item.typeName }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="article" v-loading="isDataLoad">
          <div
            class="articleItem"
            v-for="(item, index) in articleList"
            :key="index"
            @click="
              $router.push({ name: 'article', params: { id: item.articleId } })
            "
          >
            <div class="userAvatar">
              <img
                :src="
                  item.avatar && item.avatar != ''
                    ? item.avatar
                    : require('assets/img/defaultAvatar.jpg')
                "
                alt=""
                lazy
                fit="cover"
              />
            </div>
            <div class="ItemCenter">
              <div class="title">{{ item.articleTitle }}</div>
              <div class="publishDate">
                {{ item.createTime | handleArticleDateShow }}
              </div>
              <div
                class="content mdContent"
                v-html="handleMarkDown(item.articleContent)"
              ></div>
              <div class="articleImg">
                <img
                  v-if="item.articleImage != ''"
                  :src="item.articleImage"
                  class="articleImgItem"
                  fit="contain"
                  lazy
                />
              </div>
            </div>
            <div class="ItemRight">
              <div class="replyCount">
                <i class="iconfont icon-kuaisuhuifu"></i>
                {{ item.commentNum }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="nullTips"
          v-if="articleList.length == 0 && isDataLoad == false"
        >
          Article Not Found !
        </div>

        <div class="bottom" v-if="!isDataLoad && articleList.length !== 0">
          <!-- 分页组件 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :current-page="this.$route.query.page * 1"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加文章组件 -->
    <write-card
      :isCardShow="isWriteCardShow"
      @reFreshArticleList="reFreshArticleList"
      @closeCard="isWriteCardShow = false"
    ></write-card>

    <!-- 返回顶部组件 -->
    <go-top></go-top>
  </div>
</template>

<script>
import MarkDownIt from "markdown-it";

import { handleArticleDateShow } from "plugins/utils.js";
import GoTop from "components/goTop/GoTop.vue";
import WriteCard from "components/writeCard/WriteCard.vue";

export default {
  name: "community",
  components: {
    GoTop,
    WriteCard,
  },
  data() {
    return {
      imgArr: [],
      // 文章数据
      articleList: [],
      // 所有分类
      allType: [],
      // 是否显示写文章组件
      isWriteCardShow: false,
      // 总条数
      totalCount: 0,
      // 是否正在加载数据
      isDataLoad: true,
    };
  },
  methods: {
    // 请求
    // 获取所有文章
    async getAllArticle() {
      this.isDataLoad = true;
      let res = await this.$request("/dqarticle/superlist", {
        pageNum: this.$route.query.page,
        pageSize: 10,
      });
      // console.log(res);
      if (res.data.code == 200) {
        // // 查询评论数量
        // res.data.data.list.forEach(async (item, index, arr) => {
        //   let num = await this.getArticleCommentNum(item.articleId);
        //   // console.log(num);
        //   // arr[index].commentNum = num;
        //   // 直接添加属性 vue检测不到 视图不会更新
        //   this.$set(arr[index], "commentNum", num);
        // });

        this.totalCount = res.data.data.total;
        this.articleList = res.data.data.list;
        this.isDataLoad = false;
        // 返回顶部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },

    // 获取所有分类
    async getAllType() {
      let res = await this.$request("/dqtype/list", { pageSize: 30 });
      // console.log(res);
      this.allType = res.data.data.list;
    },

    // 搜索文章
    async searchArticle() {
      this.isDataLoad = true;
      let res = await this.$request(
        `/dqarticle/superlist?articleTitle=${this.$route.query.articleTitle}`,
        { pageNum: 1, pageSize: 10 }
      );
      console.log(res);
      if (res.data.code == 200) {
        this.totalCount = res.data.data.total;
        this.articleList = res.data.data.list;
      } else if (res.data.code == 404) {
        // 未查询到文章
        this.totalCount = 0;
        this.articleList = [];
      }
      this.isDataLoad = false;
    },

    // 根据类型的id查询文章
    async getArticleById(id) {
      this.isDataLoad = true;
      let res = await this.$request(`/dqarticle/superlist?typeId=${id}`, {
        pageNum: this.$route.query.page,
        pageSize: 10,
      });
      console.log(res);
      if (res.data.code == 200) {
        // // 查询评论数量
        // res.data.data.list.forEach(async (item, index, arr) => {
        //   let num = await this.getArticleCommentNum(item.articleId);
        //   console.log(num);
        //   // arr[index].commentNum = num;
        //   // 直接添加属性 vue检测不到 视图不会更新
        //   this.$set(arr[index], "commentNum", num);
        // });

        this.articleList = res.data.data.list;
        this.totalCount = res.data.data.total;
        this.isDataLoad = false;
        // 返回顶部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else if (res.data.code == 404) {
        this.articleList = [];
        this, (this.totalCount = 0);
        this.isDataLoad = false;
      }
    },

    // 查询当前id的文章的评论总数量
    async getArticleCommentNum(id) {
      if (id == undefined) return;
      let res = await this.$request(`/number/dqarticle/${id}`);
      // console.log(res);
      if (res.data.code == 200) {
        let num = res.data.data;
        return num;
      }
    },

    // 事件
    // 点击分类的回调
    changeType(id) {
      // 判断是否重复点击
      // if (this.currentTypeId == id) return;
      // this.currentTypeId = id;
      if (this.$route.query.typeId == id) return;
      this.$router.push({ name: "community", query: { typeId: id, page: 1 } });
      // this.currentTypeId = this.$route.params.typeId;
      // 清空当前文章列表
      // this.articleList = [];
      // this.currentPage = 1;
      if (id == 0) {
        // 查询全部文章
        this.getAllArticle();
      } else {
        this.getArticleById(id);
      }
    },

    // 添加文章成功的回调
    // 根据当前分类重新获取文章数据
    reFreshArticleList() {
      if (this.$route.query.typeId == 0) {
        this.getAllArticle();
      } else {
        this.getArticleById(this.$route.query.typeId);
      }
    },

    // 切换分页的回调
    changePage(e) {
      // console.log(e);
      // this.currentPage = e;
      this.$router.push({
        name: "community",
        query: { typeId: this.$route.query.typeId, page: e },
      });
      if (this.$route.query.typeId == 0) {
        // 查询全部文章
        this.getAllArticle();
      } else {
        this.getArticleById(this.$route.query.typeId);
      }
    },

    // 点击写文章的回调
    writeArticle() {
      // 判断是否登录
      if (!window.localStorage.getItem("tokenValue")) {
        this.$message.info("登录后才能发布文章哦!");
        return;
      }

      this.isWriteCardShow = true;
    },

    handleMarkDown(content) {
      let md = new MarkDownIt();
      let result = md.render(content);
      return result;
    },
  },
  computed: {},
  filters: {
    handleArticleDateShow,
  },
  watch: {
    // 这里监听路由的参数 因为index的router-view中的key绑定的是$route.path 所以在community页面中搜索 只是改变了query参数 是监听不到的
    // 但也不能在index的router-view中的key绑定$route.fullPath 不然分页等操作也会导致整个页面的刷新
    "$route.query"(current) {
      // console.log(this.$route);
      // 如果存在articlTitle 并且不存在typeId
      if (current.articleTitle && !current.typeId) {
        console.log(current.articleTitle);
        this.searchArticle();
      } else if (current.typeId == 0 && current.page == 1) {
        this.getAllArticle();
      }
    },
  },
  created() {
    // 查询分类
    this.getAllType();
    // 查询文章列表数据
    // typeId==0 全部分类  !typeId 搜索   typeId==id  类型id为id的分类
    if (this.$route.query.typeId == 0) {
      this.getAllArticle();
    } else if (!this.$route.query.typeId) {
      this.searchArticle();
    } else {
      this.getArticleById(this.$route.query.typeId);
    }
  },
};
</script>

<style scoped>
.communityContainer {
  display: flex;
  justify-content: center;
  font-size: 15px;
}

.community {
  display: flex;
  max-width: 1200px;
  width: 85vw;
}

.left {
  position: sticky;
  top: 74px;
  padding: 20px 0;
  width: 200px;
  /* 74px+padding上下的20px */
  height: calc(100vh - 114px);
  color: rgb(83, 83, 83);
  font-size: 13px;
}

.right {
  padding: 10px 20px 20px;
  width: calc(100% - 200px);
}

.writeButton {
  width: 100%;
  margin-bottom: 10px;
}

.sortItem {
  margin: 15px 0;
  cursor: pointer;
}

.currentItem {
  color: #18365b;
  font-weight: 600;
}

.articleItem {
  display: flex;
  position: relative;
  border-bottom: 1px solid #eee;
  padding: 20px 20px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.15s;
}

.articleItem:hover {
  background-color: #f2f6fb;
}

.userAvatar {
  width: 45px;
}

.userAvatar img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.ItemCenter {
  width: 700px;
  margin: 0 10px;
}

.ItemCenter div {
  margin-bottom: 1px;
  line-height: 18px;
}

.title {
  color: rgb(43, 43, 43);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.publishDate {
  color: rgb(136, 136, 136);
  margin: 4px 0;
  font-size: 12px;
}

.content {
  color: rgb(136, 136, 136);
  font-size: 14px;
  line-height: 19px;
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.articleImg {
  margin: 15px 0 10px;
  display: flex;
  justify-content: start;
}

.articleImg img {
  border-radius: 5px;
}

.articleImgItem {
  height: 100px;
  width: auto;
  margin-right: 10px;
}

.articleImgItem /deep/ .el-image__inner {
  width: unset;
}

.ItemRight {
  width: 45px;
  font-size: 14px;
  color: rgb(83, 83, 83);
  position: absolute;
  right: 10px;
}

.tips {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: rgb(158, 158, 158);
  margin: 20px 0;
}

.bottom {
  width: 100%;
  text-align: center;
  margin: 40px 0;
}

.communityContainer /deep/ .el-loading-spinner {
  margin-top: 80px;
}

.nullTips {
  text-align: center;
  margin-top: 20vh;
  color: #666;
  letter-spacing: 1px;
}
</style>
