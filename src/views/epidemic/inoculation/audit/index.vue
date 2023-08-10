<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户账号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="queryParams.telephone" placeholder="请输入联系电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="审核状态" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.audit_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['inoculation:audit:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['inoculation:audit:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['inoculation:audit:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['inoculation:audit:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="auditList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="真实姓名" align="center" prop="realName" :show-overflow-tooltip="true" />
      <el-table-column label="联系电话" align="center" prop="telephone" :show-overflow-tooltip="true" />
      <el-table-column label="身份证号" align="center" prop="idCard" :show-overflow-tooltip="true" />
      <el-table-column label="待审核图片" align="center" prop="auditImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.auditImage" :width="80" :height="120" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.audit_status" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="updateBy" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['inoculation:audit:edit']">审核</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['inoculation:audit:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改疫苗接种审核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核状态" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio v-for="dict in dict.type.audit_status" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAudit, getAudit, delAudit, addAudit, updateAudit } from "@/api/epidemic/inoculation/audit";

export default {
  name: "Audit",
  dicts: ['sys_normal_disable', 'audit_status'],
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
      // 疫苗接种审核表格数据
      auditList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        realName: null,
        telephone: null,
        idCard: null,
        auditStatus: '0',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        telephone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        auditImage: [
          { required: true, message: "待审核图片不能为空", trigger: "blur" }
        ],
        auditStatus: [
          { required: true, message: "审核状态(0待审核1审核通过2审核不通过)不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询疫苗接种审核列表 */
    getList() {
      this.loading = true;
      listAudit(this.queryParams).then(response => {
        this.auditList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        auditId: null,
        userId: null,
        username: null,
        realName: null,
        telephone: null,
        idCard: null,
        auditImage: null,
        auditStatus: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        remark: null
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.auditId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加疫苗接种审核";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const auditId = row.auditId || this.ids
      getAudit(auditId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "疫苗接种审核";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.auditId != null) {
            updateAudit(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAudit(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const auditIds = row.auditId || this.ids;
      this.$modal.confirm('是否确认删除疫苗接种审核编号为"' + auditIds + '"的数据项？').then(function () {
        return delAudit(auditIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('epidemic/inoculation/audit/export', {
        ...this.queryParams
      }, `疫苗接种审核_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
