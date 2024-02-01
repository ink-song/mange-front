<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="../assets/images/logo.png" />
        <span>球队管理系统</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        background-color="#001529"
        mode="vertical"
        text-color="#fff"
        router
        class="nav-menu"
        :default-active="activeMenu"
        :collapse="isCollapse"
      >
        <tree-menu :treeMenu="treeMenuArray" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggleCollapse">
            <el-icon><Fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><Promotion /></el-icon>
          </el-badge>
          <el-dropdown split-button trigger="click" @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                > -->
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
const isCollapse = ref(false);
import TreeMenu from '@/components/TreeMenu.vue';
const treeMenuArray = ref([]);
const activeMenu = ref('/welcome');
import BreadCrumb from '@/components/BreadCrumb.vue';
import { useStore } from 'vuex';
import router from '@/router';
const store = useStore();
const userInfo = computed(() => {
  return store.state.userInfo.userInfo;
});
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
const noticeCount = ref(0);

const handleLogout = (value) => {
  if (value === 'logout') {
    store.dispatch('LOGOUT');
    router.push('/login');
  }
};
const getTreeMenu = () => {
  treeMenuArray.value = store.getters.permissionList;
};

onMounted(() => {
  getTreeMenu();
});
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }

    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          // color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
