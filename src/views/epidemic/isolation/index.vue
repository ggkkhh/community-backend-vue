<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="queryParams.telephone" placeholder="请输入联系电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['epidemic:isolation:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['epidemic:isolation:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['epidemic:isolation:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['epidemic:isolation:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-edit" size="mini" @click="handlePolicy"
          v-hasPermi="['epidemic:isolation:edit']">修改隔离政策</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="创建账号" align="center" prop="username" />
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="隔离时长(天)" align="center" prop="isolationTime" />
      <el-table-column label="隔离结束时间" align="center" prop="isolationFinishTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:record:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:record:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改隔离记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户账号" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="隔离时长(天)" prop="isolationTime">
          <el-input-number v-model="form.isolationTime" :min="1" :max="14" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改隔离政策对话框 -->
    <el-dialog :title="title" :visible.sync="openPolicy" width="500px" append-to-body>
      <el-form ref="policyForm" :model="policyForm" :rules="policyRules" label-width="120px">
        <el-form-item label="隔离时长(天)" prop="isolationDay">
          <el-input-number v-model="policyForm.isolationDay" :min="1" :max="14" :precision="0" label="请输入隔离天数" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="policyForm.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPolicyForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord, addRecord, updateRecord, getPolicy, updatePolicy } from "@/api/epidemic/isolation";

export default {
  name: "Record",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 隔离记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示隔离政策弹窗
      openPolicy: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        realName: null,
        telephone: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        realName: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        isolationTime: [
          { required: true, message: "隔离时长不能为空", trigger: "blur" }
        ]
      },
      // 隔离政策
      policyForm: {},
      policyRules: {
        isolationDay: [
          { required: true, message: "隔离时长不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询隔离记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openPolicy = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        username: null,
        realName: null,
        telephone: null,
        isolationTime: null,
        remark: null
      };
      this.resetForm("form");
      this.policyForm = {
        isolationDay: null,
        remark: null
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加隔离记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改隔离记录";
      });
    },
    // 隔离政策操作
    handlePolicy() {
      getPolicy(1).then(response => {
        this.policyForm = response.data;
        this.openPolicy = true;
        this.title = "修改隔离政策";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitPolicyForm() {
      this.$refs["policyForm"].validate(valid => {
        if (valid) {
          updatePolicy(this.policyForm).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.openPolicy = false;
          });
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除隔离记录编号为"' + recordIds + '"的数据项？').then(function () {
        return delRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('epidemic/isolation/export', {
        ...this.queryParams
      }, `隔离记录_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
