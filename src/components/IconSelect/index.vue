<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons"
      @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 32px;width: 16px;margin-right: 4px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons
    }
  },
  methods: {
    filterIcons() {
      this.iconList = icons
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  max-width: 50vw;
  padding: 10px;

  .icon-list {
    height: 300px;
    min-width: 50vw;
    overflow-y: scroll;

    div {
      height: 32px;
      line-height: 32px;
      background-color: #f5f3f0;
      margin-bottom: 5px;
      text-align: center;
      border-radius: 5px;
      transition: all .3s;
      cursor: pointer;
      width: 32%;
      float: left;
    }

    div:nth-child(3n-1) {
      margin: 0px 1%;
      width: 34%
    }

    div:hover {
      background-color: #ffc11888;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
