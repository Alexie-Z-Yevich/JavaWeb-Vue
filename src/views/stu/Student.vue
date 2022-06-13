<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.sname"
            placeholder="姓名"
            clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('stu:student:save')">
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item v-if="hasAuth('stu:student:delete')">
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
        @selection-change="handleSelectionChange">

      <el-table-column
          type="selection"
          width="55">
      </el-table-column>

      <el-table-column
          prop="sid"
          label="学号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="sname"
          label="姓名">
      </el-table-column>
      <el-table-column
          prop="sex"
          label="性别">
      </el-table-column>
      <el-table-column
          prop="birth"
          label="生日">
      </el-table-column>
      <el-table-column
          prop="nativePlace"
          label="籍贯">
      </el-table-column>
      <el-table-column
          prop="className"
          label="班级">
      </el-table-column>
      <el-table-column
          prop="deptName"
          label="学院">
      </el-table-column>

      <el-table-column
          prop="statu"
          label="职位">  <!--记录学生状态：在读/休学/退学，内容从表单获取-->
        <template v-slot="scope">
          <el-tag size="large" v-if="scope.row.statu === 0" type="success">班长</el-tag>
          <el-tag size="small" v-if="scope.row.statu === 1" type="info">班级成员</el-tag>
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

    <!--新增对话框-->
    <el-dialog
        title="学生信息"
        v-model="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="sname" label-width="100px">
          <el-input v-model="editForm.sname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex" label-width="100px">
          <el-select v-model="editForm.sex" placeholder="请选择">
            <el-option
                v-for="item in sexOptions"
                :key="item.id"
                :label="item.label"
                :value="item.sex">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="籍贯" prop="nativePlace" label-width="100px">
          <el-input v-model="editForm.nativePlace" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="班级" prop="className" label-width="100px">
          <!--          <el-input v-model="editForm.className" autocomplete="off"></el-input>-->
          <el-select v-model="editForm.className" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.classId"
                :label="item.label"
                :value="item.className">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birth" label-width="100px">
          <el-date-picker
              v-model="editForm.birth"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="职位" prop="label" label-width="100px">
          <el-radio-group v-model="editForm.statu">
            <el-radio :label="0">班长</el-radio>
            <el-radio :label="1">班级成员</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      sexOptions: [
        {
          sex: "男"
        },
        {
          sex: "女"
        }
      ],
      options: {},
      deptClass: {},
      searchForm: {},
      delBtlStatu: true,

      total: 0,
      size: 10,
      current: 1,

      dialogVisible: false,
      editForm: {},
      tableData: [],
      multipleSelection: [],
      roleDialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleForm: {},
      roleTreeData: [],
      treeCheckedKeys: [],
      checkStrictly: true,

      editFormRules: {
        sname: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        className: [
          {required: true, message: '请输入班级', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value1: '',
    }
  },
  created() {
    this.getAllClass();
    this.getUserList()
    this.axios.get("/stu/student/list").then(res => {
      this.roleTreeData = res.data.data.records
    })
  },
  methods: {
    getAllClass() {
      this.axios.get("/stu/student/class").then(res => {
        this.options = res.data.data
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("勾选")
      console.log(val)
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getUserList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },
    getUserList() {
      this.axios.get("/stu/student/list", {
        params: {
          s_name: this.searchForm.sname,
        }
      }).then(res => {
        if (res.data.data.records == null || res.data.data.records == "") {
          this.searchForm.sname = "";
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
    editHandle(id) {  // 回显
      this.axios.get('/stu/student/info/' + id).then(res => {
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
      this.axios.post("/stu/student/delete", ids).then(res => {
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
        console.log(this.editForm)
        if (valid) {
          this.axios.post('/stu/student/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
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

.el-select {
  width: 100%;
}
</style>