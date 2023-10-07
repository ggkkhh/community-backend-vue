<template xmlns="">
  <div class="container">
    <!-- <div class="logo"></div> -->
    <!-- 登录区域 -->
    <div class="content">
      <!-- 配图 -->
      <div class="pic"></div>
      <!-- 表单 -->
      <div class="field">
        <!-- [移动端]标题 -->
        <h2 class="mobile-title">
          <div class="title" style="padding: 10px;">社区后台管理系统</div>
        </h2>
        <!-- 表单 -->
        <div class="form-cont">
          <el-tabs class="form" v-model="loginType" style="float:none;">
            <el-tab-pane label="账号密码登录" name="up"></el-tab-pane>
            <el-tab-pane label="手机短信登录" name="sms"></el-tab-pane>
            <el-tab-pane label="二维码登录" name="qr"></el-tab-pane>
          </el-tabs>
          <div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
              <!-- 账号密码登录 -->
              <div v-if="loginType === 'up'">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" v-if="captchaEnabled">
                  <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                    @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                  </el-input>
                  <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                  </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 10px 0;">记住密码</el-checkbox>
              </div>

              <!-- 手机短信登录 -->
              <div v-if="loginType === 'sms'">
                <el-form-item prop="telephone">
                  <el-input v-model="loginForm.telephone" type="text" auto-complete="off" placeholder="请输入手机号">
                    <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="phoneCode">
                  <el-input v-model="loginForm.phoneCode" type="text" auto-complete="off" placeholder="短信验证码"
                    class="sms-login-mobile-code-prefix" @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon prefix-svg-icon" />
                    <template slot="append">
                      <span v-if="mobileCodeTimer <= 0" class="getMobileCode" @click="getSmsCode"
                        style="cursor: pointer;">获取验证码</span>
                      <span v-if="mobileCodeTimer > 0" class="getMobileCode">{{ mobileCodeTimer
                      }}秒后重试</span>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- 二维码登录 -->
              <div v-if="loginType === 'qr'">
                <div class="login-qr-code">
                  <div v-if="showQRCodeErrorMask == true" class="mask-qrcode br10">
                    <h3 style="color: red;">二维码已失效</h3>
                  </div>
                  <!-- <img :src="qrCodeUrl" @click="getLoginQRCodeImg" class="login-qr-code-img" /> -->
                  <img :src="qrCodeUrl" class="login-qr-code-img br10" />
                </div>
                <div class="login-qr-code">
                  <h3>{{ qrCodeState }}</h3>
                  <span>请使用移动端扫码登录</span>
                </div>
              </div>

              <!-- 登录按钮 -->
              <el-form-item style="width:100%;" v-if="loginType != 'qr'">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                  @click.native.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right" v-if="register">
                  <router-link class="link-type" :to="'/register'">立即注册
                  </router-link>
                </div>
              </el-form-item>

              <!-- 教程说明 -->
              <!-- <el-form-item style="width:100%; margin-top:-25px">
                <el-link href="#">📚开发指南</el-link>
                <el-link href="#" style="margin-left: 10px">⚡面试手册</el-link>
              </el-form-item> -->
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="footer">
      <span>Copyright © 2022-2023 Zut All Rights Reserved</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, sendSmsCode, getLoginQRCode, getLoginQrCodeStatus } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import store from "@/store";
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      // 二维码登录
      qrCodeUrl: "",
      uuid: "",
      qrCodeState: "",
      timer: "",
      showQRCodeErrorMask: false,
      mobileCodeTimer: 0,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: true,
      loginType: "up",
      loginForm: {
        username: "admin",
        password: "admin#123456",
        rememberMe: false,
        code: "",
        uuid: "",
        telephone: "",
        phoneCode: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
        telephone: [
          { required: true, trigger: "blur", message: "手机号不能为空" },
          {
            validator: function (rule, value, callback) {
              if (/^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/.test(value) === false) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            }, trigger: "blur"
          }
        ]
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
    this.getLoginQRCodeImg()
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    // 获取登录二维码
    getLoginQRCodeImg() {
      getLoginQRCode().then((res) => {
        this.qrCodeUrl = res.data.qrcode;
        this.uuid = res.data.uuid
        this.timer = setInterval(() => {
          this.getLoginQRCodeState(this.uuid, '0')
        }, 2000);
      });
    },
    // 获取二维码状态
    getLoginQRCodeState(uuid, currentStatus) {
      getLoginQrCodeStatus(uuid, currentStatus).then((res) => {
        this.qrCodeState = res.status;
        if (this.qrCodeState === '0') {
          // 待扫描
          this.qrCodeState = ""
        }
        if (this.qrCodeState === '1') {
          // 已扫描
          this.qrCodeState = "已扫码，待确认"
          this.qrCodeUrl = res.avatar
          // clearTimeout(this.timer);
        }
        if (this.qrCodeState === '2') {
          // 已确认
          setToken(res.token)
          store.commit('SET_TOKEN', res.token)
          this.$router.push({ path: this.redirect || "/" })
          clearTimeout(this.timer);
        }
        console.log(this.qrCodeState);
      }).catch(r => {
        console.log("二维码已过期");
        clearTimeout(this.timer);
        this.showQRCodeErrorMask = true
      });
    },
    //
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store.dispatch(this.loginType === "sms" ? "SmsLogin" : "Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(() => {
            });
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    },
    /** ========== 手机短信登录 ========== */
    getSmsCode() {
      if (this.mobileCodeTimer > 0) return;
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
        sendSmsCode(this.loginForm.telephone).then(res => {
          // this.$modal.msgSuccess("获取验证码成功")
          this.mobileCodeTimer = 60;
          let msgTimer = setInterval(() => {
            this.mobileCodeTimer = this.mobileCodeTimer - 1;
            if (this.mobileCodeTimer <= 0) {
              clearInterval(msgTimer);
            }
          }, 1000);
        });
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/login.scss";

.logo {
  display: block;
}

.oauth-login {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.oauth-login-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.oauth-login-item img {
  height: 25px;
  width: 25px;
}

.oauth-login-item span:hover {
  text-decoration: underline red;
  color: red;
}

.sms-login-mobile-code-prefix {
  :deep(.el-input__prefix) {
    top: 22%;
  }
}

.prefix-svg-icon {
  height: 100%;
}

.login-qr-code {
  position: relative;
  text-align: center;
}

.login-qr-code-img {
  width: 160px;
}

.mask-qrcode {
  width: 160px;
  height: 160px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff9e9e85;
  backdrop-filter: blur(2px);
}

.br10 {
  border-radius: 10px;
}
</style>
