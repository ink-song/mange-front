<!--
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-20 00:00:56
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-21 11:47:25
 * @FilePath: /manger-front/src/views/Welcome.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">慕课通用后台管理系统</div>
      <div class="desc">
        - Vue3.0+ElementPlus+Node+Mongo打造通用后台管理系统
      </div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>

<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url("./../assets/images/welcome.png");
    width: 371px;
    height: 438px;
  }
}
</style>
