<template>
  <div class="main">
    <nav class="navbar navbar-expand-md navbar_dark">
      <div class="container">
        <div class="logo-wrappe col-md-3">
          <span class="p2 title title__style h6 align-self-center">
            <a href="/">
              <img
                src="../assets/icon-left-font-monochrome-black.png"
                width="400"
                height="300"
            /></a>
          </span>
        </div>
        <div class=" navbar-collapse  col-md-9 nav_link">
          <ul class="navbar-nav ml-auto mb-2 mb-lg-0 col-md-9">
            <li class="nav-item col-md-12 item_style">
              <router-link to="/myprofile">Profile</router-link>
            </li>
            <li class="nav-item item_style" @click="logout">
              <a href="#">Deconnection</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="post-wrapp col-md-6">
      <p class="welcome_text">
        Bonjour {{ prenom }} bienvenue dans le réseau
        <span class="span"> GROUPOMANIA</span>
      </p>
      <br />
      <p class="welcome_text2">
        Ici, vous pouvez interagir avec vos collègues à tout moment et partager
        vos réflexions avec la communauté
      </p>
    </div>
    <div class="post_wrapp">
      <div class="addpost_wrappe col-md-4">
        <form class="image_form" enctype="multipart/form-data">
          <div class="roundContainer">
            <img class="post_image" :src="image" width="50px" height="50px" />
          </div>
          <button
            class="btn btn-outline-primary my-2 my-sm-0 color "
            @click="onPickFile"
          >
            Upload image
          </button>
          <p>{{ filename }}</p>
          <input
            type="file"
            ref="postimage"
            accept=".jpg,.jpeg,.png"
            @change="UploadPhoto"
            style="display:none"
          />
        </form>
        <div class="write_post com-md-9">
          <input
            class="form-control mr-sm-2 bg-light"
            v-model="content"
            maxlength="max"
            type="text"
            placeholder="Publier ici..."
            aria-label="publication"
            id="publication"
          />
        </div>
        <div class="write_post com-md-2">
          <div>
            <button
              @click="createPost"
              class="btn btn-outline-primary my-2 my-sm-0 color"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Post",
  data() {
    return {
      email: "",
      nom: "",
      prenom: "",
      postImage: "",
      userId: "",
      content: "",
      attachement: "",
      image: "",
      filename: "",
    };
  },

  created() {
    let token = localStorage.getItem("userToken");
    if (token === null) {
      this.$router.push("/login");
    }
    //console.log(token);
  },
  mounted() {
    axios
      .get("http://localhost:3000/user", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        this.nom = res.data.findUser.nom;
        this.prenom = res.data.findUser.prenom;
        this.email = res.data.findUser.email;
        this.userId = res.data.findUser.id;
      });
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    onPickFile() {
      this.$refs.postimage.click();
    },
    UploadPhoto(e) {
      const file = e.target.files[0];
      this.attachement = file;
      this.filename = file.name;

      //display image

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.image = fileReader.result;
      };
    },

    createPost() {
      console.log(this.attachement);
      const dataUser = {
        email: this.email,
        nom: this.nom,
        prenom: this.prenom,
        postImage: this.postImage,
      };

      const dataPost = {
        content: this.content,
        userId: this.userId,
      };

      console.log(dataPost);

      const formData = new FormData();
      if (this.attachement) {
        formData.append("image", this.attachement);
      }

      formData.append("post", JSON.stringify(dataPost));

      console.log(formData);

      axios
        .post("http://localhost:3000/post", formData, {
          headers: { token: localStorage.getItem("userToken") },
        })
        .then(() => {
          dataUser, dataPost;
          alert("your post is successfully sent ");
          window.location.reload();
          // this.$router.push("/posts");
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
.main {
  width: 100%;
}
.post-wrapp {
  margin-top: 50px;
  height: 100px;
  width: 40%;
  display: inline-block;
  font-size: 20px;
}
.span {
  box-sizing: border-box;
  font-weight: bold;
  color: #ffb3b3;
}
.card-header {
  padding: 0 0 0 0;
  margin-bottom: 0;
  background-color: #00000000;
}
.card {
  box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);
  width: 75%;
  display: grid;
}
.addpost_wrappe {
  margin-top: 50px;
  align-items: center;
  justify-content: space-evenly;
  background-color: #ffb3b3;
  width: 40%;
  display: flex;
  justify-content: space-around;
  padding: 30px;
  box-shadow: 10px 5px 5px #3a1111;
  border-radius: 10px;
}
.form-control {
  width: 400px;
  height: 100px;
  margin-right: 20px;
}
.btn_color {
  background-color: white;
  border-radius: 40%;
  padding: 10px;
  cursor: pointer;
}
.btn_annule {
  margin-top: 10px;
}
.post_wrapp {
  display: grid;
  justify-items: center;
}
.add_img {
  margin: 4px;
  border: 1px solid;
  height: 67px;
  cursor: pointer;
}
button {
  background: none;
  outline: none;
  appearance: none;
  border: none;
}
button:hover {
  background-color: #d8afaf;
  box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
}
.roundContainer {
  height: 100px;

  width: 100px;
  background-image: url(../assets/icon.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.post_image {
  width: 100px;
  height: 100px;
}
nav a {
  color: black;
  text-decoration: none;
}
.nav_link {
  justify-content: end;
}
.nav_link:hover {
  color: blanchedalmond;
}
.btn {
  border: none;
}
i:hover {
  scale: 1.5;
}
@media (min-width: 768px) and (max-width: 1028px) {
}

@media (max-width: 768px) {
  .post-wrapp {
    font-size: 14px;
    width: 90%;
  }
  .welcome_text {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .welcome_text2 {
    display: flex;
    width: 80%;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .addpost_wrappe {
    display: grid;
    width: 100%;
    border-radius: 0%;
  }
  .form-control {
    width: auto;
  }

  nav a:hover {
    color: black;
    scale: 1.2;
    color: royalblue;
  }
  .welcome_text {
    margin-top: 25px;
    font-size: 20px;
  }
}
</style>
