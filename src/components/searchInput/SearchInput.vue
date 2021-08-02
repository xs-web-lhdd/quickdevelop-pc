<template>
  <div class="searchInput">
    <input
      type="text"
      class="searchContentInput"
      placeholder="搜索一下~"
      @keydown.enter="searchContent"
      v-model="inputContent"
    />
    <div class="searchButton" @click="searchContent">
      <i class="iconfont icon-sousuo2"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchInput",
  data() {
    return {
      // 当前输入内容
      inputContent: "",
    };
  },
  methods: {
    // 点击搜索时的回调
    searchContent() {
      // this.$emit("searchContent", this.inputContent);
      // 跳转至community
      // console.log(this.$route.name=='community');
      if (
        this.inputContent == "" &&
        this.$route.fullPath != "/community?typeId=0&page=1"
      ) {
        this.$router.push({
          name: "community",
          query: { typeId: 0, page: 1 },
        });
      } else if (this.inputContent !== "") {
        if (
          this.$route.fullPath ==
          `/community?page=1&articleTitle=${this.inputContent}`
        ) {
          return;
        }
        this.$router.push({
          name: "community",
          query: { page: 1, articleTitle: this.inputContent },
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.searchInput {
  display: flex;
  position: relative;
}

.searchButton {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f8fd;
  cursor: pointer;
}

.icon-sousuo2 {
  color: #244b7a;
  font-weight: bold;
}

.searchContentInput {
  height: 35px;
  outline: none;
  border: none;
  background-color: #f2f8fd;
  color: #333;
  font-size: 14px;
  border-top-left-radius: 17.5px;
  border-bottom-left-radius: 17.5px;
  transition: all 0.5s ease;
  width: 0;
  padding: 0;
  position: absolute;
  right: 17.5px;
  z-index: -1;
}

.searchInput:hover .searchContentInput,
.searchContentInput:focus {
  width: 150px;
  padding-left: 15px;
}
</style>
