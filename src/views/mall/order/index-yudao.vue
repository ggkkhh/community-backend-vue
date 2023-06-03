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
    <!-- <el-table v-viewer v-loading="loading" :data="orderList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="订单号" prop="orderId" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="商品信息" width="350" fixed>
        <template slot-scope="scope">
          <div class="info_box">
            <div class="info_box_img">
              <img :src="scope.row.goodsImg" alt="" />
            </div>
            <div class="info_describe">
              <p class="text">
                <span>{{ scope.row.goodsTitle }}</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="userName" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="总价" prop="totalPrice" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="支付状态" align="center" prop="payStatus" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mall_order_pay_status" :value="scope.row.payStatus" />
        </template>
      </el-table-column>
      <el-table-column label="收货地址" prop="mallUserAddress.completeAddress" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.newsId !== 1">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetails(scope.row.orderId)"
            v-hasPermi="['mall:order:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['mall:order:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['mall:order:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-card>
      <el-table v-loading="loading" :data="orderList" :show-header="false" class="order-table">
        <el-table-column>
          <template v-slot="{ row }">
            <el-row type="flex" align="middle">
              <el-col :span="5">
                订单号：{{ row.orderId }}
                <el-popover title="支付单号：" :content="row.orderId" placement="right" width="200" trigger="click">
                  <el-button slot="reference" type="text">更多</el-button>
                </el-popover>
              </el-col>
              <el-col :span="5">下单时间：{{ parseTime(row.createTime) }}</el-col>
              <el-col :span="4">支付状态：{{ row.payStatus }}
              </el-col>
              <el-col :span="6" align="right">
                <el-button type="text" @click="goToDetail(row)">详情</el-button>
              </el-col>
            </el-row>
            <!-- 订单下的商品 -->
            <el-table :data="row.mallOrderGoodsVOList" border :show-header="true">
              <el-table-column label="商品" prop="mallGoods" header-align="center" width="auto" min-width="300">
                <template v-slot="{ row, $index }">
                  <div class="goods-info">
                    <img :src="row.goodsImg" />
                    <span class="ellipsis-2" :title="row.goodsTitle">{{ row.goodsTitle }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价(元)/数量" prop="goodsPrice" align="center" width="115">
                <template v-slot="{ row }">
                  <div>￥{{ (row.originalUnitPrice / 100.0).toFixed(2) }}</div>
                  <div>{{ row.count }} 件</div>
                </template>
              </el-table-column>
              <!-- TODO @小程：这里应该是一个订单下，多个商品，只展示订单上的总金额，就是 order.payPrice -->
              <el-table-column label="实付金额(元)" prop="amount" align="center" width="100" />
              <!-- TODO @小程：这里应该是一个订单下，多个商品，只展示订单上的收件信息；使用 order.receiverXXX 开头的字段 -->
              <el-table-column label="买家/收货人" prop="buyer" header-align="center" width="auto" min-width="300">
                <template v-slot="{ row }">
                  <!-- TODO @芋艿：以后增加一个会员详情界面 -->
                  <div>{{ row.buyer }}</div>
                  <div>{{ row.receiver }}{{ row.tel }}</div>
                  <div class="ellipsis-2" :title="row.address">{{ row.address }}</div>
                </template>
              </el-table-column>
              <!-- TODO @小程：这里应该是一个订单下，多个商品，交易状态是统一的；使用 order.status 字段 -->
              <el-table-column label="交易状态" prop="status" align="center" width="100" />
            </el-table>
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
  dicts: ['sys_normal_disable', 'mall_order_pay_status'],
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
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(res => {
        this.orderList = res.data;
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

<style lang="scss" scoped></style>
