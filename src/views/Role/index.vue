<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
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
          v-has="'user-create'"
          >新增</el-button
        >
      </div>
      <el-table
        :data="roleList"
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
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
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
  <el-dialog :title="dialogTitle" v-model="showModal">
    <el-form
      ref="dialogForm"
      :model="roleForm"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          v-model="roleForm.remark"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 权限弹框-->
  <el-dialog title="权限设置" v-model="showPermission">
    <el-form label-width="100px">
      <el-form-item label="角色名称">
        {{ curRoleName }}
      </el-form-item>
      <el-form-item label="选择权限">
        <el-tree
          ref="permissionForm"
          :data="menuList"
          show-checkbox
          node-key="_id"
          default-expand-all
          :props="{ label: 'menuName' }"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPermission = false">取 消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, h } from 'vue';
import { getRolesListApi, operateRolesApi, updateRolesApi } from '@/api/roles';
import { getMenuListApi } from '@/api/menu';
import { ElMessageBox, ElMessage } from 'element-plus';
import monment from 'moment';
import { useRouter } from 'vue-router';
const router = useRouter();
const queryForm = ref({
  roleName: '',
});
const pager = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1,
});
const roleForm = ref({
  roleName: '',
  remark: '',
});
const dialogTitle = ref('');
const menuList = ref([]);
const dialogForm = ref(null);
const { ctx } = getCurrentInstance();
const roleList = ref([]);
const showModal = ref(false);
const curRoleName = ref('');
const showPermission = ref(false);
const columns = [
  {
    label: '角色名称',
    prop: 'roleName',
  },
  {
    label: '备注',
    prop: 'remark',
  },
  {
    label: '权限列表',
    prop: 'permissionList',
    width: 200,
    formatter: (row, column, value) => {
      return treeMenu(menuList.value, value);
    },
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
  roleName: [
    {
      required: true,
      message: '请输入角色角色名称',
    },
  ],
});

const handleCurrentChange = (val) => {
  pager.value.pageNum = val;
  getRolesList();
};

const handleQuery = () => {
  getRolesList();
};

const treeMenu = (tree, data) => {
  // console.log(data, '=>', menuList.value);
  // TODO:递归遍历
};
const handleReset = (formName) => {
  queryForm.value = {
    menuState: 1,
  };
  getRolesList();
};

const clearForm = () => {
  roleForm.value = {
    roleName: '',
    remark: '',
  };
};
const handleCreate = (row) => {
  dialogTitle.value = '角色新增';
  clearForm();
  showModal.value = true;
};
const handleEdit = (row) => {
  dialogTitle.value = '角色编辑';
  roleForm.value = row;
  showModal.value = true;
};
const handleClose = () => {
  clearForm();
  showModal.value = false;
};
const handleDel = (_id) => {
  ElMessageBox.confirm(h('p', null, '确认删除该角色吗?'), '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async (action) => {
      if (action === 'confirm') {
        try {
          await operateRolesApi({
            action: 'delete',
            _id,
          });
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          getRolesList();
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

const handlePermissionSubmit = async () => {
  const checkedKeys = permissionForm.value.getCheckedKeys();
  const halfCheckedKeys = permissionForm.value.getHalfCheckedKeys();
  const permissionList = {
    checkedKeys,
    halfCheckedKeys,
  };
  const _id = roleList.value.find((i) => i.roleName === curRoleName.value)._id;
  await updateRolesApi({
    _id,
    permissionList,
  })
    .then((res) => {
      ElMessage({
        type: 'success',
        message: '操作成功!',
      });
      showPermission.value = false;
      getRolesList();
    })
    .catch((err) => {
      console.log(err);
    });
};
const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const { msg } = await operateRolesApi({
          ...roleForm.value,
          action: roleForm.value._id ? 'edit' : 'add',
        });
        ElMessage({
          type: 'success',
          message: msg || '操作成功!',
        });
        handleClose();
        getRolesList();
      } catch (error) {}
    } else {
      return false;
    }
  });
};

const handleOpenPermission = (row) => {
  curRoleName.value = row.roleName;
  showPermission.value = true;
  const { checkedKeys } = row.permissionList;
  setTimeout(() => {
    permissionForm.value.setCheckedKeys(checkedKeys);
  });
};
const getRolesList = async () => {
  try {
    const { data } = await getRolesListApi({
      ...queryForm.value,
      ...pager.value,
    });
    roleList.value = data.list;
    pager.value.total = data.page.total;
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

onMounted(() => {
  getRolesList();
  getMenuList();
});
</script>
