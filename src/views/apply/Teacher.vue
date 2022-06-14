<template>
  <!--搜索部分-->
  <el-form :inline="true">
    <el-form-item>
      <el-select v-model="searchForm.statu" placeholder="审核状态">
        <el-option
            v-for="item in statuOptions"
            :key="item.classId"
            :label="item.label"
            :value="item.statu">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="getUserList">搜索</el-button>
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

    <el-table-column
        prop="icon"
        width="260px"
        label="操作">

      <template v-slot="scope">

        <el-button type="success" @click="submit(scope.row.id,1)">通过</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="danger" @click="submit(scope.row.id, 2)">驳回</el-button>
        <el-divider direction="vertical"></el-divider>

        <el-popconfirm title="确认删除这一段内容？" @confirm="delHandle(scope.row.id)">
          <template #reference>
            <el-button type="info">删除</el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>

  </el-table>

</template>

<script>
export default {
  name: "Teacher",
  data() {
    return {
      statuOptions: [
        {statu: '未审核'},
        {statu: '通过'},
        {statu: '驳回'},
      ],
      options: [],
      searchForm: {},
      tableData: [],
      delBtlStatu: true,
      editForm: {},
      dialogFormVisible: false,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    submit(id, statuId) {
      this.editForm.id = id
      this.editForm.statuId = statuId
      this.axios.post('/apply/message/submit', this.editForm).then(res => {
        this.getUserList()
      })
    },
    getUserList() {
      this.axios.get("/apply/message/all", {
        params: {
          statu: this.searchForm.statu,
        }
      })
          .then(res => {
            this.tableData = res.data.data
          })
    },
    handleClose() {
      this.resetForm('editForm')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0
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
      this.axios.post("/apply/message/delete", ids).then(res => {
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