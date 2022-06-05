<template>
  <div class="back">
    <div class="back2">
      <h2>你好！{{ userInfo.username }}同学</h2>

      <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
        <el-form-item label="旧密码" prop="currentPass">
          <el-input type="password" v-model="passForm.currentPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="passForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {},
      passForm: {
        currentPass: "",
        password: "",
        checkPass: ""
      },
      rules: {
        password: [
          {required: true, message: "请输入新密码", trigger: "blur"},
          {min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur"}
        ],
        checkPass: [
          {required: true, validator: validatePass, trigger: "blur"},
        ],
        currentPass: [
          {required: true, message: "请输入当前密码", trigger: "blur"},
        ]
      }
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.axios.get("/sys/userInfo").then(res => {
        this.userInfo = res.data.data;
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          const _this = this
          this.axios.post('/sys/user/updatePass', this.passForm).then(res => {

            _this.$alert(res.data.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$refs[formName].resetFields();
              }
            });
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}

.back {
  ;
  background-image: url("https://raw.githubusercontent.com/Alexie-Z-Yevich/MyPicture/master/%E5%B0%8F%E5%AE%A0%E7%89%A9.jpg");
  margin: 0 auto;
  width: 1250px;
  height: 580px;
  text-align: center;
  background-size:12% 20%;
  /*background-repeat:no-repeat;*/
  border-radius: 10px;
  padding: 20px;
}

.back2 {
  width: 520px;
  margin-left: 340px;
  margin-top: 120px;
  text-align: center;
  background-color: RGB(237, 237, 237);
  border-radius: 10px;
  padding: 20px;
}
</style>