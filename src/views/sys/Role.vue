<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="名称"
            clearable
        >

        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getRoleList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="是否确认要批量删除？" @confirm="delHandle(null)">
          <template #reference>
            <el-button type="danger" :disabled="delBtnStatu">批量删除</el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="name" label="名称" width="120"/>
      <el-table-column property="code" label="唯一编码" show-overflow-tooltip/>
      <el-table-column property="remark" label="描述" show-overflow-tooltip/>

      <el-table-column
          prop="statu"
          label="状态">
        <template v-slot="scope">
          <el-tag size="small" type="success">正常</el-tag>
<!--          <el-tag size="small" :label="0" type="danger">禁用</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
          prop="operation"
          label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
          <el-divider direction="vertical"></el-divider>

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

    <el-pagination
        v-model:currentPage="current"
        v-model:page-size="size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    <!--新增对话框-->
    <el-dialog
        v-model="dialogVisible"
        title="提示"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="角色名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="状态" prop="statu" label-width="100px">
          <el-radio-group v-model="editForm.statu">
            <el-radio :label=0>禁用</el-radio>
            <el-radio :label=1>正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!--新增权限对话框-->
    <el-dialog
        v-model="permDialogVisible"
        title="分配权限"
        width="600px">

      <el-form :model="permForm">
        <el-tree
            :data="permTreeData"
            show-checkbox
            ref="permTree"
            node-key="id"
            :default-expand-all="true"
            :props="defaultProps">
        </el-tree>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
      </span>
      </template>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      total: 0,
      current: 1,
      size: 10,
      dialogVisible: false,
      permDialogVisible: false,

      editForm: {},
      searchForm: {
        name: ''
      },
      delBtnStatu: true,
      tableData: [],

      editFormRules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ],
        statu: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      permForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permTreeData: [],
    }
  },
  created() {
    this.getRoleList();

    this.axios.get('/sys/menu/list').then(res => {
      this.permTreeData = res.data.data;
      console.log(this.permTreeData);
    });
  },
  methods: {
    getRoleList() {
      this.axios.get("/sys/role/list", {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
        this.size = res.data.data.size;
        this.current = res.data.data.current;
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
      this.multipleSelection = val;

      this.delBtnStatu = val.length == 0 ? true : false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getRoleList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
              .then(res => {

                this.$message({
                  showClose: true,
                  message: '操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getRoleList()
                  }
                });

                this.dialogVisible = false
                this.resetForm(formName)
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editHandle(id) {
      this.axios.get('/sys/role/info/' + id).then(res => {
        this.editForm = res.data.data

        this.dialogVisible = true
      })
    },
    delHandle(id) {

      var ids = []


      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(item => {
          ids.push(item.id)
        })
      }

      this.axios.post("/sys/role/delete/" + ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });

      })
    },
    permHandle(id) {
      this.permDialogVisible = true

      this.axios.get('/sys/role/info/' + id).then(res => {
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
        this.permForm = res.data.data
      })
    },
    submitPermFormHandle(formName){
      var menuIds = this.$refs.permTree.getCheckedKeys()

      this.axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(res => {
        console.log(this.permForm.id)
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });

        this.permDialogVisible = false
        this.resetForm(formName)
      })
    }
  }
}
</script>

<style scoped>

.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>