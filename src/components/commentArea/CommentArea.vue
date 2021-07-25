<template>
  <div class="commentArea">
    <div class="commentText">评论区</div>
    <div class="commentInput">
      <el-input
        type="textarea"
        class="commentTextArea"
        maxlength="140"
        show-word-limit
        v-model="newCommentData.content"
        placeholder="留下你的评论"
        @input="inputComment"
      ></el-input>
      <div class="submitCommentButton">
        <el-button
          size="mini"
          round
          @click="submitComment"
          class="submitComment"
          type="primary"
          >评论</el-button
        >
      </div>
    </div>
    <div class="commentItem" v-for="(item, index) in commentList" :key="index">
      <div class="commentItemContainer">
        <div class="commentItemArea">
          <div class="userAvatar">
            <!-- :src="item.commentUserAvatar" -->
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
              <div
                class="authorName userNickName"
                @click="gotoPersonal(item.commentUserId)"
              >
                {{ item.commentUserNickName }}
              </div>
            </div>
            <div class="commentContent">
              {{ item.content }}
            </div>
            <!-- 评论控制区 -->
            <div class="commentContorl">
              <div class="publishDate commentDate">
                {{ item.createTime }}
              </div>
              <div class="commentContorlArea">
                <div
                  class="commentContorlItem checkReply"
                  v-if="item.floorCommentList.length == 0"
                  @click="checkReply(item.commentId, index)"
                >
                  查看回复
                </div>
                <div class="commentContorlItem">
                  <i class="iconfont icon-dianzan"></i>
                </div>
                <div
                  class="commentContorlItem"
                  @click="
                    replyCurrentComment(
                      item.commentId,
                      item.commentUserNickName,
                      index
                    )
                  "
                >
                  <i class="iconfont icon-kuaisuhuifu"></i>
                </div>
                <div
                  class="commentContorlItem"
                  @click="
                    deleteCurrentComment(item.commentId, item.commentType)
                  "
                >
                  <i class="iconfont icon-shanchu1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 楼层评论 -->
        <div
          class="floorComment"
          v-if="item.floorCommentList[0] && item.floorCommentList[0].commentId"
        >
          <div
            class="floorCommentItemContainer"
            v-for="(i, idx) in item.floorCommentList"
            :key="idx"
          >
            <div class="floorCommentItem">
              <div
                class="floorCommentUser"
                @click="gotoPersonal(i.commentUserId)"
              >
                {{ i.commentUserNickName }}:&nbsp;
              </div>
              <div
                class="repliedUser"
                v-if="i.replyId != item.commentId"
                @click="gotoPersonal(item.toUserId)"
              >
                @{{ i.toNickname }}&nbsp;
              </div>
              <div class="floorCommentContent">
                {{ i.content }}
              </div>
              <div class="replyBtn">
                <div
                  class=""
                  @click="
                    replyCurrentComment(
                      i.commentId,
                      i.commentUserNickName,
                      index
                    )
                  "
                >
                  回复
                </div>
                <div
                  v-if="i.commentUserId == $store.state.userInfo.userId"
                  @click="
                    deleteCurrentComment(i.commentId, i.commentType, index)
                  "
                >
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    // 评论数据
    commentList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 发表评论数据
      newCommentData: {
        content: "",
        replyid: 0,
        articleid: this.$route.params.id,
      },
      // 楼层回复时commentInput的初始长度和初始值
      floorCommentOriginData: {
        length: 0,
        value: "",
        rootIndex: 0,
      },
    };
  },
  methods: {
    // 事件
    // 提交评论
    async submitComment() {
      // console.log("提交了评论");
      if (this.newCommentData.replyid != 0) {
        this.newCommentData.content = this.newCommentData.content.slice(
          this.floorCommentOriginData.length
        );
      }

      if (this.newCommentData.content.trim().length == 0) {
        this.$message.warning("评论内容不能为空哦!");
        return;
      }
      console.log(this.newCommentData);

      let res = await this.$request(
        "/dqcomment/add",
        this.newCommentData,
        "post"
      );
      console.log(res);
      if (res.data.code == 200) {
        // this.$emit("updateComment", {
        //   type,
        //   index,
        //   addData: this.newCommentData,
        // });
        this.$emit("reFreshComment", {
          type: this.newCommentData.replyid == 0 ? "1" : "2",
          index: this.floorCommentOriginData.rootIndex,
        });
        // 重置所有数据
        this.newCommentData = {
          content: "",
          replyid: 0,
          articleid: this.$route.params.id,
        };
        this.floorCommentOriginData = {
          length: 0,
          value: "",
        };
      }

      // console.log(this.newCommentData);
    },

    // 输入时的回调
    inputComment(e) {
      // console.log(e);
      if (this.newCommentData.replyid == 0) return;

      if (
        e
          .slice(0, this.floorCommentOriginData.length)
          .search(this.floorCommentOriginData.value) == -1
      ) {
        this.newCommentData.replyid = 0;
      }
    },

    // 回复当前评论
    replyCurrentComment(replyid, nickName, rootIndex) {
      // console.log(replyid, nickName);
      this.newCommentData.replyid = replyid;
      this.newCommentData.content = `@${nickName}: `;
      // 记录当前长度
      this.floorCommentOriginData.length = this.newCommentData.content.length;
      this.floorCommentOriginData.value = this.newCommentData.content;
      this.floorCommentOriginData.rootIndex = rootIndex;

      // 滚动到评论框 并让评论框获取焦点
      this.scrollToCommentInput();
    },

    // 滚动到评论框
    scrollToCommentInput() {
      let commentArea = document.querySelector(".commentArea");
      // console.log(commentArea.offsetTop);
      // 减去顶部栏高度和20px的间距
      window.scrollTo({
        top: commentArea.offsetTop - 94,
        behavior: "smooth",
      });

      let input = document.querySelector(".commentTextArea");
      // 阻止focus定位
      input.children[0].focus({ preventScroll: true });
    },

    // 点击删除评论的回调
    // type为1时是普通评论, 2是楼层评论
    async deleteCurrentComment(id, type, index) {
      // console.log(id);
      let res = await this.$request(`/dqcomment/remove/${id}`);
      console.log(res);
      if (res.data.code == 200) {
        // 删除成功
        // 直接删除数组中对应的数据
        // this.$emit("updateComment", { type, index });
        this.$emit("reFreshComment", {
          type,
          index,
        });
      }
    },

    // 点击查看楼层评论的回调
    checkReply(id, index) {
      // console.log(id);
      this.$emit("getFloorCommentList", { id, index });
    },

    // 点击用户名的回调
    gotoPersonal(id) {
      this.$router.push({ name: "personal", params: { id } });
    },
  },
};
</script>

<style scoped>
.commentContent {
  font-size: 15px;
  color: #111;
  line-height: 23px;
  word-break: break-all;
}

.commentText {
  font-size: 18px;
  font-weight: 600;
  color: rgb(44, 44, 44);
  margin-bottom: 15px;
}

.commentItem {
  margin: 10px 0 30px;
}

.commentInfo {
  width: 100%;
}

.commentItemArea {
  display: flex;
  margin: 10px 0 10px;
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
  margin: 4px 0;
  flex: 1;
}

.commentContent {
  font-size: 14px;
}

.contentImg {
  margin: 20px 0;
}

.commentContorl {
  position: relative;
  color: rgb(136, 136, 136);
  width: 100%;
}

.commentContorlArea {
  display: flex;
  position: absolute;
  right: 10px;
  top: -5px;
  align-items: center;
}

.commentContorlItem {
  margin: 1px 0px 1px 10px;
}

.commentContorlItem i {
  cursor: pointer;
}

.floorComment {
  font-size: 15px;
  color: #111;
  line-height: 23px;
  background-color: #efefef;
  border-radius: 10px;
  font-size: 14px;
  margin-left: 60px;
  overflow: hidden;
}

.floorCommentItem {
  display: flex;
  padding: 2px 20px;
  position: relative;
}

.floorCommentItemContainer:nth-child(1) .floorCommentItem {
  margin-top: 10px;
}

.floorCommentItemContainer:last-child .floorCommentItem {
  margin-bottom: 10px;
}

.floorCommentUser,
.repliedUser {
  color: #4480c9;
  cursor: pointer;
}

.replyBtn {
  color: rgb(148, 148, 148);
  position: absolute;
  right: 20px;
  font-size: 13px;
  cursor: pointer;
  display: none;
}

.replyBtn div {
  margin-left: 10px;
}

.floorCommentItem:hover .replyBtn {
  display: flex;
}

.repliedUser {
  color: rgb(148, 148, 148);
}

.commentTextArea /deep/ textarea {
  resize: none;
  height: 100px;
  border-color: #ccc;
  line-height: 23px;
}

.submitCommentButton {
  margin-top: 15px;
  text-align: right;
}

.authorName {
  color: #4480c9;
  font-size: 15px;
}

.publishDate {
  font-size: 13px;
  color: rgb(136, 136, 136);
  margin: 4px 0;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.checkReply {
  font-size: 14px;
  color: #8590a6;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}

.checkReply:hover {
  color: #76839b;
}

.userNickName {
  cursor: pointer;
}
</style>
