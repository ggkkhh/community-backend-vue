<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
      <el-form-item label="短信服务供应商" prop="providerName">
        <el-input v-model="queryParams.providerName" placeholder="请输入短信服务供应商" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="accessKeyId" prop="accessKeyId">
        <el-input v-model="queryParams.accessKeyId" placeholder="请输入accessKeyId" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="accessKeySecret" prop="accessKeySecret">
        <el-input v-model="queryParams.accessKeySecret" placeholder="请输入accessKeySecret" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['sms:provider:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['sms:provider:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['sms:provider:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['sms:provider:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="providerList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="短信业务主键" align="center" prop="providerId" :show-overflow-tooltip="true" />
      <el-table-column label="短信服务供应商" align="center" prop="providerName" />
      <el-table-column label="服务开始时间" align="center" prop="provideBeginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.provideBeginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务结束时间" align="center" prop="provideEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.provideEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="短信剩余发送量" align="center" prop="residueCount" />
      <el-table-column label="accessKeyId" align="center" prop="accessKeyId" :show-overflow-tooltip="true" />
      <el-table-column label="accessKeySecret" align="center" prop="accessKeySecret" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['sms:provider:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['sms:provider:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改系统短信服务供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="短信服务商" prop="providerName">
              <el-input v-model="form.providerName" placeholder="请输入短信服务供应商" />
            </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="服务开始时间" prop="provideBeginTime">
              <el-date-picker clearable v-model="form.provideBeginTime" type="datetime" placeholder="请选择服务开始时间">
              </el-date-picker>
            </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="服务结束时间" prop="provideEndTime">
              <el-date-picker clearable v-model="form.provideEndTime" type="datetime" placeholder="请选择服务结束时间">
              </el-date-picker>
            </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="短信剩余量" prop="residueCount">
              <el-input-number v-model="form.residueCount" :min="0" :max="99999" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="密钥id" prop="accessKeyId">
              <el-input v-model="form.accessKeyId" placeholder="请输入accessKeyId" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="密钥" prop="accessKeySecret">
              <el-input v-model="form.accessKeySecret" placeholder="请输入accessKeySecret" />
            </el-form-item></el-col>
          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProvider, getProvider, delProvider, addProvider, updateProvider } from "@/api/sms/provider";

export default {
  name: "Provider",
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
      // 系统短信服务供应商表格数据
      providerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        providerName: null,
        provideBeginTime: null,
        provideEndTime: null,
        residueCount: null,
        accessKeyId: null,
        accessKeySecret: null,
      },
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统短信服务供应商列表 */
    getList() {
      this.loading = true;
      listProvider(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.providerList = response.rows;
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
        providerId: null,
        providerName: null,
        provideBeginTime: null,
        provideEndTime: null,
        residueCount: null,
        accessKeyId: null,
        accessKeySecret: null,
        createTime: null,
        createBy: null,
        updateTime: null,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.providerId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加系统短信服务供应商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const providerId = row.providerId || this.ids
      getProvider(providerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统短信服务供应商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.providerId != null) {
            updateProvider(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProvider(this.form).then(response => {
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
      const providerIds = row.providerId || this.ids;
      this.$modal.confirm('是否确认删除系统短信服务供应商编号为"' + providerIds + '"的数据项？').then(function () {
        return delProvider(providerIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sms/provider/export', {
        ...this.queryParams
      }, `provider_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
