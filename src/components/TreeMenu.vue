<!--
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-20 21:31:52
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-22 23:20:02
 * @FilePath: /manger-front/src/components/TreeMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  
  <div v-for="(menu, sindex) in treeMenu" :key="sindex">
    <el-sub-menu :key="sindex" :index="menu.path">
        <template #title>
          <i :class="menu.icon"></i>
          <span>{{ menu.menuName }}</span>
        </template>
        <div v-if="menu.children.length">
          <el-menu-item
            v-for="(item, index) in menu.children"
            :key="index"
            :index="item.path"
          >
            <i :class="item.icon"></i>
            <span>{{ item.menuName }}</span>
          </el-menu-item>
        </div>
      </el-sub-menu>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
defineProps({
  treeMenu: {
    type: Array,
    default: () => [],
  }
});
</script>
<style>
.nav-menu {
  height: calc(100vh - 50px);
  border-right: none;
}
</style>
