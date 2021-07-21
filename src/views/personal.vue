<template>
  <div class="personalContainer" v-if="userInfo">
    <div class="personal">
      <div class="background">
        <div class="left">
          <div class="avatar">
            <el-image
              :src="
                userInfo.avatar
                  ? '/articleImg' + userInfo.avatar.split('.com')[1]
                  : ''
              "
              fit="cover"
            ></el-image>
          </div>
          <div class="userInfo">
            <div class="userName">
              {{ userInfo.nickName }}
              <div class="tag">Admin</div>
            </div>
            <div class="email">{{ userInfo.email }}</div>
          </div>
        </div>
        <div class="right">
          <div>Posts: <span>30</span></div>
          <div>Comments: <span>12</span></div>
          <div>Views: <span>1.2k</span></div>
        </div>
      </div>
      <ariticel-card :articleList="articleList"></ariticel-card>
    </div>
  </div>
</template>

<script>
import AriticelCard from "components/articleCard/AriticelCard.vue";
export default {
  components: { AriticelCard },
  name: "personal",
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 文章列表
      articleList: [],
    };
  },
  methods: {
    // 请求
    // 根据id 查询用户信息
    async getUserInfoById(id) {
      let res = await this.$request(`/dquser/${id}`);
      // console.log(res);
      this.userInfo = res.data.data;
    },

    // 根据id查询文章
    async getArticleById(id) {
      let res = await this.$request(`/dqarticle/author/${id}`);
      console.log(res);
      // this.articleList = res.data.data;
      for (let i = 0; i < 10; i++) {
        this.articleList.push(...res.data.data);
      }
    },
  },
  created() {
    this.getUserInfoById(this.$route.params.id);
    this.getArticleById(this.$route.params.id);
  },
};
</script>

<style scoped>
.personalContainer {
  display: flex;
  justify-content: center;
  font-size: 15px;
}

.personal {
  min-width: 1000px;
  width: 91vw;
}

.background {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  margin: 30px 0;
  position: relative;
  background: url("~assets/img/background.jpg") no-repeat;
  background-size: cover;
  background-position-y: 60%;
  color: #f9f9f9;
}

.avatar {
  margin-right: 20px;
}

.avatar .el-image {
  height: 100px;
  width: 100px;
  border-radius: 10px;
  border: 3px solid #f9f9f9;
}

.userName {
  color: white;
  font-weight: bold;
}

.left {
  position: absolute;
  bottom: 25px;
  left: 30px;
  display: flex;
}

.right {
  position: absolute;
  bottom: 35px;
  right: 30px;
  display: flex;
}

.right > div {
  margin-left: 30px;
}

.right div span {
  font-weight: 600;
}

.userName {
  font-size: 20px;
  position: relative;
  margin: 25px 0 10px;
  /* block独占一行 会撑满一行 所以下面改为inline-block*/
  display: inline-block;
}

.tag {
  font-size: 12px;
  position: absolute;
  right: -60px;
  top: 4px;
  background-color: #ffde66;
  color: #d50101;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
