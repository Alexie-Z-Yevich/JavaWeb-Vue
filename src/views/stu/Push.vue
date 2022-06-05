<template xmlns="http://www.w3.org/1999/html">
  <!--搜索部分-->
  <el-form :inline="true">
    <el-form-item>
      <el-input
          v-model="searchForm.sid"
          placeholder="学号"
          clearable
      >
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button @click="getUserList">搜索</el-button>
    </el-form-item>

    <el-form-item>
      <el-select v-model="searchForm.className" placeholder="班级">
        <el-option
            v-for="item in options"
            :key="item.classId"
            :label="item.label"
            :value="item.className">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="getUserListByClass">搜索</el-button>
    </el-form-item>

    <el-form-item>
      <el-button @click="downLoad(null)" style="background-color: #ef3535; border: solid">总表下载</el-button>
    </el-form-item>
  </el-form>

  <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
  >

    <el-table-column
        prop="sid"
        label="学号"
        width="140">
    </el-table-column>

    <el-table-column
        prop="sname"
        label="姓名">
    </el-table-column>
    <el-table-column
        prop="math"
        label="数学">
    </el-table-column>
    <el-table-column
        prop="java"
        label="Java">
    </el-table-column>

    <el-table-column
        prop="english"
        label="英语">
    </el-table-column>

    <el-table-column
        prop="et"
        label="体育">
    </el-table-column>

    <el-table-column
        prop="analyze"
        width="260px"
        label="操作">
      <template v-slot="scope">
        <el-button text @click="editHandle(scope.row.sid)">成绩录入
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button text @click="downLoad(scope.row.sid)" style="background-color: #81afff">下载</el-button>
      </template>
    </el-table-column>

  </el-table>

  <!--学生成绩分析页面-->
  <el-dialog
      title="学生信息"
      v-model="dialogVisible"
      width="300px">

    <div style="font-family: 'Microsoft YaHei'; font-size: 16px; text-align: center">
      学号：{{ editForm[0].sid }}<br>
      姓名：{{ editForm[0].sname }}
    </div>
    <br>

    <el-form :model="editForm" ref="editForm">
      <el-form-item label="数学" prop="math" label-width="60px">
        <el-input v-model="editForm[0].math" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item label="Java" prop="java" label-width="60px">
        <el-input v-model="editForm[0].java" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item label="英语" prop="english" label-width="60px">
        <el-input v-model="editForm[0].english" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item label="体育" prop="et" label-width="60px">
        <el-input v-model="editForm[0].et" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: "Push",
  data() {
    return {
      options: [],
      activeName: '1',
      searchForm: {},
      dialogVisible: false,
      editForm: [],
      tableData: [],
    }
  },
  created() {
    this.getAllClass();
    this.getUserList()
    this.axios.get("/stu/grade/list").then(res => {
      this.roleTreeData = res.data.data.records
    })
  },
  methods: {
    getAllClass() {
      this.axios.get("/stu/student/class").then(res => {
        this.options = res.data.data
      })
    },
    getUserList() {
      this.axios.get("/stu/grade/list", {
        params: {
          s_id: this.searchForm.sid,
        }
      }).then(res => {
        if (res.data.data.records == null || res.data.data.records == "") {
          this.searchForm.sid = "";
          this.$message({
            showClose: true,
            message: '查无此人',
            type: 'error',
            onClose: () => {
              this.getUserList()
            }
          });
        } else {
          this.tableData = res.data.data.records
        }
      })
    },
    getUserListByClass() {
      this.axios.get("/stu/grade/class", {
        params: {
          class_name: this.searchForm.className
        }
      }).then(res => {
        if (res.data.data.records == null || res.data.data.records == "") {
          this.searchForm.className = "";
          this.$message({
            showClose: true,
            message: '没有这个班级/这个班上还没有学生',
            type: 'error',
            onClose: () => {
              this.getUserList()
            }
          });
        } else {
          this.tableData = res.data.data.records
        }
      })
    },
    editHandle(sid) {  // 回显
      this.axios.get('/stu/push/info/', {
        params: {
          s_id: sid,
        }
      }).then(res => {
        this.editForm = res.data.data
        console.log(this.editForm)
        this.dialogVisible = true
      })
    },
    submitForm(formName) {  // 更新
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.editForm[0])
          this.axios.post('/stu/push/update', this.editForm[0])
              .then(res => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getUserList()
                  }
                });
                this.dialogVisible = false
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    downLoad(sid) {
      this.axios.post("/stu/excel/download" + (sid ? "?s_id=" + sid: ""),
          {}, { responseType: 'blob'},
          {
            headers: {
              "Content-Type": "application/json",
              "accept": "application/octet-stream",
            }}).then(function (response) {
        var data = response.data;
        var xhr = response.request;
        var headers = xhr.getAllResponseHeaders();// 查看一下响应headers中的属性
        var contentDisposition = xhr.getResponseHeader("Content-disposition");// 与后端的请求头匹配
        var url = URL.createObjectURL(data);
        var fileName = "班级成绩总表.xls";
        let link = document.createElement('a');  // 创建标签
        link.href = url;
        link.download = fileName;
        link.click();
        link.remove();
      })
    },
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>