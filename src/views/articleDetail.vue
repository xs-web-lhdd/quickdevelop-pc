<template>
  <div class="articleDetailContainer">
    <div class="articleDetail">
      <div class="left">
        <div class="title">
          万事屋有约Vol.13｜在“我又买鲜花啦”小组感受花花带来的美好
        </div>
        <!-- 用户信息 -->
        <div class="author">
          <div class="authorAvatar">
            <el-image
              class="avatar"
              :src="require('assets/img/userAvatar.png')"
              alt=""
              lazy
              fit="cover"
            />
          </div>
          <div class="authorName">组长万事屋</div>
          <div class="publishDate">2021-07-07 14:58:23</div>
        </div>
        <!-- 文章内容 -->
        <div class="content">
          鲜花，对于“视花如命”的人来说，可不仅仅只是简单的装饰品。它们像一面镜子，映射着养花人的心情；
          又像一位知心朋友，陪伴着我们度过一个又一个阴天和黑夜……有了花花点缀的生活，就连空气都充满着芳香。
          在“我又买鲜花啦”小组，六万余名花花爱好者聚集在这里，分享、交流鲜花的一切。
          <el-image :src="require('assets/img/test.jpg')" class="contentImg" />
        </div>
        <!-- 评论区 -->
        <div class="commentArea">
          <div class="commentText">评论区</div>
          <div class="commentItem" v-for="(item, index) in 10" :key="index">
            <div class="userAvatar">
              <el-image
                class="avatar"
                :src="require('assets/img/userAvatar.png')"
                alt=""
                lazy
                fit="cover"
              />
            </div>
            <div class="commentInfo">
              <div class="author userInfo">
                <div class="authorName userNickName">可爱的江湖骗子</div>
                <div class="publishDate commentDate">2021-07-07 16:33:56</div>
              </div>
              <div class="commentContent">
                鲜花组里的花花真的好好看，看了就会想让人马上买花花，好好打理一下自己房间里的一隅小天地
                鲜花组里的花花真的好好看，看了就会想让人马上买花花，好好打理一下自己房间里的一隅小天地
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">广告位招租</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "articleDetail",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.articleDetailContainer {
  display: flex;
  justify-content: center;
}

.articleDetail {
  display: flex;
  min-width: 1000px;
  width: 85vw;
  padding: 40px 0;
}

.left {
  flex: 1;
  padding: 0 30px;
}

.right {
  width: 250px;
  height: 500px;
  background-color: pink;
  writing-mode: vertical-lr;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  letter-spacing: 15px;
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
  margin-bottom: 20px;
}

.author > div {
  margin-right: 10px;
}

.authorName {
  color: #4480c9;
}

.publishDate {
  font-size: 13px;
  color: rgb(136, 136, 136);
}

.content,
.commentContent {
  font-size: 15px;
  color: #111;
  line-height: 23px;
}

.content {
  margin-bottom: 50px;
}

.commentText {
  font-size: 18px;
  font-weight: 600;
  color: rgb(44, 44, 44);
  margin-bottom: 15px;
}

.commentItem {
  display: flex;
  margin: 10px 0 30px;
}

.userAvatar {
  width: 50px;
  margin-right: 15px;
}

.userAvatar .avatar {
  width: 45px;
  height: 45px;
}

.userInfo {
  margin: 8px 0;
}

.commentContent {
  font-size: 14px;
}

.contentImg {
  margin: 20px 0;
}
</style>