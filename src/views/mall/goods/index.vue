<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="商品标题" prop="goodsTitle">
        <el-input v-model="queryParams.goodsTitle" placeholder="请输入商品标题" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="上架状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="商品状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.mall_goods_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['mall:goods:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['mall:goods:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['mall:goods:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 新闻数据表格 -->
    <el-table v-viewer v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange" border
      :default-sort="{ prop: 'updateTime', order: 'descending' }">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="商品名称" prop="goodsTitle" :show-overflow-tooltip="true" align="center" />
      <el-table-column v-viewer label="商品封面" width="150" align="center">
        <template slot-scope="scope">
          <el-image style="height: 80px;border-radius: 8px;" :src="scope.row.goodsImg" :fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDetails" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="单价" prop="goodsPrice" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="库存" prop="stock" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="浏览量" prop="viewNum" width="80" align="center" />
      <el-table-column label="所属用户" prop="nickName,avatar" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
          <img :src="scope.row.avatar">
        </template>
      </el-table-column>
      <el-table-column label="上架/下架" align="center" prop="status" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleShowInAppChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" align="center" prop="updateTime" sortable width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
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
import { listGoods } from "@/api/mall/goods";

export default {
  name: "Goods",
  dicts: ['sys_normal_disable', 'mall_goods_status'],
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
      goodsList: [],
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
        goodsTitle: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listGoods(this.queryParams).then(res => {
        this.goodsList = res.data;
        this.total = res.total;
        this.loading = false;
      }
      );
    },
    // 新闻详情
    handleDetails(newsId) {
      newsDetails(newsId).then(res => {
        this.newsDetails = response.data;
        this.openDetails = true
      }
      );
    },
    // 新闻状态修改
    handleShowInAppChange(row) {
      let text = row.showInApp === 0 ? "停用" : "展示";
      this.$modal.confirm('确认要"' + text + '""' + row.newsId + '"新闻吗？').then(function () {
        return changeNewsStatus(row.newsId, row.showInApp);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.showInApp = row.showInApp === 0 ? 1 : 0;
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
        newsType: undefined,
        newsContent: undefined
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
      newsDetails(row.newsId).then(response => {
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
