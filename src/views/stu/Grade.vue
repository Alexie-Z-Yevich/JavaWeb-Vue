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
        label="分析">
      <template v-slot="scope">
        <el-button text @click="getAnalyze(scope.row.sid, scope.row.math,
                scope.row.java, scope.row.english, scope.row.et, scope.row.sname)">成绩总览
        </el-button>
      </template>
    </el-table-column>

  </el-table>

  <!--学生成绩分析页面-->
  <el-dialog
      title="学生信息"
      v-model="dialogVisible"
      width="660px">

    <template #footer>
      <div class="common-layout">
        <el-container>
          <el-aside width="360px">
            <div id="myChart" style="width: 360px;height: 270px;"></div>
          </el-aside>
          <el-container>
            <el-header height="200px" style="display: flex; text-align: center">
                学号：{{ editForm.sid }}<br>
                姓名：{{ editForm.sname }}<br>
                总分：{{ editForm.all }}<br>
                班级数学平均分：{{ editForm[0].avgMath }}<br>
                班级Java平均分：{{ editForm[0].avgJava }}<br>
                班级英语平均分：{{ editForm[0].avgEnglish }}<br>
                班级体育平均分：{{ editForm[0].avgET }}<br>
                班级总平均分：{{ editForm[0].avgAll }}<br>
            </el-header>
            <el-main height="80px">
              <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: "Grade",
  data() {
    return {
      options: [],
      activeName: '1',
      searchForm: {},
      dialogVisible: true,
      editForm: [{
        avgMath: '',
        avgJava: '',
        avgEnglish: '',
        avgET: '',
        avgAll: ''
      }],
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
  mounted() {
    this.dialogVisible = false
  },
  methods: {
    getAllClass() {
      this.axios.get("/stu/student/class").then(res => {
        this.options = res.data.data
        console.log(this.options)
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
    getAnalyze(sid, math, java, english, et, sname) {
      this.axios.get("/stu/grade/avg", {
        params: {
          s_id: sid,
        }
      }).then(res => {
        this.editForm = res.data.data
        this.editForm.all = math + java + english + et
        this.editForm.sname = sname
        this.editForm.sid = sid
        console.log(this.editForm)
        this.dialogVisible = true
      })
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        series: [
          {
            type: 'pie',
            data: [
              {
                value: math,
                name: '数学' + math + '分'
              },
              {
                value: java,
                name: 'Java' + java + '分'
              },
              {
                value: english,
                name: '英语' + english + '分'
              },
              {
                value: et,
                name: '体育' + et + '分'
              }
            ],
            roseType: 'area'
          }
        ]
      });
    }
  },
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>