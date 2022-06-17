<template>
  <div class="main" id="in">

  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import {
  PieChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import {inOrOutAnalysis} from "@/api/inventoryRecord";

echarts.use(
    [TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
);

export default {

  data() {
    return {
      commodityList: []
    }
  },

  mounted() {
    this.getIn()
  },

  activated(){
    this.getIn()
  },

  methods: {
      getIn(){
        inOrOutAnalysis(1).then((res) => {
            if (res.status) {
                let commodityList = res.data
                console.log(commodityList)
                let chartDom = document.getElementById('in');
                let myChart = echarts.init(chartDom);
                let option;

                option = {
                title: {
                    text: '商品入库排行分析',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: commodityList,
                    emphasis: {
                        itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    }
                ]
                };

                option && myChart.setOption(option);
            }

          if(res.code===403){
            this.$router.push("/exception/403")
          }
          if(res.code===500){
            this.$router.push('/exception/500')
          }
        })
      }
  },

}
</script>

<style scoped>
.main {
  width: 100%;
  height: 500px;
  background: #ffffff;
  padding: 50px;
}
</style>