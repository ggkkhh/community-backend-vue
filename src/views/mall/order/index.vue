<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户账号" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户账号" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="订单状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.mall_order_pay_status" :key="dict.value" :label="dict.label"
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
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['mall:order:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['mall:order:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 订单数据表格-->
    <el-card v-for="ol in orderList" :key="ol.orderId" shadow="hover">
      <!-- 订单号等信息 -->
      <div slot="header" class="clearfix orderInfo">
        <el-row type="flex" align="middle" justify="center">
          <el-col :lg="4" :xs="24">
            <div> 订单号：<el-tag>{{ ol.orderId }}</el-tag></div>
          </el-col>
          <el-col :lg="4" :xs="24">
            <div>下单用户：<el-tag>{{ ol.userName }}</el-tag></div>
          </el-col>
          <el-col :lg="6" :xs="24">
            <div>下单时间：<el-tag>{{ parseTime(ol.createTime) }}</el-tag></div>
          </el-col>
          <el-col :lg="4" :xs="24">
            <div>总价：<el-tag>{{ ol.totalPrice + '￥' }}</el-tag></div>
          </el-col>
          <el-col :lg="2" :xs="24">
            <div><dict-tag :options="dict.type.mall_order_pay_status" :value="ol.payStatus" /></div>
          </el-col>
          <el-col :lg="6" :xs="24">
            <div>
              <el-popover title="支付单号：" :content="ol.orderId" placement="top" trigger="hover">
                <el-button slot="reference" size="mini" round icon="el-icon-edit">支付单号</el-button>
              </el-popover>
              <el-button size="mini" round type="primary" icon="el-icon-view" @click="handleDetails(ol.orderId)"
                v-hasPermi="['app:news:query']">详情</el-button>
              <el-button size="mini" round icon="el-icon-edit" @click="handleNoticePay(ol.userId)"
                v-hasPermi="['app:news:edit']">提醒支付</el-button>

              <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['app:news:remove']">删除</el-button> -->
            </div>
          </el-col>

          <!-- <span>发货状态：</span><strong>{{ o.status }}</strong> -->
          <!-- <strong style="float: right">{{ "￥" + o.totalPrice }}</strong><span style="float: right">订单总金额：</span> -->
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </el-row>
      </div>
      <!-- 收货地址 -->
      <div slot="header" class="clearfix mallUserAddress">
        <el-row type="flex" align="middle" justify="center">
          <el-col :lg="4" :xs="24">
            <div>收货人<el-tag>{{ ol.mallUserAddress.nickname }}</el-tag></div>
          </el-col>
          <el-col :lg="4" :xs="24">
            <div>联系方式：<el-tag>{{ ol.mallUserAddress.telephone }}</el-tag></div>
          </el-col>
          <el-col :lg="16" :xs="24">
            <div>收货地址：<el-tag>{{ ol.mallUserAddress.provinceCode + ol.mallUserAddress.cityCode +
              ol.mallUserAddress.regionCode + ol.mallUserAddress.completeAddress }}</el-tag></div>
          </el-col>
        </el-row>
      </div>
      <!-- 商品表格 -->
      <el-table v-loading="loading" :data="ol.mallOrderGoodsVOList" class="goods-table" border>
        <el-table-column v-viewer label="商品封面" width="150" align="center">
          <template slot-scope="scope">
            <el-image style="height: 80px;border-radius: 8px;" :src="scope.row.mallGoods.goodsImg"
              :fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="mallGoods.goodsTitle" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="卖家" prop="mallGoods.userId" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="单价" prop="price" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="数量" prop="count" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="总价" prop="totalPrice" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="收货状态" prop="receive" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.mall_order_goods_receive" :value="scope.row.receive" />
          </template>
        </el-table-column>
      </el-table>

    </el-card>
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
import { listOrder } from "@/api/mall/order";

export default {
  name: "Goods",
  dicts: ['sys_normal_disable', 'mall_order_pay_status', 'mall_order_goods_receive'],
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
      // 订单表格数据
      orderList: [],
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
        userName: undefined,
        payStatus: undefined
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(res => {
        this.orderList = res.data;
        this.total = res.total;
        this.loading = false;
      }
      );
    },
    // 详情
    handleDetails(newsId) {
      newsDetails(newsId).then(res => {
        this.newsDetails = response.data;
        this.openDetails = true
      }
      );
    },
    // 状态修改
    handleShowInAppChange(row) {
      let text = row.showInApp === 0 ? "停用" : "展示";
      this.$modal.confirm('确认要"' + text + '""' + row.newsId + '"吗？').then(function () {
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

<style lang="scss" scoped></style>
