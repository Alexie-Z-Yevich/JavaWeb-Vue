<template>
  <el-row class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
      <h2>欢迎来到小艾同学的学生管理系统</h2>
      <el-image
          :src="'https://raw.githubusercontent.com/Alexie-Z-Yevich/Project/master/vue2/src/assets/WeChat.jpg'"
          style="height: 180px; width: 180px;"></el-image>
      <p>测试行1哒</p>
      <p>测试行2哒</p>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :xl="6" :lg="7">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
        <el-form-item label="用户名" prop="username" style="width: 380px;">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width: 380px;">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" style="width: 380px;">
          <el-input v-model="loginForm.code" style="width: 172px; float: left;"></el-input>
          <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import qs from "qs";

export default {
  name: 'Login',
  created() {
    this.getCaptcha();
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        token: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
        ]
      },
      captchaImg: null
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.loginForm);
          this.axios.post("login?" + qs.stringify(this.loginForm)).then(res => {
            const jwt = res.headers['authorization'];
            this.$store.commit('SET_TOKEN', jwt);
            this.$router.push('/index');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      this.axios.get('/captcha').then(res => {

        this.loginForm.token = res.data.data.token;
        this.captchaImg = res.data.data.captchaImg;
        this.loginForm.code = '';
      });
    },

  }
}
</script>

<style scoped>

.el-row {
  background: url("https://raw.githubusercontent.com/Alexie-Z-Yevich/MyPicture/master/%E9%98%BF%E5%B0%BC%E4%BA%9A.jpg") no-repeat;
  /*background-color: #FAFAFA;*/
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}

.el-divider {
  height: 200px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}

</style>