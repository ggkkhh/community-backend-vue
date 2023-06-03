import Vue from 'vue';
import customModal from './modal.vue';

const modal = Vue.extend(customModal);
// console.log(new modal({data}))
let instance = new modal({}).$mount();
document.body.appendChild(instance.$el);
customModal.info = function (option) {
  Object.assign(instance, option, {
    type: 'info'
  });
  instance.isShow = true;
}
export default customModal;
