import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/roydon.scss' // roydon css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import {
  download
} from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import {
  getDicts
} from "@/api/system/dict/data";
import {
  getConfigKey
} from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree
} from "@/utils/roydon";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
// 图片预览组件
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
// 自定义弹框
import customModal from '@/components/Toast/modal.js';
// vue图片懒加载
// import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   // 懒加载默认加载图片
//   loading: require('@/assets/logo/logo.png'),
//   // 加载失败后加载的图片
//   error: require('@/assets/logo/logo.png'),
//   attempt: 1
//   // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
//   // listenEvents: [ 'scroll' ]
// })
// 页面引导库
// import Driver from "driver.js"
// import "driver.js/dist/driver.css"

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$customModal = customModal;

// const driver = new Driver();
// Vue.prototype.$Driver = new Driver({
//   classname: "driver-item", // 为你的指示模块添加类名 如果你要取消 某一个按钮(比如:"上一步""下一步""完成")的 这个类名还是要加上的
//   animate: true, //在更改突出显示的元素时设置动画
//   opacity: 0.7, //背景不透明度(0表示只有弹出窗口没有覆盖)
//   padding: 10, //元素与边缘的距离
//   allowclose: true, //单击覆盖是否应关闭
//   donebtntext: "完成", //最后一个按钮上的文本
//   closebtnext: '关闭', //此步骤的"关闭"按钮上的文本
//   prevBtnText: "上一步", //此步骤的上一个按钮文本
//   nextBtnText: '下一步', //此步骤的下一步按钮文本
//   onNext: (() => {})
// })

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 2022
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
