<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="新闻标题" prop="newsTitle">
        <el-input v-model="queryParams.newsTitle" placeholder="请输入新闻标题" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="新闻来源" prop="source">
        <el-input v-model="queryParams.source" placeholder="请输入新闻来源" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="新闻类型" prop="newsType">
        <el-select v-model="queryParams.newsType" placeholder="新闻类型" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.app_news_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="新闻状态" prop="delFlag">
        <el-select v-model="queryParams.showInApp" placeholder="新闻状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.news_show_in_app" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="推送时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['app:news:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['app:news:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 新闻数据表格 -->
    <el-table v-viewer v-loading="loading" :data="newsList" @selection-change="handleSelectionChange" border
      :default-sort="{ prop: 'postTime', order: 'descending' }">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="新闻标识" align="center" prop="newsId" width="150" />
      <el-table-column v-viewer label="新闻封面" align="center" width="150">
        <template slot-scope="scope">
          <!-- :preview-src-list="[scope.row.coverImg]" 开启大图预览 -->
          <el-image style="height: 80px;border-radius: 8px;" lazy :src="scope.row.coverImg" :fit="contain">
            <div slot="placeholder" class="image-slot">
              <i class="el-icon-loading"></i>加载中...
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- <div><img style="max-height: 100px;" :src="scope.row.coverImg" /></div> -->
        </template>
      </el-table-column>
      <el-table-column label="新闻标题" align="center" prop="newsTitle" :show-overflow-tooltip="true" />
      <el-table-column label="摘要" align="center" prop="digest" :show-overflow-tooltip="true" />
      <el-table-column label="新闻类型" align="center" prop="newsType" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.app_news_type" :value="scope.row.newsType" />
        </template></el-table-column>
      <el-table-column label="来源" align="center" prop="source" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="app展示" align="center" prop="showInApp" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showInApp" active-value="1" inactive-value="0"
            @change="handleShowInAppChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="大图展示" align="center" prop="showType" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showType" active-value="1" inactive-value="0"
            @change="handleShowTypeChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="阅读量" align="center" prop="viewNum" :show-overflow-tooltip="true" width="80" />
      <el-table-column label="推送时间" align="center" prop="postTime" sortable width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.postTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.newsId !== 1">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetails(scope.row.newsId)"
            v-hasPermi="['app:news:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['app:news:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['app:news:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="新闻标题" prop="noticeTitle">
              <el-input v-model="form.newsTitle" placeholder="请输入新闻标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新闻类型" prop="noticeType">
              <el-select v-model="form.newsType" placeholder="请选择新闻类型">
                <el-option v-for="dict in dict.type.app_news_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新闻内容">
              <editor v-model="form.newsContent" :min-height="190" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新闻详情 -->
    <el-dialog :title="newsDetails.newsTitle" :data="newsDetails" :visible.sync="openDetails" width="80%" append-to-body>
      <div class="newsDetails">
        <hr />
        <div style="color: gold;text-align: end;">来源 ------ {{ newsDetails.source }}</div>
        <div style="overflow:auto;" v-viewer v-html="newsDetails.newsContent"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNews, newsDetails, changeNewsStatus, changeNewsShowType, delNews, updateNews } from "@/api/app/news";

export default {
  name: "News",
  dicts: ['app_news_type', 'sys_normal_disable', 'news_show_in_app'],
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
      // 新闻表格数据
      newsList: [],
      newsDetails: {},
      contain: "contain",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDetails: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        newsTitle: undefined,
        source: undefined,
        newsType: undefined,
        showInApp: undefined
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询新闻列表 */
    getList() {
      this.loading = true;
      listNews(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.newsList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    // 新闻详情
    handleDetails(newsId) {
      this.loading = true;
      newsDetails(newsId).then(response => {
        this.newsDetails = response.data;
        this.openDetails = true;
        this.loading = false;
      }
      );
    },
    // 新闻状态修改
    handleShowInAppChange(row) {
      let text = row.showInApp === "0" ? "停用" : "展示";
      this.$modal.confirm('确认要"' + text + '""' + row.newsId + '"新闻吗？').then(function () {
        return changeNewsStatus(row.newsId, row.showInApp);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.showInApp = row.showInApp === "0" ? "1" : "0";
      });
    },
    // 新闻大图展示
    handleShowTypeChange(row) {
      let text = row.showType === "1" ? "大图展示" : "默认展示";
      this.$modal.confirm('确认要"' + text + '""' + row.newsId + '"新闻吗？').then(function () {
        return changeNewsShowType(row.newsId, row.showType);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.showType = row.showType === "1" ? "0" : "1";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        newsTitle: undefined,
        source: undefined,
        newsType: undefined,
        showInApp: undefined
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
      this.ids = selection.map(item => item.newsId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const newsId = row.newsId || this.ids
      newsDetails(newsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新闻";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const newsIds = row.newsId || this.ids;
      this.$modal.confirm('是否永久删除编号为【' + newsIds + '】的新闻数据？').then(function () {
        return delNews(newsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateNews(this.form).then(res => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.newsDetails {
  max-height: 80%;
}
</style>
