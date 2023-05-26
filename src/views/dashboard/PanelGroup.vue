<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('nowCommunityAmount')">
        <div class="card-panel-icon-wrapper icon-community">
          <svg-icon icon-class="community" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            系统住户数量
          </div>
          <count-to :start-val="0" :end-val="sysCommunityAmount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('nowUserAmount')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            系统用户数量
          </div>
          <count-to :start-val="0" :end-val="sysUserAmount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('nowVisitPeople')">
        <div class="card-panel-icon-wrapper icon-visit-people">
          <svg-icon icon-class="visit-people" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            系统访问人数
          </div>
          <count-to :start-val="0" :end-val="sysVisitPeople" :duration="3000" class="card-panel-num" />➕
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getUserAmount } from "@/api/system/user";
import { getCommunityAmount } from "@/api/system/dept";

export default {
  data() {
    return {
      sysCommunityAmount: 1,
      sysUserAmount: 1,
      sysVisitPeople: 2000,
    }
  },
  components: {
    CountTo
  },
  created() {
    this.getAmount()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getAmount() {
      getUserAmount().then(res => {
        this.sysUserAmount = res.data
      }),
        getCommunityAmount().then(res => {
          this.sysCommunityAmount = res.data
        })

    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 100px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 1px 1px 2px #0000001a;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-community {
        background: #36a3f7;
      }

      .icon-visit-people {
        background: #6857c7;
      }


    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-community {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 10px;
      padding: 16px;
      transition: all 0.3s ease-out;
      border-radius: 10px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
