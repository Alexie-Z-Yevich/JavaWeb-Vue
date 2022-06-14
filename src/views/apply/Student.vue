<template>
  <div>
    <div>
      <el-form :model="editForm" status-icon :rules="rules" ref="passForm" label-width="100px">
        <el-form-item label="请假原因" prop="currentPass">
          <el-select v-model="editForm.emp" placeholder="请选择">
            <el-option
                v-for="item in empOptions"
                :key="item.id"
                :label="item.label"
                :value="item.emp">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细理由">
          <el-input type="text" v-model="editForm.description"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

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
        label="姓名"
        width="100">
    </el-table-column>
    <el-table-column
        prop="emp"
        width="150px"
        label="请假原因">
    </el-table-column>
    <el-table-column
        prop="description"
        label="详细理由">
    </el-table-column>

    <el-table-column
        prop="statuId"
        label="审核状态"
        width="120px">
      <template v-slot="scope">
        <el-tag size="large" v-if="scope.row.statuId === 0" type="info">未审核</el-tag>
        <el-tag size="large" v-if="scope.row.statuId === 1" type="success">通过</el-tag>
        <el-tag size="large" v-if="scope.row.statuId === 2" type="danger">驳回</el-tag>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      empOptions: [{emp: '事假'}, {emp: '病假'}, {emp: '其他'}],
      editForm: {},
      tableData: [],
      rules: {
        currentPass: [
          {required: true, message: "请输入请假原因", trigger: "blur"},
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    resetForm(formName) {
      this.editForm = {}
    },
    getUserList() {
      this.axios.get("/apply/message/list").then(res => {
        this.tableData = res.data.data
      })
    },
    submitForm(formName) {
      this.axios.post('/apply/message/push', this.editForm)
          .then(res => {
            this.getUserList()
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          })
    },
  }
}
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}

</style>