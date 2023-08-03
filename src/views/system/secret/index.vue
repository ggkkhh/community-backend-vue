<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="密钥名称" prop="secretName">
        <el-input v-model="queryParams.secretName" placeholder="请输入密钥名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="密钥关键字" prop="secretKey">
        <el-input v-model="queryParams.secretKey" placeholder="请输入密钥关键字" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:secret:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:secret:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:secret:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:secret:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="secretList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="密钥主键" align="center" prop="secretId" />
      <el-table-column label="密钥名称" align="center" prop="secretName" :show-overflow-tooltip="true" />
      <el-table-column label="密钥关键字" align="center" prop="secretKey" />
      <el-table-column label="密钥键名" align="center" prop="keyId" :show-overflow-tooltip="true" />
      <el-table-column label="密钥键值" align="center" prop="keySecret" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:secret:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:secret:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改密钥对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="密钥名称" prop="secretName">
          <el-input v-model="form.secretName" placeholder="请输入密钥名称" />
        </el-form-item>
        <el-form-item label="密钥键名" prop="keyId">
          <el-input v-model="form.keyId" placeholder="请输入密钥键名" />
        </el-form-item>
        <el-form-item label="密钥关键字" prop="secretKey">
          <el-input v-model="form.secretKey" placeholder="请输入密钥关键字" />
        </el-form-item>
        <el-form-item label="密钥键值" prop="keySecret">
          <el-input v-model="form.keySecret" placeholder="请输入密钥键值" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listSecret, getSecret, delSecret, addSecret, updateSecret } from "@/api/system/secret";

export default {
  name: "Secret",
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
      // 密钥表格数据
      secretList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        secretName: null,
        secretKey: null,
      },
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
    /** 查询密钥列表 */
    getList() {
      this.loading = true;
      listSecret(this.queryParams).then(response => {
        this.secretList = response.rows;
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
        secretId: null,
        secretName: null,
        secretKey: null,
        keyId: null,
        keySecret: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map(item => item.secretId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加密钥";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const secretId = row.secretId || this.ids
      getSecret(secretId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改密钥";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.secretId != null) {
            updateSecret(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSecret(this.form).then(response => {
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
      const secretIds = row.secretId || this.ids;
      this.$modal.confirm('是否确认删除密钥编号为"' + secretIds + '"的数据项？').then(function () {
        return delSecret(secretIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/secret/export', {
        ...this.queryParams
      }, `secret_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
