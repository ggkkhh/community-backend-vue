<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <!-- 搜索 -->
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
      </template>

      <!-- 通知 -->
      <notification id="notification" :noticeList="noticeList" class="right-menu-item hover-effect" />
      <!-- 下载手机App -->
      <el-tooltip class="svg-icon-item" effect="dark" content="下载手机App" placement="bottom">
        <el-badge is-dot>
          <svg-icon icon-class="iphone12" @click.stop="Toast" />
        </el-badge>
      </el-tooltip>
      <!-- 设置 -->
      <el-tooltip class="svg-icon-item" effect="dark" content="主题设置" placement="bottom">
        <el-badge >
          <svg-icon icon-class="system" @click.stop.native="setting = true" />
        </el-badge>
      </el-tooltip>
      <!-- 用户头像 -->
      <el-dropdown class="user-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span class="user-name">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item icon="el-icon-user">
              <span>个人中心</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout" icon="el-icon-switch-button">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 全屏 -->
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Notification from '@/components/Notification'
import { listNotice } from "@/api/system/notice";
// import RuoYiGit from '@/components/RuoYi/Git'
// import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    Search,
    Notification
  },
  data() {
    return {
      // 公告表格数据
      noticeList: [],
      // 查询参数，noticeType: 1表示只会查询类型为通知的数据
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        noticeTitle: undefined,
        noticeType: 1,
        createBy: undefined
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  mounted() {
    this.getNoticeList()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => { });
    },
    /** 查询公告列表 */
    getNoticeList() {
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
      });
    },
    Toast() {
      this.$customModal.info({
        title: '扫码下载手机APP',
        content: "手机App二维码接口待对接",
        onCancel: () => {
          console.log('...');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .user-container {
      // margin-right: 20px;

      .avatar-wrapper {
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          max-width: 100px;
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.svg-icon-item {
  padding: 0 10px;
  cursor: pointer;
}
</style>
