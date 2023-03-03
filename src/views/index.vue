<template>
  <div class="dashboard-editor-container">

    <div class="index-carousel">
      <el-carousel :interval="5000" arrow autoplay>
        <el-carousel-item v-for="item in noticeList" :key="item.noticeId">
          <div class="notice-content" v-html="item.noticeContent"></div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:10px;margin-bottom:20px;border-radius: 10px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <h3><svg-icon icon-class="date" /> 日历</h3>
          <el-calendar v-model="timeDate">
          </el-calendar>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <h3><svg-icon icon-class="message" /> 系统公告</h3>
          <el-timeline>
            <el-timeline-item v-for="item in noticeList" :key="item.noticeId" :timestamp="item.createTime"
              placement="top">
              <el-card shadow="hover">
                <h4>{{ item.noticeTitle }}</h4>
                <el-divider><svg-icon icon-class="message" /></el-divider>
                <p>{{ item.noticeContent }}</p>
              </el-card>
            </el-timeline-item>

          </el-timeline>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <h3><svg-icon icon-class="time" /> 系统更新日志</h3>
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                V1.0.0 后台系统准备工作
              </template>
              <div>简化流程：设计简洁直观的操作流程；</div>
              <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
              <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
              <div>与现实生活一致、与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
              <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import { listNotice } from "@/api/system/notice";

const lineChartData = {
  nowCommunityAmount: {
    actualData: [1, 1, 1, 2, 2, 3, 3]
  },
  nowUserAmount: {
    actualData: [2, 5, 10, 10, 10, 12, 13]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.nowCommunityAmount,
      // 首页轮播图资源
      carouselImages: [
        {
          "id": 0, "path": "@/assets/images/carousel-1.webp"
        },
        {
          "id": 1, "path": "@/assets/images/carousel-2.webp"
        },
        {
          "id": 2, "path": "@/assets/images/carousel-3.webp"
        },],
      // 公告表格数据
      noticeList: [],
      // 查询参数，noticeType: 2表示只会查询类型为公告的数据
      queryParams: {
        pageNum: 1,
        pageSize: 4,
        noticeTitle: undefined,
        noticeType: 2,
        createBy: undefined
      },
      //日历
      timeDate: new Date()

    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    /** 查询公告列表 */
    getList() {
      listNotice(this.queryParams).then(response => {
        console.log(response.rows);
        this.noticeList = response.rows;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .index-carousel {
    margin-bottom: 20px;

    .notice-content {
      padding: 20px;
    }

    .carousel-img {
      width: 100%;
      height: 100%;
    }

    .el-carousel {
      border-radius: 10px;

      .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
    }
  }

  .chart-wrapper {
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;

  }
}

.el-timeline {
  padding: 0 !important;
}



@media (max-width:1024px) {
  .chart-wrapper {
    padding: 10px;
  }
}
</style>
