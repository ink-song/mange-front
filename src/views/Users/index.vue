<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state" style="width: 160px">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row)"
              v-has="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, h } from 'vue';
import { getUserListApi, deleteUserApi } from '@/api/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import monment from 'moment';
import { useRouter } from 'vue-router';
const router = useRouter();
const user = ref({
  userId: '',
  userName: '',
  state: 1,
});
const { ctx } = getCurrentInstance();
const userList = ref([]);
const selectKey = ref([]);
const pager = ref({
  total: 0,
  pageSize: 10,
  currentPage: 1,
});
const columns = ref([
  {
    label: '用户ID',
    prop: 'userId',
  },
  {
    label: '用户名',
    prop: 'userName',
  },
  {
    label: '用户邮箱',
    prop: 'userEmail',
  },
  {
    label: '用户角色',
    prop: 'role',
    formatter(row, column, value) {
      return {
        0: '管理员',
        1: '普通用户',
      }[value];
    },
  },
  {
    label: '用户状态',
    prop: 'state',
    formatter(row, column, value) {
      return {
        1: '在职',
        2: '离职',
        3: '试用期',
      }[value];
    },
  },
  {
    label: '注册时间',
    prop: 'createTime',
    width: 180,
    formatter: (row, column, value) => {
      return monment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
    width: 180,
    formatter: (row, column, value) => {
      return monment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]);
const handleQuery = () => {
  pager.value.currentPage = 1;
  getUserList();
};
const handleReset = (formName) => {
  user.value = {
    userId: '',
    userName: '',
    state: 0,
  };
  pager.value.currentPage = 1;
  getUserList();
};
const handleCreate = () => {
  router.push({
    path: '/user/create',
  });
};
const handleEdit = (row) => {
  router.push({
    path: '/user/edit',
    query: {
      row: JSON.stringify(row),
    },
  });
};
const handleDel = (row) => {
  ElMessageBox.confirm(h('p', null, '确认删除该用户吗?'), '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async (action) => {
      if (action === 'confirm') {
        try {
          await deleteUserApi({
            userIds: [Number(row.userId)],
          });
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          getUserList();
        } catch (error) {}
      } else {
        ElMessage({
          type: 'info',
          message: '已取消删除',
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    });
};
const handlePatchDel = () => {
  ElMessageBox.confirm(h('p', null, '确认删除该用户吗?'), '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async (action) => {
      if (action === 'confirm') {
        try {
          await deleteUserApi({
            userIds: selectKey.value.map((item) => item.userId),
          });
          selectKey.value = [];
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          getUserList();
        } catch (error) {}
      } else {
        ElMessage({
          type: 'info',
          message: '已取消删除',
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    });
};
const handleSelectionChange = (val) => {
  selectKey.value = val;
};
const handleCurrentChange = (val) => {
  pager.value.pageNum = val;
  getUserList();
};
const getUserList = async () => {
  try {
    const { data } = await getUserListApi({
      ...user.value,
      ...pager.value,
    });
    userList.value = data.list;
    pager.value.total = data.page.total;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getUserList();
});
</script>
