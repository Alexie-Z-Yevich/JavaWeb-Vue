<template>
  <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
</template>

<script>

export default {
  data() {
    return {
      option: {},
    };
  },
  mounted() {
    //this.$root => app
    console.log(this.echarts)
    let myChart = this.$echarts.init(document.getElementById("myChart"));
    // 绘制图表
    myChart.setOption({
      title: { text: "总用户量" },
      tooltip: {},
      xAxis: {
        data: ["12-3", "12-4", "12-5", "12-6", "12-7", "12-8"],
      },
      yAxis: {},
      series: [
        {
          name: "用户量",
          type: "line",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>