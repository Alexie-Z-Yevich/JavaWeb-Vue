<template>
  <div class="back">
    <div class="toLeft">
      <h2 style="color: white">欢迎来到小艾同学的学生管理系统</h2>
      <el-image
          :src="'https://raw.githubusercontent.com/Alexie-Z-Yevich/Project/master/vue2/src/assets/WeChat.jpg'"
          style="height: 180px; width: 180px;"></el-image>
      <p style="color: white">测试行1哒</p>
      <p style="color: white">测试行2哒</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index"
}
</script>

<style scoped>
div{
  text-align: center;
}

.toLeft{
  float: left;
}
.back{
  margin: 0 auto;
  width: 1250px;
  height: 580px;
  background-image: url("https://raw.githubusercontent.com/Alexie-Z-Yevich/MyPicture/master/%E5%90%89%E4%BB%962.jpg");
  background-size:100% 130%;
  background-repeat:no-repeat;
  border-radius: 10px;
  padding: 20px;
}

</style>