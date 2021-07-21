<template>
  <div class="articleCard">
    <div class="cardItem" v-for="(item, index) in articleList" :key="index">
      <el-image
        :src="
          item.articleImage
            ? '/articleImg' + item.articleImage.split('.com')[1]
            : ''
        "
        lazy
        fit="cover"
        class="artileImage"
      ></el-image>
      <div class="text">
        <div class="title">{{ item.articleTitle }}</div>
        <div class="publishDate">
          {{ item.createTime | handleArticleDateShow }}
        </div>
        <div class="content">
          {{ item.articleContent }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleArticleDateShow } from "plugins/utils.js";

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
  methods: {},
};
</script>

<style scoped>
.articleCard {
  display: flex;
  flex-wrap: wrap;
}

.cardItem {
  width: 22vw;
  height: 410px;
  margin-bottom: 30px;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-right: 1vw;
  cursor: pointer;
}

.cardItem:nth-child(4n) {
  margin-right: 0;
}

.artileImage {
  height: 230px;
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
  /* 三行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
