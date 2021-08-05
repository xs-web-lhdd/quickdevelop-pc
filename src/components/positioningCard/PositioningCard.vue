<template>
  <div class="positioningCard">
    <div class="stepsContainer">
      <el-steps :active="currentProcess" direction="vertical">
        <el-step
          title="Top"
          icon="iconfont icon-fanhuidingbu"
          :status="currentProcess >= 1 ? 'finish' : 'wait'"
          @click="scrollToHere('top')"
        ></el-step>
        <el-step
          title="Article"
          icon="iconfont icon-pingbiao"
          :status="currentProcess >= 2 ? 'finish' : 'wait'"
        ></el-step>
        <el-step
          title="Like"
          icon="iconfont icon-dianzan"
          :status="currentProcess >= 3 ? 'finish' : 'wait'"
        ></el-step>
        <el-step
          title="Comment"
          icon="iconfont icon-kuaisuhuifu"
          :status="currentProcess >= 4 ? 'finish' : 'wait'"
        ></el-step>
        <el-step
          title="Bottom"
          icon="iconfont icon-fanhuidingbu dibu"
          :status="currentProcess >= 5 ? 'finish' : 'wait'"
        ></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: "positioningCard",
  data() {
    return {
      // 当前所在进度
      currentProcess: 1,
    };
  },
  methods: {
    scrollToPosition(position) {
      if (position == "Top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else if (position == "Article") {
        let article = document.querySelector(".leftContent");
        window.scrollTo({
          top: article.offsetTop - 70,
          behavior: "smooth",
        });
      } else if (position == "Like") {
        let like = document.querySelector(".commentControl");
        window.scrollTo({
          top: like.offsetTop + 94 - window.innerHeight,
          behavior: "smooth",
        });
      } else if (position == "Comment") {
        let comment = document.querySelector(".commentArea");
        window.scrollTo({
          top: comment.offsetTop - 94,
          behavior: "smooth",
        });
      } else if (position == "Bottom") {
        window.scrollTo({
          top: 999999,
          behavior: "smooth",
        });
      }
    },
  },
  mounted() {
    let steps = document.querySelector(".el-steps");
    steps.addEventListener("click", (e) => {
      if (e.target.getAttribute("class").search("el-step__title") != -1) {
        // console.log(e.target.innerText);
        this.scrollToPosition(e.target.innerText);
      }
    });
    let article = document.querySelector(".leftContent");
    let like = document.querySelector(".commentControl");
    let comment = document.querySelector(".commentArea");
    document.addEventListener("scroll", (e) => {
      let currentVisibleHeight = window.innerHeight + window.scrollY;
      // console.log(document.body.offsetHeight, currentVisibleHeight);
      if (currentVisibleHeight < article.offsetTop) {
        this.currentProcess = 1;
      } else if (currentVisibleHeight < like.offsetTop) {
        this.currentProcess = 2;
      } else if (currentVisibleHeight < comment.offsetTop) {
        this.currentProcess = 3;
      } else {
        this.currentProcess = 4;
        // 运行10px左右的误差 有时候这些误差不知道是什么原因造成的
        if (
          document.body.offsetHeight >= currentVisibleHeight - 10 &&
          document.body.offsetHeight <= currentVisibleHeight + 10
        ) {
          this.currentProcess = 5;
        }
      }
    });
  },
};
</script>

<style scoped>
.positioningCard {
  width: 150px;
  height: 280px;
  border-radius: 10px;
  padding: 20px 0;
  box-sizing: border-box;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
}

.stepsContainer {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}

.el-steps /deep/ .dibu {
  transform: rotate(180deg);
}
</style>
