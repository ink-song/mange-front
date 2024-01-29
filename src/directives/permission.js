import { getStorage } from '@/utils/storage';
function checkPermission(el, binding) {
  const { value } = binding;
  // 获取localStorage中的按钮权限列表
  const actionsList = getStorage('actionsList');
  if (!actionsList.includes(value)) {
    el.parentNode && el.parentNode.removeChild(el);
  }
}

export default {
  // 在绑定元素的父组件被挂载后调用
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  // 在包含组件的VNode，以及子组件的VNode更新后调用
  update(el, binding) {
    checkPermission(el, binding);
  },
};
