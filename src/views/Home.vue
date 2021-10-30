<template>
  <div class="home">
    <div class="background"><span>FORUM</span></div>

    <!-- 文章列表 -->
    <div class="articleAreaContainer">
      <div class="articleArea">
        <div
          class="articleItem"
          v-for="(item, index) in articleListData.list"
          :key="index"
        >
          <!-- 复数item -->
          <div class="articleItemContainer" v-if="index % 2 == 0">
            <div
              class="articleImg"
              @click="
                $router.push({
                  name: 'article',
                  params: { id: item.articleId },
                })
              "
            >
              <img :src="item.articleImage" alt="" />
            </div>
            <div
              class="articleInfo"
              @click="
                $router.push({
                  name: 'article',
                  params: { id: item.articleId },
                })
              "
            >
              <div class="createTime">
                {{ item.createTime | handleArticleDateShow }}
              </div>
              <div class="articleTitle">{{ item.articleTitle }}</div>
              <div
                class="articleContent mdContent"
                v-html="handleMarkDown(item.articleContent)"
              ></div>
              <div class="articleData">
                <div class="authorNickname">
                  <i class="iconfont icon-denglu2"></i>
                  {{ item.authorNickname }}
                </div>
                <div class="likecount">
                  <i class="iconfont icon-dianzan"></i> 1171
                </div>
                <div class="commentNum">
                  <i class="iconfont icon-kuaisuhuifu"></i>
                  {{ item.commentNum }}
                </div>
              </div>
            </div>
          </div>
          <!-- 单数item -->
          <div class="articleItemContainer" v-else>
            <div
              class="articleInfo"
              @click="
                $router.push({
                  name: 'article',
                  params: { id: item.articleId },
                })
              "
            >
              <div class="createTime">
                {{ item.createTime | handleArticleDateShow }}
              </div>
              <div class="articleTitle">{{ item.articleTitle }}</div>
              <div
                class="articleContent mdContent"
                v-html="handleMarkDown(item.articleContent)"
              ></div>
              <div class="articleData">
                <div class="authorNickname">
                  <i class="iconfont icon-denglu2"></i>
                  {{ item.authorNickname }}
                </div>
                <div class="likecount">
                  <i class="iconfont icon-dianzan"></i> 1171
                </div>
                <div class="commentNum">
                  <i class="iconfont icon-kuaisuhuifu"></i>
                  {{ item.commentNum }}
                </div>
              </div>
            </div>
            <div
              class="articleImg"
              @click="
                $router.push({
                  name: 'article',
                  params: { id: item.articleId },
                })
              "
            >
              <img :src="item.articleImage" alt="" />
            </div>
          </div>
        </div>
        <div
          class="loadMore"
          v-if="articleListData.hasNextPage"
          @click="loadMore"
        >
          加载更多
        </div>
        <div class="record">
          <a href="https://beian.miit.gov.cn/" target="_blank"
            >粤ICP备2021068014号</a
          >
        </div>
      </div>
    </div>

    <!-- 返回顶部组件 -->
    <go-top></go-top>
  </div>
</template>

<script>
import MarkDownIt from "markdown-it";

import { handleArticleDateShow } from "plugins/utils.js";

import GoTop from "components/goTop/GoTop.vue";
export default {
  components: { GoTop },
  name: "home",
  data() {
    return {
      // 文章列表
      articleListData: {},
      // 当前页数
      currentPage: 1,
    };
  },
  methods: {
    // 请求
    // 请求文章数据
    // 获取所有文章
    async getAllArticle() {
      let res = await this.$request("/dqarticle/superlist", {
        pageNum: this.currentPage,
        pageSize: 10,
      });
      console.log(res);
      // console.log(res);
      if (res.data.code == 200) {
        this.articleListData = res.data.data;
        // 返回顶部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    // 事件
    // 处理markdown
    handleMarkDown(content) {
      let md = new MarkDownIt();
      let result = md.render(content);
      return result;
    },

    // 滚到到底部触发加载更多的回调
    async loadMore() {
      console.log("触发请求下一页数据");
      this.currentPage++;
      let res = await this.$request("/dqarticle/superlist", {
        pageNum: this.currentPage,
        pageSize: 10,
      });
      console.log(res);
      this.articleListData.list.push(...res.data.data.list);
      this.articleListData.hasNextPage = res.data.data.hasNextPage;
    },
  },
  filters: {
    handleArticleDateShow,
  },
  created() {
    this.getAllArticle();
  },
  mounted() {
    // 开启时监听滚轮事件
    const background = document.querySelector(".background");
    window.addEventListener("scroll", (e) => {
      // console.log(window.scrollY);
      let scrollY = window.scrollY;

      if (window.scrollY !== 0) {
        if (scrollY < document.body.clientHeight) {
          // console.log(123);
          background.style.backgroundPosition = `calc(${scrollY}px) calc(100% + ${scrollY}px)`;
        }
      } else {
        background.style.backgroundPosition = "";
      }
    });
  },
};
</script>

<style scoped lang="less">
.home {
  margin: 0;
  padding: 0;
  height: 100vh;
}

.background {
  background-image: url("~assets/img/cloud.jpg");
  background-size: cover;
  background-position: 0% 100%;
  height: 100vh;
  font: 900 18rem "";
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-align: center;
  overflow: hidden;
  padding-top: 35vh;
  box-sizing: border-box;
  user-select: none;
}

.background::before {
  content: "";
  background-size: cover;
  background-image: inherit;
  background-position: 0% 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -100;
}

.articleAreaContainer {
  width: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
  position: relative;
}

.articleArea {
  max-width: 1200px;
  width: 85vw;
  margin: 0 auto;
  padding: 30px 0;
}

.articleItem {
  margin-top: 70px;
  width: 100%;
}

.articleItemContainer {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 50px;
}

.articleImg {
  flex: 1;
  margin: 0 20px;
  cursor: pointer;
}

.articleImg img {
  width: 100%;
  height: 60vh;
  max-height: 500px;
  border-radius: 10px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.articleInfo {
  width: 390px;
  box-sizing: border-box;
  padding: 40px 30px;
  // background-color: pink;
  border-radius: 10px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #fdfdfd;
  cursor: pointer;
}

.articleContent {
  /* 多行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.createTime {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.articleTitle {
  font-size: 28px;
  color: #333;
  line-height: 35px;
  margin: 10px 0;
  /* 多行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.articleContent {
  font-size: 15px;
  color: #333;
  line-height: 24px;
}

.articleData {
  display: flex;
  color: #999;
  font-size: 14px;
  margin-top: 30px;
  div {
    margin-right: 20px;
  }

  i {
    font-size: 14px;
    margin-right: 2px;
  }
}

// 网上抄的拟态按钮嘻嘻
.loadMore {
  padding: 13px 20px;
  margin: 50px auto;
  text-align: center;
  width: 80px;
  cursor: pointer;
  border-radius: 5px;
  color: #555;
  font-weight: bold;
  // border: 1px solid #eee;
  font-size: 14px;
  letter-spacing: 1px;
  background-color: #f8f8f8;
  box-shadow: -2px -2px 8px rgba(255, 255, 255, 1),
    -2px -2px 12px rgba(255, 255, 255, 0.5),
    inset 2px 2px 4px rgba(255, 255, 255, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.15);
}

.loadMore:hover {
  box-shadow: inset -2px -2px 8px rgba(255, 255, 255, 1),
    inset -2px -2px 12px rgba(255, 255, 255, 0.5),
    inset 2px 2px 4px rgba(255, 255, 255, 0.1),
    inset 2px 2px 8px rgba(0, 0, 0, 0.15);
}

// 备案
.record {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  a {
    color: #888;
    text-decoration: none;
  }
}
</style>
