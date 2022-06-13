<template>
  <el-menu
      :default-active="this.$store.state.menus.editableTabsValue"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
  >
    <router-link to="/index">
      <el-menu-item index="Index" @click="selectMenu({name: 'Index', title: '首页'})">
        <template #title>
          <el-icon>
<!--            <location/>-->
            <el-icon><home-filled /></el-icon>
<!--            <el-icon><component :is="menuList[0].icon" /></el-icon>-->
          </el-icon>
          <span>首页</span>
        </template>
      </el-menu-item>
    </router-link>
    <el-sub-menu :index="menu.name" v-for="menu in menuList">
      <template #title>
        <el-icon>
          <el-icon><component :is="menu.icon" /></el-icon>
        </el-icon>
        <span>{{ menu.title }}</span>
      </template>
      <router-link :to="item.path" v-for="item in menu.children">
        <el-menu-item :index="item.name" @click="selectMenu(item)">
          <template #title>
            <el-icon>
              <el-icon><component :is="item.icon" /></el-icon>
            </el-icon>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>

    </el-sub-menu>
  </el-menu>

</template>

<script>
import {Expand, HomeFilled, List, Avatar, Tools, Rank, Menu, Checked, Histogram, Grid, School, Management, Switch, Medal, WarningFilled} from "@element-plus/icons-vue";
export default {
  name: "SideMenu",
  components: {HomeFilled, Expand, List, Avatar, Tools, Rank, Menu, Checked, Histogram, Grid, School, Management, Switch, Medal, WarningFilled},
  data() {
    return {
    }
  },
  computed: {
    menuList: {
      get() {
        return this.$store.state.menus.menuList;
      },
    }
  },
  methods: {
    selectMenu(item) {
      this.$store.commit("addTab", item);
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>