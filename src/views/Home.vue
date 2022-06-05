<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <strong>小艾同学的学生管理系统</strong>

        <div class="header-avatar">
          <el-avatar size="small" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link" style="text-align: center">
              {{userInfo.username}}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/userCenter">个人中心</router-link>>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-link href="https://github.com/Alexie-Z-Yevich/Project.git" target="_blank">Github</el-link>
          <el-link href="https://space.bilibili.com/40681989?spm_id_from=333.1007.0.0" target="_blank">B站</el-link>

        </div>
      </el-header>
      <el-main>
<!--        <Tabs></Tabs>-->
        <div style="margin-top: 10px"></div>
        <div style="margin: 0 15px">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu.vue";
import Tabs from "./inc/Tabs.vue";

export default {
  name: "Home",
  components: {
    SideMenu, Tabs
  },
  created() {
    this.getUserInfo();
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: ""
      }
    }
  },
  methods: {
    getUserInfo() {
      this.axios.get("/sys/userInfo").then(res => {
          this.userInfo = res.data.data
      })
    },
    logout() {
      this.axios.get("/sys/userInfo").then(res => {
        localStorage.clear();
        sessionStorage.clear();
        this.$store.commit("resetState");
        this.$router.push("/login");
      })
    }
  }
}
</script>

<style scoped>
.el-sub-menu, .el-menu{
  overflow: hidden;
}

.header-avatar{
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: black;
}

.el-header {
  background-color: #17B3A3;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

.el-menu-vertical-demo{
  height: 100%;
}
a {
  text-decoration: none;
}
</style>