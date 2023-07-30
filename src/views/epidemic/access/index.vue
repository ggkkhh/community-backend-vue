<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <!-- realName: null,
        telephone: null,
        accessType: null,
        reportType: null, -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="queryParams.telephone" placeholder="请输入电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="进出类型" prop="accessType">
        <el-select v-model="queryParams.accessType" placeholder="进出类型" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.access_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="报备类型" prop="reportType">
        <el-select v-model="queryParams.reportType" placeholder="报备类型" clearable style="width: 200px">
          <el-option v-for="dict in dict.type.access_report_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 增删查改操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['epidemic:access:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['epidemic:access:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['epidemic:access:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['epidemic:access:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户账号" align="center" prop="username" />
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="进出类型" align="center" prop="accessType" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.access_type" :value="scope.row.accessType" />
        </template>
      </el-table-column>
      <el-table-column label="报备类型" align="center" prop="reportType" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.access_report_type" :value="scope.row.reportType" />
        </template>
      </el-table-column>
      <el-table-column label="出发地" align="center" prop="placeStart" :show-overflow-tooltip="true" />
      <el-table-column label="目的地" align="center" prop="placeEnd" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建人" align="center" prop="createBy" width="160" />
      <el-table-column label="修改人" align="center" prop="updateBy" width="160" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['epidemic:access:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['epidemic:access:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改出入社区人员记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="进出类型" prop="accessType">
              <el-select v-model="form.accessType" placeholder="请选择进出类型">
                <el-option v-for="dict in dict.type.access_type" :key="dict.value" :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报备类型" prop="reportType">
              <el-select v-model="form.reportType" placeholder="请选择报备类型">
                <el-option v-for="dict in dict.type.access_report_type" :key="dict.value" :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出发地" prop="placeStart">
          <el-input v-model="form.placeStart" placeholder="请输入出发地" />
        </el-form-item>
        <el-form-item label="目的地" prop="placeEnd">
          <el-input v-model="form.placeEnd" placeholder="请输入目的地" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/epidemic/access";

export default {
  name: "Access",
  dicts: ['sys_normal_disable', 'access_type', 'access_report_type'],
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
      // 出入社区人员记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: null,
        telephone: null,
        accessType: null,
        reportType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        realName: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '真实姓名长度必须介于 2 和 10 之间', trigger: 'blur' }
        ],
        telephone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"
          }
        ],
        accessType: [
          { required: true, message: "进出类型不能为空", trigger: "change" }
        ],
        reportType: [
          { required: true, message: "报备类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询出入社区人员记录列表 */
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        recordId: null,
        realName: null,
        telephone: null,
        accessType: '0',
        reportType: '1',
        placeStart: null,
        placeEnd: null,
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
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出入社区人员记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出入社区人员记录";
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除出入社区人员记录编号为"' + recordIds + '"的数据项？').then(function () {
        return delRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('epidemic/access/export', {
        ...this.queryParams
      }, `record_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
