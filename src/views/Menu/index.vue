<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState" style="width: 150px">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button
          type="primary"
          @click="handleCreate('')"
          v-has="'user-create'"
          >新增</el-button
        >
      </div>
      <el-table
        :data="menuList"
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
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button
              @click="handleCreate(scope.row)"
              type="primary"
              size="small"
              >新增</el-button
            >
            <el-button @click="handleEdit(scope.row)" size="small"
              >编辑</el-button
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
    </div>
  </div>
  <el-dialog :title="dialogTitle" v-model="showModal">
    <el-form
      ref="dialogForm"
      :model="menuForm"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="父级菜单" prop="parentId">
        <el-cascader
          v-model="menuForm.parentId"
          placeholder="请选择父级菜单"
          :options="menuList"
          :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
          clearable
        />
        <span>不选，则直接创建一级菜单</span>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="menuForm.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item
        label="菜单图标"
        prop="icon"
        v-show="menuForm.menuType == 1"
      >
        <el-input v-model="menuForm.icon" placeholder="请输入岗位" />
      </el-form-item>
      <el-form-item
        label="路由地址"
        prop="path"
        v-show="menuForm.menuType == 1"
      >
        <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="menuCode"
        v-show="menuForm.menuType == 2"
      >
        <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item
        label="组件路径"
        prop="component"
        v-show="menuForm.menuType == 1"
      >
        <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item
        label="菜单状态"
        prop="menuState"
        v-show="menuForm.menuType == 1"
      >
        <el-radio-group v-model="menuForm.menuState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
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
import { operateMenuApi, getMenuListApi } from '@/api/menu';
import { ElMessageBox, ElMessage } from 'element-plus';
import monment from 'moment';
import { useRouter } from 'vue-router';
const router = useRouter();
const queryForm = ref({
  menuState: 1,
});
const dialogForm = ref(null);
const { ctx } = getCurrentInstance();
const menuList = ref([]);
const showModal = ref(false);
const columns = [
  {
    label: '菜单名称',
    prop: 'menuName',
    width: 150,
  },
  {
    label: '图标',
    prop: 'icon',
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    formatter(row, column, value) {
      return {
        1: '菜单',
        2: '按钮',
      }[value];
    },
  },
  {
    label: '权限标识',
    prop: 'menuCode',
  },
  {
    label: '路由地址',
    prop: 'path',
  },
  {
    label: '组件路径',
    prop: 'component',
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    width: 90,
    formatter(row, column, value) {
      return {
        1: '正常',
        2: '停用',
      }[value];
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
const dialogTitle = ref('菜单新增');
const rules = ref({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 10,
      message: '长度在2-8个字符',
      trigger: 'blur',
    },
  ],
});
const menuForm = ref({
  parentId: [null],
  menuType: 1,
  menuName: '',
  icon: '',
  path: '',
  menuCode: '',
  component: '',
  menuState: 1,
});
const handleQuery = () => {
  getMenuList();
};
const handleReset = (formName) => {
  queryForm.value = {
    menuState: 1,
  };
  getMenuList();
};
const handleCreate = (row) => {
  dialogTitle.value = '菜单新增';
  menuForm.value = {
    parentId: [null],
    menuType: 1,
    menuName: '',
    icon: '',
    path: '',
    menuCode: '',
    component: '',
    menuState: 1,
  };
  if (row && row.parentId[0] !== null) {
    menuForm.value.parentId = [...row.parentId, row._id].map((i) => i);
  }
  showModal.value = true;
};
const handleEdit = (row) => {
  dialogTitle.value = '菜单编辑';
  menuForm.value = row;
  menuForm.value.menuState = Number(row.menuState);
  menuForm.value.menuType = Number(row.menuType);
  showModal.value = true;
};
const handleClose = () => {
  menuForm.value = {
    parentId: [null],
    menuType: 1,
    menuName: '',
    icon: '',
    path: '',
    menuCode: '',
    component: '',
    menuState: 1,
  };
  showModal.value = false;
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
          await operateMenuApi({
            action: 'delete',
            _id,
          });
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          getMenuList();
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
        const { msg } = await operateMenuApi({
          ...menuForm.value,
          action: menuForm.value._id ? 'edit' : 'add',
        });
        ElMessage({
          type: 'success',
          message: msg || '操作成功!',
        });
        handleClose();
        getMenuList();
      } catch (error) {}
    } else {
      return false;
    }
  });
};
const getMenuList = async () => {
  try {
    const { data } = await getMenuListApi({
      ...queryForm.value,
    });
    menuList.value = data.menuList;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getMenuList();
});
</script>
