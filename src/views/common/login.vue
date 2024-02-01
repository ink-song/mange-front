<!--
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 11:04:02
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-02-01 11:14:39
 * @FilePath: /manage-fe/src/views/common/login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="form" status-icon :rules="rules">
        <div class="title">欢迎登录</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            v-model="form.userName"
          />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            prefix-icon="el-icon-view"
            v-model="form.userPwd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userLogin } from '@/api/login';
import { useStore } from 'vuex';
import { getStorage } from '@/utils/storage';
import tools from '@/utils/tools';
const store = useStore();
const router = useRouter();
const form = ref({
  userName: '',
  userPwd: '',
});

const userForm = ref(null);

const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 10,
      message: '长度在 3 到 10 个字符',
      trigger: 'blur',
    },
  ],
  userPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
};

const login = () => {
  // 校验表单
  userForm.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    try {
      const { data } = await userLogin(form.value);
      // 校验通过
      store.dispatch('SET_USER_INFO', data);
      router.push('/welcome');
    } catch (error) {}
  });
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  height: 100vh;
  .modal {
    width: 400px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
      color: #000;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
