<template>
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
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    </el-form-item>
    <el-form-item>
      <el-popconfirm title="是否确认要批量删除？" @confirm="delHandle(null)">
        <template #reference>
          <el-button type="danger" :disabled="delBtlStatu">批量删除</el-button>
        </template>
      </el-popconfirm>
    </el-form-item>
  </el-form>

  <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
  >

    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column
        prop="sid"
        label="学号"
        width="140px">
    </el-table-column>

    <el-table-column
        prop="sname"
        width="100px"
        label="姓名">
    </el-table-column>
    <el-table-column
        prop="recTime"
        width="200px"
        label="记录时间">
    </el-table-column>
    <el-table-column
        prop="description"
        label="描述">
    </el-table-column>

    <el-table-column
        prop="punishId"
        width="150px"
        label="处罚等级">

      <template v-slot="scope">
        <el-tag size="large" v-if="scope.row.punishId === 0" type="warning">警告</el-tag>
        <el-tag size="large" v-if="scope.row.punishId === 1" type="warning">严重警告</el-tag>
        <el-tag size="large" v-if="scope.row.punishId === 2" type="danger">记过</el-tag>
        <el-tag size="large" v-if="scope.row.punishId === 3" type="danger">记大过</el-tag>
        <el-tag size="large" v-if="scope.row.punishId === 4" type="info">开除</el-tag>
      </template>
    </el-table-column>

    <el-table-column
        prop="icon"
        width="260px"
        label="操作">
      <template v-slot="scope">
        <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-popconfirm title="确认删除这一段内容？" @confirm="delHandle(scope.row.id)">
          <template #reference>
            <el-button type="text">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>


  <!--学籍变更信息表-->
  <el-dialog
      title="学籍变更"
      v-model="dialogVisible"
      width="600px"
      :before-close="handleClose">

    <el-form :model="editForm" :rules="editFormRules" ref="editForm">

      <el-form-item label="学号" prop="sid" label-width="100px">
        <el-input v-model="editForm.sid" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="sname" label-width="100px">
        <el-input v-model="editForm.sname" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item label="处罚等级" prop="punishId" label-width="100px">
        <el-radio-group v-model="editForm.punishId">
          <el-radio :label="0">警告</el-radio>
          <el-radio :label="1">严重警告</el-radio>
          <el-radio :label="2">记过</el-radio>
          <el-radio :label="3">记大过</el-radio>
          <el-radio :label="4">开除</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="description" label-width="100px">
        <el-input v-model="editForm.description" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>


    <template #footer>
      <el-button @click="resetForm('editForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: "Reward",
  data() {
    return {
      NAME: "",
      options: [],
      searchForm: {},
      dialogVisible: true,
      tableData: [],
      delBtlStatu: true,
      editForm: {},
      editFormRules: {
        sid: [
          {required: true, message: "请输入学号", trigger: "blur"}
        ],
        sname: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        punishId: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      dialogFormVisible: false,
    }
  },
  created() {
    this.getAllClass();
    this.getUserList()
    this.axios.get("/sta/punish/list").then(res => {
      this.roleTreeData = res.data.data
    })
  },
  mounted() {
    this.dialogVisible = false
  },
  methods: {
    getAllClass() {
      this.axios.get("/stu/student/class").then(res => {
        this.options = res.data.data
      })
    },
    getUserList() {
      this.axios.get("/sta/punish/list", {
        params: {
          s_id: this.searchForm.sid,
        }
      }).then(res => {
        if (res.data.data == null || res.data.data == "") {
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
          this.tableData = res.data.data
        }
      })
    },
    getUserListByClass() {
      this.axios.get("/sta/punish/class", {
        params: {
          class_name: this.searchForm.className
        }
      }).then(res => {
        if (res.data.data == null || res.data.data == "") {
          this.searchForm.className = "";
          this.$message({
            showClose: true,
            message: '这个班上还没有学生处罚记录',
            type: 'error',
            onClose: () => {
              this.getUserList()
            }
          });
        } else {
          this.tableData = res.data.data
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0
    },
    editHandle(id) {  // 回显
      this.axios.get('/sta/punish/info/' + id).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    delHandle(id) {
      var ids = []
      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }
      this.axios.post("/sta/punish/delete", ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getUserList()
          }
        });
      })
    },
    submitForm(formName) {  // 新增&更新
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post('/sta/punish/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getUserList()
                    this.editForm = {}
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
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}

.el-radio {
  line-height: 23px;
  margin-right: 80px;
}
</style>