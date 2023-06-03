<template>
  <div class="custom-toast-wrap" v-if="isShow">
    <div class="custom-toast" :style="{ width }">
      <div class="custom-toast-header">
        <h3 class="toast-title">{{ title }}</h3>
      </div>
      <div class="custom-toast-content">
        <div class="custom-toast-body">
          <div class="content-img"><img :src="imgSrc" /></div>

          <div class="content-info">{{ content }}</div>
        </div>
      </div>
      <img class="toast-close" @click="handleCancel" src="@/assets/images/cancel.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: "customModal",
  data() {
    return {
      //调用的时候里面的配置除了content外其他都为非必填，不传以默认项为准
      isShow: false, //控制显隐
      title: "提醒", //标题
      imgSrc: "",
      type: "confirm", //类型
      content: "", //内容
      width: "520px",
    };
  },

  methods: {
    handleCancel() {
      this.isShow = false;
      if (this.onCancel) {
        this.onCancel();
      }
    },
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      document.addEventListener("keyup", function (e) {
        if (e.keyCode == 27) {
          that.isShow = false;
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.custom-toast-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 9999;
  outline: 0;
  background-color: #373737b5;

  .custom-toast {
    width: auto;
    border-radius: 20px;
    margin: 12% auto;
    position: relative;
    outline: 0;
    background-color: #fff;

    .custom-toast-header {
      border-bottom: none;
      height: auto;
      text-align: center;
      padding: 10px;
    }

    .custom-toast-content {
      position: relative;
      padding: 20px;
      border-top: 1px solid #000;

      .custom-toast-body {
        padding: 0 10px;
        font-size: 14px;
        line-height: 1.5;

        .content-img {
          text-align: center;
          margin: 0 auto;
        }

        .content-info {
          min-height: 80px;
          font-size: 14px;
          color: #3e25e1;
          text-align: center;
        }

      }
    }

    .toast-close {
      width: 32px;
      height: 32px;
      cursor: pointer;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 40px);

      &:hover {
        width: 34px;
        height: 34px;
        transform: translate(-50%, 42px);
        transition: all 0.3s;
      }
    }


  }
}
</style>
