<template>
  <el-popover placement="bottom" width="300" trigger="hover">
      <!-- 内容 -->
      <el-card class="notive-card" shadow="hover">
          <h3>{{ item.noticeTitle }}</h3>
          <div v-html="item.noticeContent"></div>
          <span><svg-icon icon-class="date" /> {{ item.createTime }}</span>
      </el-card>
      <!-- 图标 -->
      <div slot="reference">
          <el-badge is-dot class="item">
              <svg-icon icon-class="notification" />
          </el-badge>
      </div>
  </el-popover>
</template>

<script>

export default {
  name: 'Notification',
  props: {
      // 传入一个图片二维码(Base64)
      qrCode: {
          type: String,
          default: [],
      }
  },
}
</script>

<style scoped>
.notive-card {
  margin-bottom: 8px;
}
</style>
