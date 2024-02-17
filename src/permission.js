// 通过路由守卫来进行权限的控制
import router from './router';
import store from './store';
import { ElMessage } from 'element-plus';
import { getStorage } from '@/utils/storage';
import tools from '@/utils/tools';

// 白名单
let hasRoles = true;
const whiteList = ['/login', '/404', '/403', '/500'];

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userInfo = getStorage('userInfo');
  document.title = to.meta.title || 'you are the Best !';
  // 1.判断是否有token
  if (userInfo && Object.keys(userInfo)?.length && userInfo.token) {
    // 2. 判断是否是登录页
    if (to.path === '/login') {
      next('/');
    } else {
      // 3.判断是否有用户信息
      if (store.getters.userInfo) {
        // 动态添加路由
        await store.dispatch('SET_PERMISSION_LIST');
        await store.dispatch('SET_ACTIONS_LIST');
        const permissionList = store.getters.permissionList || [];
        if (permissionList.length && hasRoles) {
          const list = tools.generateRoutes(permissionList);
          list.forEach((item) => {
            if (item.component) {
              let url = item.component;
              item.component = () => import(`@/views${url}.vue`);
              router.addRoute('home', item);
            }
          });
          router.addRoute({
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/views/common/Error_404.vue'),
            meta: {
              title: '404',
            },
          });
        }
        if (hasRoles) {
          hasRoles = false;
          next({ ...to, replace: true });
        } else {
          next();
        }
      } else {
        try {
          // 获取用户信息
          await store.dispatch('SET_USER_INFO');
          next();
        } catch (error) {
          // 获取失败, 清除token, 重新登录
          await store.dispatch('LOGOUT');
          ElMessage.error(error || 'Has Error');
          next(`/login`);
        }
      }
    }
  } else {
    // 看看有没有在白名单之内,有的话就直接跳转
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(to.path === '/login' ? undefined : '/login');
    }
  }
});
