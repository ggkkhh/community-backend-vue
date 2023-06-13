<template>
  <div class="dashboard-editor-container">

    <!-- 首页顶部轮播 -->
    <div class="index-carousel">
      <el-carousel :interval="5000" arrow autoplay v-viewer>
        <el-carousel-item v-for="item in noticeList" :key="item.noticeId">
          <div class="notice-content" v-html="item.noticeContent"></div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 首页个人信息卡片 -->
    <div class="index-container">
      <el-row>
        <el-col :span="24">
          <el-card>
            <img :src="avatar" class="user-avatar">
            <div class="user-info">
              <span class="user-tips">欢迎 </span><strong class="user-name">{{ name }}</strong>
              <span class="user-tips"> 访问后台系统，您可以选择继续进行操作。</span>
              <div class="">
                <span>若您发现没有相应菜单可操作，或者分配的角色权限错误，请联系管理员==></span>
                <el-link type="primary" target="_blank" href="https://www.roydon.top"> admin </el-link>
                <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                <el-rate v-model="sysValue" show-text>
                </el-rate>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 随机名言 -->
    <div class="index-container">
      <el-row>
        <el-col :span="24">
          <el-card>
            <div class="is-center">
              <el-tooltip effect="dark" content="点击刷新" placement="top">
                <div class="is-center" style="cursor: pointer;" @click.stop="getRandomMingyan()"
                  v-html="randomMingyan.content">
                </div>
              </el-tooltip>
              <hr />
              <div class="is-center" v-html="randomMingyan.origin"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:10px;margin-bottom:20px;border-radius: 10px;">
      <line-chart :chart-data="lineChartData" />

    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <china-map></china-map>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="platform-flex">
            <el-card v-for="i in 8" :key="i" shadow="hover" class="platform-card">
              <router-link to="" @click.native="openLink(`https://github.com/`)">
                <img class="platform-avatar"
                  src="https://community-server-oss.oss-cn-shanghai.aliyuncs.com/2023/05/21/53699ba393b4495a8c407896567bf0c3favicon.png">
                <span class="platform-name">github</span>
              </router-link>
            </el-card>

          </div>
        </div>
      </el-col>
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
                <h3>{{ item.noticeTitle }}</h3>
                <el-divider><svg-icon icon-class="message" /></el-divider>
                <div v-viewer v-html="item.noticeContent"></div>
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
import { mapGetters } from 'vuex'
import ChinaMap from './dashboard/ChinaMap'
import axios from 'axios'

const lineChartData = {
  nowCommunityAmount: {
    actualData: [1, 1, 1, 2, 2, 3, 3]
  },
  nowUserAmount: {
    actualData: [2, 5, 10, 10, 10, 12, 13]
  },
  nowVisitPeople: {
    actualData: [3, 10, 20, 50, 100, 120, 200]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    ChinaMap
  },
  data() {
    return {
      lineChartData: lineChartData.nowCommunityAmount,
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
      timeDate: new Date(),
      //系统评分
      sysValue: null,
      //随机名言
      randomMingyan: {}
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'device'
    ]),
  },
  created() {
    this.getList()
    this.getRandomMingyan()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    /** 查询公告列表 */
    getList() {
      listNotice(this.queryParams).then(response => {
        // console.log(response.rows);
        this.noticeList = response.rows;
      });
    },
    hilarity() {
      this.$notify({
        title: '提示',
        message: '今日已过',
        duration: 0,
      });
    },
    openLink(link) {
      console.log(link);
      window.open(link, "_blank")
    },
    getRandomMingyan() {
      axios({
        method: 'get',
        url: 'https://api.xygeng.cn/one'
      }).then(async (res) => {
        this.randomMingyan = res.data.data
        // console.log(this.randomMingyan);
      })
    }
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

  .index-container {
    margin-bottom: 20px;

    .user-avatar {
      max-width: 96px;
      border-radius: 50%;
    }

    .user-info {
      padding: 10px 20px;
    }

    .user-name {
      font-size: 1.3em;
      color: blue !important;
    }

    .user-tips {
      font-size: 1.2em;
      line-height: 2;
      font-weight: bold;
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

.platform-flex {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  .platform-card {
    width: 24.25%;
    height: 84px;
    margin: 0 auto 10px;
    align-content: center;

    .platform-avatar {
      width: 64px;
      width: 64px;
      border-radius: 5px;
    }

    .platform-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 64px;
      display: inline-block;
      padding: 0 10px;
    }
  }

}
</style>
