<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="部门名称">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleCreate('')"
          v-permission="'dept-create'"
          >新增</el-button
        >
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-permission="'dept-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              v-permission="'dept-delete'"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :title="dialogTitle" v-model="showModal">
    <el-form
      ref="dialogForm"
      :model="deptForm"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader
          placeholder="请选择上级部门"
          v-model="deptForm.parentId"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          clearable
          :options="deptList"
          :show-all-levels="true"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          placeholder="请输入部门名称"
          v-model="deptForm.deptName"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="user">
        <el-select
          placeholder="请选择部门负责人"
          v-model="deptForm.user"
          @change="handleUser"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="`${item.userId}/${item.userName}/${item.userEmail}`"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人邮箱" prop="userEmail">
        <el-input
          placeholder="请输入负责人邮箱"
          v-model="deptForm.userEmail"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, h } from 'vue';
import { getDeptListApi, operateDeptApi } from '@/api/dept';
import { getAllUserApi } from '@/api/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getMenuListApi } from '@/api/menu';
import monment from 'moment';
import { useRouter } from 'vue-router';
const router = useRouter();
const queryForm = ref({
  deptName: '',
});
const userList = ref([]);
const dialogTitle = ref('部门新增');
const pager = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1,
});
const deptForm = ref({
  deptName: '',
  parentId: [null],
  user: '',
  userEmail: '',
  userName: '',
});
const menuList = ref([]);
const dialogForm = ref(null);
const { ctx } = getCurrentInstance();
const deptList = ref([]);
const showModal = ref(false);
const columns = [
  {
    label: '部门名称',
    prop: 'deptName',
  },
  {
    label: '负责人',
    prop: 'userName',
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    formatter(row, column, value) {
      return monment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, value) {
      return monment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];
const permissionForm = ref(null);
const rules = ref({
  parentId: [
    {
      required: true,
      message: '请选择上级部门',
      trigger: 'blur',
    },
  ],
  deptName: [
    {
      required: true,
      message: '请输入部门名称',
      trigger: 'blur',
    },
  ],
  user: [
    {
      required: true,
      message: '请选择负责人',
      trigger: 'blur',
    },
  ],
});

const handleCurrentChange = (val) => {
  pager.value.pageNum = val;
  getDeptList();
};

const handleQuery = () => {
  getDeptList();
};

const handleReset = (formName) => {
  clearForm();
  getDeptList();
};

const clearForm = () => {
  deptForm.value = {
    deptName: '',
    parentId: [null],
  };
};
const handleCreate = (row) => {
  clearForm();
  dialogTitle.value = '部门新增';
  showModal.value = true;
};
const handleEdit = (row) => {
  console.log(row, 'row');
  dialogTitle.value = '部门编辑';
  deptForm.value = row;
  deptForm.value.user = `${row.userId}/${row.userName}/${row.userEmail}`;
  showModal.value = true;
};
const handleClose = () => {
  clearForm();
  showModal.value = false;
};

const handleUser = (val) => {
  const [userId, userName, userEmail] = val.split('/');
  deptForm.value.userId = userId;
  deptForm.value.userEmail = userEmail;
  deptForm.value.userName = userName;
};
const handleDel = (_id) => {
  ElMessageBox.confirm(h('p', null, '确认删除该菜单吗?'), '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async (action) => {
      if (action === 'confirm') {
        try {
          await operateDeptApi({
            action: 'delete',
            _id,
          });
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          getDeptList();
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

const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const { msg } = await operateDeptApi({
          ...deptForm.value,
          action: deptForm.value._id ? 'edit' : 'add',
        });
        ElMessage({
          type: 'success',
          message: msg || '操作成功!',
        });
        handleClose();
        getDeptList();
      } catch (error) {}
    } else {
      return false;
    }
  });
};

const getDeptList = async () => {
  try {
    const { data } = await getDeptListApi({
      ...queryForm.value,
    });
    deptList.value = data;
  } catch (error) {
    console.log(error);
  }
};
const getMenuList = async () => {
  try {
    const { data } = await getMenuListApi();
    menuList.value = data.menuList;
  } catch (error) {
    console.log(error);
  }
};

const getAllUserList = async () => {
  try {
    const { data } = await getAllUserApi();
    userList.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getDeptList();
  getMenuList();
  getAllUserList();
});
</script>
