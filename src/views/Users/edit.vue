<template>
  <el-form
    ref="dialogForm"
    :model="userForm"
    label-width="100px"
    :rules="rules"
    class="user-form"
  >
    <el-form-item label="用户名" prop="userName">
      <el-input
        v-model="userForm.userName"
        :disabled="action == 'edit'"
        placeholder="请输入用户名称"
      />
    </el-form-item>
    <el-form-item label="邮箱" prop="userEmail">
      <el-input
        v-model="userForm.userEmail"
        :disabled="action == 'edit'"
        placeholder="请输入用户邮箱"
      >
        <template #append>@imooc.com</template>
      </el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="岗位" prop="job">
      <el-input v-model="userForm.job" placeholder="请输入岗位" />
    </el-form-item>
    <el-form-item label="状态" prop="state">
      <el-select v-model="userForm.state">
        <el-option :value="1" label="在职"></el-option>
        <el-option :value="2" label="离职"></el-option>
        <el-option :value="3" label="试用期"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="系统角色" prop="roleList">
      <el-select
        v-model="userForm.roleList"
        placeholder="请选择用户系统角色"
        multiple
        style="width: 100%"
      >
        <el-option
          v-for="role in roleList"
          :key="role._id"
          :label="role.roleName"
          :value="role._id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="部门" prop="deptId">
      <el-cascader
        v-model="userForm.deptId"
        placeholder="请选择所属部门"
        :options="deptList"
        :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
        clearable
        style="width: 100%"
      ></el-cascader>
    </el-form-item>
    <div class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { operateUserApi } from '@/api/index';
import { ElMessage } from 'element-plus';
const router = useRouter();
const route = useRoute();
const userForm = ref({
  userName: '',
  userEmail: '',
  mobile: '',
  job: '',
  state: 1,
  roleList: [],
  deptId: [],
});

const action = ref(route.path.includes('edit') ? 'edit' : 'create');
const rules = ref({
  userName: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur',
    },
  ],
  userEmail: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
  mobile: [
    {
      pattern: /1[3-9]\d{9}/,
      message: '请输入正确的手机号格式',
      trigger: 'blur',
    },
  ],
  deptId: [
    {
      required: true,
      message: '请输入用户邮箱',
      trigger: 'blur',
    },
  ],
});
const dialogForm = ref(null);
const deptList = ref([
  {
    _id: 1,
    deptName: '技术部',
    children: [
      {
        _id: 11,
        deptName: '前端',
      },
      {
        _id: 12,
        deptName: '后端',
      },
    ],
  },
  {
    _id: 2,
    deptName: '产品部',
    children: [
      {
        _id: 21,
        deptName: '产品经理',
      },
      {
        _id: 22,
        deptName: '产品运营',
      },
    ],
  },
]);
const roleList = ref([
  {
    _id: 1,
    roleName: '管理员',
  },
  {
    _id: 2,
    roleName: '普通用户',
  },
]);
const handleClose = () => {
  clearForm();
  router.push('/user');
};

const clearForm = () => {
  const data = route.query?.row ? JSON.parse(route.query.row) : {};
  userForm.value = data;
};
clearForm();

const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        await operateUserApi({ ...userForm.value, action: 'edit' });
        ElMessage({
          type: 'success',
          message: '创建成功!',
        });
        handleClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      return false;
    }
  });
};
</script>

<style>
.user-form {
  background: #fff;
  padding: 16px;
}
</style>
