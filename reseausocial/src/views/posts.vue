<template>
  <div class="wrappe">
    <Post></Post>

    <div
      class="form_wrappe"
      v-for="userAndPostDetail in userAndPostDetails"
      v-bind:key="userAndPostDetail.id"
    >
      <form class="DetailsOfPostOwnerForm" enctype="multipart/form-data">
        <div id="userinfo" class="postowner_details">
          <div class="userPicContainer">
            <img
              class="userprofileimage"
              :src="userAndPostDetail.User.profileimage"
              @click="relatedProfilePage(userAndPostDetail.User.id)"
            />
          </div>

          <div class="authorAndDate">
            <p>{{ userAndPostDetail.User.nom }}</p>
            <p>{{ userAndPostDetail.User.prenom }}</p>

            <p style="display:none">{{ userAndPostDetail.User.id }}</p>
          </div>
        </div>

        <div id="postinfo" class="post_details">
          <div class="postContent__image">
            <img class="postimage" :src="userAndPostDetail.attachement" />
          </div>
          <div class="postContent_wrappe">
            <p class="postContent__text">{{ userAndPostDetail.content }}</p>

            <p class="postContent__text text_date">
              Created on :
              {{
                moment(userAndPostDetail.createdAt).format("YYYY-MM-DD h:mm A")
              }}
            </p>
            <p class="postContent__text text " style="display:none">
              postid:{{ userAndPostDetail.id }}
            </p>
          </div>

          <div class="button_wrappe">
            <div>
              <!--------edit and delete post----------->

              <i
                class="fas fa-edit"
                v-if="userId === userAndPostDetail.User.id || isAdmin"
                @click="editPost(userAndPostDetail.id)"
              ></i>
            </div>
            <div>
              <i
                class="fas fa-trash-alt"
                v-if="userId === userAndPostDetail.User.id || isAdmin"
                @click="deletePost(userAndPostDetail.id)"
              ></i>
            </div>
            <div></div>
          </div>
        </div>
        <div class="postactions_comment">
          <!-------------------section comment --------->
          <i
            class="fa fa-comments postactions_comment"
            @click="sendcomment(userAndPostDetail.id)"
            aria-hidden="true"
          ></i>
        </div>
        <div
          class=" comment_div "
          v-for="item in commentAndPostDetails"
          v-bind:key="item.id"
          c
        >
          <div class="content_msg" v-if="item.postId == userAndPostDetail.id">
            <p style="display:none">postidcomment:{{ item.id }}</p>
            <p class="text">{{ item.User.nom }} à dit :</p>
            <p class="text">
              {{ item.comment }}
            </p>
          </div>
        </div>

        <!-------------------dicplay comment --------->
      </form>
    </div>
    <!------------footer------------>
    <footer class="navbar navbar-expand-md navbar_dark">
      <div class="container height">
        <div class="logo-wrappe col-md-3 ">
          <span class="p2 title title__style h6 align-self-center">
            <img
              class="footer_img"
              src="../assets/icon-left-font-monochrome-black.png"
              width="400"
            />
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
import Post from "./post.vue";
import { ref } from "vue";
import Popup from "./popup.vue";
import moment from "moment";

export default {
  // props: ["TogglePopup"],

  setup() {
    const popupTriggers = ref({
      buttonTrigger: true,
    });
    const TogglePopup = (trigger) => {
      popupTriggers.value[trigger] = !popupTriggers.value[trigger];
    };
    return {
      Popup,
      popupTriggers,
      TogglePopup,
    };
  },

  name: "Posts",
  components: {
    Post,

    // Popup,
  },

  data() {
    return {
      userAndPostDetails: [],
      userPostAndCommentDetails: [],
      toggle: true,
      postImage: "",
      content: "",
      commentAndPostDetails: [],
      userId: "",
      show: true,
      postId: "",
      formattedTime: "",
      moment: moment,
      isAdmin: false,
      createdAt: "",
    };
  },

  mounted() {
    //get all post
    axios
      .get("http://localhost:3000/post", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((Post) => {
        const dataarrays = Post.data.Post;
        console.log(dataarrays);

        this.userAndPostDetails = dataarrays;

        this.$router.push("/posts");
      })
      .catch(() => {});
    //get current user id
    axios
      .get("http://localhost:3000/user", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        this.userId = res.data.findUser.id;
        this.isAdmin = res.data.findUser.isAdmin;
      });

    //get all comments

    axios
      .get("http://localhost:3000/comment", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        const userPostCommentArray = res.data.Comment;

        this.commentAndPostDetails = userPostCommentArray;
      })
      .catch((error) => ({ message: error.message }));
  },

  created() {},

  methods: {
    relatedProfilePage(id) {
      this.$router.push({
        path: `/userprofile/${id}`,
      });
    },
    //send post id to comment.vue
    sendcomment(id) {
      this.$router.push({
        path: `/comment/${id}`,
      });
    },

    editPost(id, content, attachement) {
      this.$router.push({
        path: `/popupe/${id}`,
        params: { id, content, attachement },
      });
      console.log(id);
      console.log(content);
      console.log(attachement);
    },

    deletePost(id) {
      axios
        .delete(`http://localhost:3000/post/${id}`, {
          headers: { token: localStorage.getItem("userToken") },
        })
        .then((res) => {
          console.log(res);
          alert("post is been deleted");
          window.location.reload();
          res;
        })
        .catch(function(error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    },
  },
};
</script>

<style scoped>
.wrappe {
  display: grid;
  align-content: center;
  justify-items: center;
}
.post-wrapp {
  margin-top: 70px;
}
.form_wrappe {
  display: grid;
  width: 40%;
}
.postowner_details {
  display: flex;
  box-shadow: 10px 5px 5px #ffb3b3;
  justify-content: space-around;
  align-items: center;
  background-color: #ffb3b3;
  height: 50px;
  border-radius: 10px;
  margin-top: 60px;
}
.authorAndDate {
  display: flex;
  justify-content: space-around;
  width: 40%;
  font-size: 18px;
  font-weight: bold;
}

.userprofileimage {
  width: 78px;
  height: 40px;
  cursor: pointer;
}
.postactions_comment {
  width: 100px;

  cursor: pointer;
}
.post_details {
  height: 200px;
  display: flex;
  justify-content: space-between;
  background-color: blanchedalmond;
  box-shadow: 10px 5px 5px #ffb3b3;
}
.postContent__image {
  height: 40px;

  margin-top: 20px;
  width: 40%;
}

.postContent_wrappe {
  width: 50%;
  display: grid;
  margin-top: 25px;
}
.postimage {
  width: 200px;
  height: 120px;
  cursor: pointer;
}
.postactions {
  display: flex;

  justify-content: space-around;
  align-items: center;
  background-color: #ffb3b3;
  height: 50px;
  border-radius: 10px;
}

.comment_div {
  width: 60%;
  line-height: 15px;
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  background-color: whitesmoke;
  box-shadow: 10px 5px 5px #ffb3b3;
  text-overflow: ellipsis;
  overflow: hidden;
}
.content_msg {
  padding: 15px;
}
textarea {
  height: 40px;
  width: 50%;
}
.DetailsOfPostOwnerForm {
  width: 100%;

  justify-content: space-around;
  align-items: center;
}
.DetailsOfPostForm {
  height: 150px;
  display: flex;
  justify-content: space-between;
  background-color: blanchedalmond;
  border-radius: 40px 40px 40px 40px;
}
.button_wrappe {
  display: flex;
  justify-content: space-around;
  width: 10%;
}
.button_wrappe button {
  height: 51px;
  font-size: 15px;
}
.fa-comments {
  font-size: 16px;
  color: black;
}
i {
  cursor: pointer;
  font-size: 12px;
}
.text {
  font-weight: normal;
}
.height {
  height: 100px;
}
footer {
  width: 100%;
  margin-top: 70px;
}
.text_date {
  font-size: 11px;
  height: 5px;
}
.footer_img {
  height: 100px;
}
@media (min-width: 768px) and (max-width: 1028px) {
}

@media (max-width: 768px) {
  .nav_link {
    justify-content: start;
  }
  .form_wrappe {
    width: 90%;
  }
  .post_details {
    display: grid;
  }
  .postinfo {
    height: 250px;
  }
  .postContent__image {
    margin-left: 40px;
  }
  .postContent_wrappe {
    display: grid;
    width: 100%;
    margin-top: 40px;
  }
  .postimage {
    width: 200px;
    height: 90px;
  }
  .postContent_text {
    margin-top: 20px;
  }
  .text {
    font-size: 11px;
  }
}
</style>
