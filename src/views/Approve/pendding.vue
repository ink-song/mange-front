<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select
            v-model="queryForm.applyState"
            style="width: 150px"
            placeholder="请选择审批状态"
          >
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleDetail(scope.row)"
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
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
    <el-dialog
      title="审核"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-form
        ref="dialogFormRef"
        :model="auditForm"
        label-width="120px"
        label-suffix=":"
        :rules="rules"
      >
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
            v-model="auditForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button @click="handleApprove('refuse')" type="primary"
            >驳回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { getApproveListApi, leaveApproveApi } from '@/api/approve';
import monment from 'moment';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
const store = useStore();
const userInfo = computed(() => {
  return store.getters.userInfo;
});
const queryForm = ref({
  applyState: 1,
});

const detail = ref({});

const showDetailModal = ref(false);
const auditForm = ref({
  remark: '',
});

const dialogFormRef = ref(null);
// 表单规则
const rules = ref({
  remark: [
    {
      required: true,
      message: '请输入审核备注',
      trigger: 'change',
    },
  ],
});

const applyList = ref([]);
const columns = ref([
  {
    label: '单号',
    prop: 'orderNo',
  },
  {
    label: '申请人',
    prop: '',
    formatter(row) {
      return row.applyUser.userName;
    },
  },
  {
    label: '休假时间',
    prop: '',
    formatter(row) {
      return (
        monment(row.startTime).format('YYYY-MM-DD') +
        '到' +
        monment(row.startTime).format('YYYY-MM-DD')
      );
    },
  },
  {
    label: '休假时长',
    prop: 'leaveTime',
  },
  {
    label: '休假类型',
    prop: 'applyType',
    formatter(row, column, value) {
      return {
        1: '事假',
        2: '调休',
        3: '年假',
      }[value];
    },
  },
  {
    label: '休假原因',
    prop: 'reasons',
  },
  {
    label: '申请时间',
    prop: 'createTime',
    width: 180,
    formatter: (row, column, value) => {
      return monment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    label: '审批人',
    prop: 'auditUsers',
  },
  {
    label: '当前审批人',
    prop: 'curAuditUserName',
  },
  {
    label: '审批状态',
    prop: 'applyState',
    formatter: (row, column, value) => {
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
      return {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废',
      }[value];
    },
  },
]);
const pager = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1,
});

const handleReset = (formName) => {
  queryForm.value = {
    menuState: 1,
  };
  getTableList();
};

const handleQuery = () => {
  getTableList();
};
const handleCurrentChange = (val) => {
  pager.value.pageNum = val;
  getTableList();
};
const getTableList = async () => {
  try {
    const { data } = await getApproveListApi({
      ...queryForm.value,
      ...pager.value,
      type: 'approve',
    });
    applyList.value = data.list;
    pager.value.total = data.page.total;
  } catch (error) {
    console.log(error);
  }
};

const clearForm = () => {
  auditForm.value = {
    remark: '',
  };
  dialogFormRef.value?.clearValidate();
};

const handleDetail = (row) => {
  let data = { ...row };
  data.applyTypeName = {
    1: '事假',
    2: '调休',
    3: '年假',
  }[data.applyType];
  data.time =
    monment(data.startTime).format('YYYY-MM-DD') +
    '到' +
    monment(data.startTime).format('YYYY-MM-DD');

  // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
  data.applyStateName = {
    1: '待审批',
    2: '审批中',
    3: '审批拒绝',
    4: '审批通过',
    5: '作废',
  }[data.applyState];
  detail.value = data;
  showDetailModal.value = true;
};

getTableList();

const handleClose = () => {
  clearForm();
};

const handleApprove = (action) => {
  dialogFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const { msg } = await leaveApproveApi({
          remark: auditForm.value.remark,
          _id: detail.value._id,
          action,
        });
        ElMessage({
          type: 'success',
          message: msg || '操作成功!',
        });
        handleClose();
        getTableList();
      } catch (error) {}
    } else {
      return false;
    }
  });
};
</script>
