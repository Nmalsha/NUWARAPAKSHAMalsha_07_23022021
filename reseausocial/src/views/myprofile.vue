<template>
  <div>
    <nav class="navbar navbar-expand-md navbar_dark">
      <div class="container">
        <div class="logo-wrappe col-md-3">
          <span class="p2 title title__style h6 align-self-center">
            <img
              src="../assets/icon-left-font-monochrome-black.png"
              width="400"
              height="300"
            />
          </span>
        </div>
        <div class=" navbar-collapse  col-md-9">
          <ul class="navbar-nav ml-auto mb-2 mb-lg-0 col-md-9">
            <li class="nav-item col-md-12">
              <router-link
                class="btn btn-outline-primary my-2 my-sm-0 color"
                to="/posts"
              >
                Forum</router-link
              >
            </li>
            <li
              class="btn btn-outline-primary my-2 my-sm-0 color"
              @click="logout"
            >
              <a href="#">Deconnection</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!----adding profile infos-------->
    <div class="profile_wrapp">
      <div class="card">
        <form class="image_form" enctype="multipart/form-data">
          <a href="#">
            <div class="roundContainer">
              <img
                class="profile_image"
                :src="image"
                width="50px"
                height="50px"
              />
            </div>
          </a>

          <input
            type="file"
            ref="fileInput"
            accept=".jpg,.jpeg,.png"
            @change="UpdatePhoto"
          />

          <div class="text-center align-baseline my-2">
            <span v-if="selectedFile">{{ selectedFile.name }}</span>
          </div>
        </form>
        <label for="nom">Nom</label>
        <input
          v-model="nom"
          type="text"
          class="profileform-control"
          required
          placeholder=""
        />
        <label for="prenom">Prenom</label>
        <input
          v-model="prenom"
          type="text"
          class="profileform-control"
          required
          placeholder=""
        />
        <label for="email">email</label>
        <input
          v-model="email"
          type="email"
          class="profileform-control"
          required
          placeholder=""
        />
        <div class="card-body">
          <button
            @click="updateUserProfile"
            class="btn btn-outline-primary my-2 my-sm-0 color "
            type="submit"
          >
            Update Profile
          </button>
          <router-link
            class="btn btn-outline-primary my-2 my-sm-0 color"
            to="/posts"
          >
            update later</router-link
          >
        </div>
        <button
          @click="deleteProfile(id)"
          class="btn btn-outline-primary my-2 my-sm-0 color "
          type="submit"
        >
          delete Profile
        </button>
      </div>
    </div>
    <!----Display Posts---->
    <form enctype="multipart/form-data">
      <div class="post_wrappe">
        <div
          id="postinfo"
          class="post_details"
          v-for="postsforOneUser in postsforOneUsers"
          v-bind:key="postsforOneUser.id"
        >
          <div class="postContent__image">
            <img class="postimage" :src="postsforOneUser.attachement" />
          </div>
          <div class="postContent">
            <p class="postContent__text text_position">
              {{ postsforOneUser.content }}
            </p>
          </div>
        </div>
      </div>
    </form>
    <!------------------Footer------------------->
    <footer class="navbar navbar-expand-md navbar_dark  margin_footer">
      <div class="container height">
        <span class="p2 title title__style h6 align-self-center">
          <img
            class="footer_logo"
            src="../assets/icon-left-font-monochrome-black.png"
            width="400"
          />
        </span>
      </div>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
//import imagefile from "...";
//import { defineComponent } from "vue";

export default {
  name: "myprofile",

  data() {
    return {
      id: "",
      email: "",
      nom: "",
      prenom: "",
      profileimage: null,
      password: "",
      image: "",
      postsforOneUsers: [],
    };
  },
  created() {
    let token = localStorage.getItem("userToken");
    if (token === null) {
      this.$router.push("/login");
    }
  },
  mounted() {
    axios
      .get("http://localhost:3000/user", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        if (!res.data.findUser) {
          console.log("User not found");
          this.$router.push("/signup");
        }
        if (res.data.findUser) {
          console.log("User found");
          this.nom = res.data.findUser.nom;
          this.id = res.data.findUser.id;
          this.prenom = res.data.findUser.prenom;
          this.email = res.data.findUser.email;
          this.password = res.data.findUser.password;
          this.image = res.data.findUser.profileimage;
        }
      });

    axios
      .get("http://localhost:3000/postsuser", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((postsforOneUser) => {
        console.log("this colsole");
        this.postsforOneUsers = postsforOneUser.data.postsforOneUser;
      });
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },

    UpdatePhoto(e) {
      const file = e.target.files[0];
      this.profileimage = file;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.image = fileReader.result;

        console.log(this.image);
        console.log(this.profileimage);
      };
    },

    updateUserProfile() {
      const dataUser = {
        headers: { token: localStorage.getItem("userToken") },
        email: this.email,
        id: this.id,
        nom: this.nom,
        prenom: this.prenom,
        profileimage: this.profileimage,
        password: this.password,
      };

      const formData = new FormData();
      if (this.profileimage) {
        formData.append("image", this.profileimage);
      }

      formData.append("user", JSON.stringify(dataUser));
      axios
        .put("http://localhost:3000/user", formData, {
          headers: { token: localStorage.getItem("userToken") },
        })
        .then((res) => {
          alert("profile is been updated");
          this.$router.push("/posts");

          console.log(res.data);
        })
        .catch(() => {});
    },

    deleteProfile(id) {
      axios
        .delete(`http://localhost:3000/user/${id}`, {
          headers: {
            token: localStorage.getItem("userToken"),
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        })
        .then((res) => {
          alert("profile is been deleted");
          this.$router.push("/signup");

          console.log(res.data);
        })
        .catch(() => {
          alert("profile is been deleted ");
          this.$router.push("/signup");
        });
    },
  },
};
</script>
<style scoped>
.profile_wrapp {
  display: grid;
  justify-content: center;
}
.card {
  margin-top: 100px;
  background-color: #ffb3b3;
  padding: 30px;
  width: 30rem;
}
.card-body {
  display: flex;
  justify-content: space-around;
}
.form {
  margin-top: 100px;
}
.roundContainer {
  border-radius: 80%;
  height: 100px;
  border: 1px solid black;
  width: 100px;
}
.profile_image {
  border-radius: 80%;
  height: 100px;
  border: 1px solid black;
  width: 100px;
}

.post_details {
  width: 30%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  background-color: blanchedalmond;
  border-radius: 40px 0px 40px 0px;
  margin-top: 25px;
}
.postContent {
  width: 75%;
}
.postContent__image {
  width: 25%;
}
.post_wrappe {
  display: grid;
  justify-items: center;
}
.postimage {
  width: 70px;
  height: 75px;
}
.profileform-control {
  width: 400px;
  height: 80px;
  margin-right: 20px;
  display: block;
}
.margin_footer {
  margin-top: 100px;
}
.text_position {
  margin-top: 20px;
}

@media (min-width: 768px) and (max-width: 1028px) {
}

@media (max-width: 768px) {
  .profileform-control {
    width: 250px;
    height: 60px;
    margin-right: 20px;
    margin-top: 10px;
  }
  .card {
    width: 20rem;
  }
  .post_details {
    width: 100%;
    border-radius: 0px;
  }
}
</style>
