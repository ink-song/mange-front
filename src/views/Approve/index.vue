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
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
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
            <el-button size="small" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="[1, 2].includes(scope.row.applyState)"
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >作废</el-button
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
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select
            v-model="dialogForm.applyType"
            placeholder="请选择休假类型"
          >
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker
                  v-model="dialogForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  v-model="dialogForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required>
          {{ dialogForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假原因"
            v-model="dialogForm.reasons"
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
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, h } from 'vue';
import { getApproveListApi, operateApproveApi } from '@/api/approve';
import monment from 'moment';
import { ElMessage, ElMessageBox } from 'element-plus';
const showDetailModal = ref(false);
const queryForm = ref({
  applyState: 1,
});

const detail = ref({});

const dialogFormRef = ref(null);
const showModal = ref(false);
const dialogForm = ref({
  applyType: '',
  startTime: '',
  endTime: '',
  leaveTime: '',
  reasons: '',
});

// 表单规则
const rules = ref({
  applyType: [
    {
      required: true,
      message: '请选择休假类型',
      trigger: 'change',
    },
  ],
  startTime: [
    {
      type: 'date',
      required: true,
      message: '请输入开始日期',
      trigger: 'change',
    },
  ],
  endTime: [
    {
      type: 'date',
      required: true,
      message: '请输入结束日期',
      trigger: 'change',
    },
  ],
  reasons: [
    {
      required: true,
      message: '请输入休假原因',
      trigger: ['change', 'blur'],
    },
  ],
});

// 获取休假时长
const handleDateChange = (key, val) => {
  let { startTime, endTime } = dialogForm.value;
  if (!startTime || !endTime) return;
  if (startTime > endTime) {
    ElMessage.error('开始日期不能晚于结束日期');
    dialogForm.value.leaveTime = '0天';
    setTimeout(() => {
      dialogForm.value[key] = '';
    }, 0);
  } else {
    dialogForm.value.leaveTime =
      (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + '天';
  }
};

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
const getTableList = async () => {
  try {
    const { data } = await getApproveListApi({
      ...queryForm.value,
      ...pager.value,
    });
    applyList.value = data.list;
    pager.value.total = data.page.total;
  } catch (error) {
    console.log(error);
  }
};

const clearForm = () => {
  dialogForm.value = {
    applyType: '',
    startTime: '',
    endTime: '',
    leaveTime: '',
    reasons: '',
  };
  dialogFormRef.value?.clearValidate();
};

getTableList();

const handleApply = () => {
  showModal.value = true;
};

const handleClose = () => {
  clearForm();
  showModal.value = false;
};

const handleSubmit = () => {
  dialogFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const { msg } = await operateApproveApi({
          ...dialogForm.value,
          action: dialogForm.value._id ? 'edit' : 'add',
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

const handleDelete = async (_id) => {
  ElMessageBox.confirm(h('p', null, '确认作废该数据吗?'), '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async (action) => {
      if (action === 'confirm') {
        try {
          await operateApproveApi({
            action: 'delete',
            _id,
          });
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
          handleQuery();
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
</script>
