<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="queryParams.noticeTitle" placeholder="请输入标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="showInApp">
        <el-select v-model="queryParams.showInApp" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.show_in_app" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['app:notice:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['app:notice:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['app:notice:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="公告ID" align="center" prop="noticeId" />
      <el-table-column v-viewer label="图片地址" align="center" width="150">
        <template slot-scope="scope">
          <el-image style="height: 80px;border-radius: 10px;" :src="scope.row.noticeImgUrl" :fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="noticeTitle" />
      <el-table-column label="移动端展示" align="center" prop="showInApp" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showInApp" active-value="1" inactive-value="0"
            @change="handleShowInAppChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['app:notice:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['app:notice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改app端图文轮播图公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="noticeImgUrl">
          <el-tooltip placement="top">
            <div slot="content">点击上传</div>
            <el-upload style="text-align: center; padding: 10px;border: 2px solid gray;border-radius: 10px;"
              class="img-uploader" name="appNoticeFile" :headers="headers" :action="uploadUrl" :show-file-list="false"
              :on-success="handleUploadSuccess">
              <img v-if="form.noticeImgUrl" :src="form.noticeImgUrl" class="img" />
              <i v-else class="el-icon-plus img-uploader-icon"></i> </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="状态" prop="showInApp">
          <el-radio-group v-model="form.showInApp">
            <el-radio v-for="dict in dict.type.show_in_app" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
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
import { getToken } from "@/utils/auth";
import { listAppNotice, getAppNotice, delAppNotice, addAppNotice, updateAppNotice, changeStatus } from "@/api/app/notice";

export default {
  name: "Notice",
  dicts: ['sys_normal_disable', 'show_in_app'],
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/app/notice/uploadImg",
      headers: {
        Authorization: "Bearer " + getToken()
      },
      contain: "contain",
      fileSize: 20,
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
      // app端图文轮播图公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: null,
        showInApp: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        noticeImgUrl: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询app端图文轮播图公告列表 */
    getList() {
      this.loading = true;
      listAppNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        // console.log(this.noticeList);
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
        noticeId: null,
        noticeTitle: null,
        noticeImgUrl: null,
        showInApp: '0',
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
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加图文轮播图公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getAppNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改图文轮播图公告";
      });
    },
    // 新闻状态修改
    handleShowInAppChange(row) {
      let text = row.showInApp === "0" ? "停用" : "展示";
      this.$modal.confirm('确认要"' + text + '""' + row.noticeId + '"吗？').then(function () {
        return changeStatus(row.noticeId, row.showInApp);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.showInApp = row.showInApp === "0" ? "1" : "0";
      });
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 上传图片
    handleUploadSuccess(res, file) {
      if (res.code == 200) {
        this.form.noticeImgUrl = res.imgUrl;
      } else {
        this.$message.error("图片上传失败");
      }
    },
    handleUploadError() {
      this.$message.error("图片上传失败");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != null) {
            updateAppNotice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAppNotice(this.form).then(response => {
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
      const noticeIds = row.noticeId || this.ids;
      this.$modal.confirm('是否确认删除app端图文轮播图公告编号为"' + noticeIds + '"的数据项？').then(function () {
        return delAppNotice(noticeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    }
  }
};
</script>

<style scoped>

.img {
  width: 100%;
  height: 100%;
  max-height: 300px;
  display: block;
  border-radius: 10px;
}
</style>
