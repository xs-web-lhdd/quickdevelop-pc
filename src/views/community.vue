<template>
  <div class="communityContainer">
    <div class="community">
      <div class="left">
        <div class="write">
          <el-button type="primary" class="writeButton"> 写文章</el-button>
        </div>
        <div class="sort">
          <div
            class="sortItem"
            :class="currentTypeId == 0 ? 'currentItem' : ''"
            @click="changeType(0)"
          >
            <i class="iconfont icon-xiaoxi"></i>&nbsp;&nbsp;所有文章
          </div>
          <div
            class="sortItem"
            :class="currentTypeId == item.typeId ? 'currentItem' : ''"
            v-for="(item, index) in allType"
            :key="index"
            @click="changeType(item.typeId)"
          >
            <i class="iconfont icon-xiaoxi"></i>&nbsp;&nbsp;{{ item.typeName }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="article">
          <div
            class="articleItem"
            v-for="(item, index) in articleList"
            :key="index"
            @click="
              $router.push({ name: 'article', params: { id: item.articleId } })
            "
          >
            <div class="userAvatar">
              <el-image
                :src="require('assets/img/userAvatar.png')"
                alt=""
                lazy
                fit="cover"
              ></el-image>
            </div>
            <div class="ItemCenter">
              <div class="title">{{ item.articleTitle }}</div>
              <div class="publishDate">
                {{ item.createTime | handleArticleDateShow }}
              </div>
              <div class="content">
                {{ item.articleContent }}
              </div>
              <div class="articleImg">
                <el-image
                  v-if="item.articleImage != ''"
                  :src="'/articleImg' + item.articleImage.split('.com')[1]"
                  class="articleImgItem"
                  fit="contain"
                  lazy
                ></el-image>
              </div>
            </div>
            <div class="ItemRight">
              <div class="replyCount">
                <i class="iconfont icon-kuaisuhuifu"></i> 231
              </div>
            </div>
          </div>
        </div>

        <div class="tips">下面没有内容了哦</div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleArticleDateShow } from "plugins/utils.js";

export default {
  name: "community",
  data() {
    return {
      imgArr: [],
      // 文章数据
      articleList: [],
      // 当前页数
      currentPage: 1,
      // 所有分类
      allType: [],
      // 当前分类 Id 0代表所有文章
      currentTypeId: 0,
    };
  },
  methods: {
    // 请求
    // 获取所有文章
    async getAllArticle() {
      let res = await this.$request("/dqarticle/list", {
        pageNum: this.currentPage,
        pageSize: 10,
      });
      // console.log(res);
      this.articleList.push(...res.data.data.list);
    },

    // 获取所有分类
    async getAllType() {
      let res = await this.$request("/dqtype/list");
      // console.log(res);
      this.allType = res.data.data.list;
    },

    // 根据类型的id查询文章
    async getArticleById(id) {
      let res = await this.$request(`/dqarticle/list/${id}`);
      console.log(res);
      this.articleList.push(...res.data.data);
    },

    // 事件
    // 点击分类的回调
    changeType(id) {
      // 判断是否重复点击
      if (this.currentTypeId == id) return;
      this.currentTypeId = id;
      // 清空当前文章列表
      this.articleList = [];
      if (id == 0) {
        // 查询全部文章
        this.getAllArticle();
      } else {
        this.getArticleById(id);
      }
    },
  },
  filters: {
    handleArticleDateShow,
  },
  created() {
    this.getAllType();
    this.getAllArticle();
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
  min-width: 1000px;
  width: 85vw;
}

.left {
  padding: 20px 0;
  width: 200px;
  color: rgb(83, 83, 83);
  font-size: 13px;
}

.right {
  padding: 20px;
  flex: 1;
  padding-top: 10px;
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
}

.articleItem:hover {
  background-color: #f2f6fb;
}

.userAvatar {
  width: 45px;
}

.userAvatar .el-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.ItemCenter {
  width: 80%;
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
</style>
