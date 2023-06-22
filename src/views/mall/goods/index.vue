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

    <!-- 数据表格 -->
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
      <el-table-column label="商家" prop="nickName,avatar" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: center;">
            <img class="img-wh-64  img-circle" :src="scope.row.avatar">
            <span class="span-lh-64">{{ scope.row.nickName }}</span>
          </div>
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
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetails(scope.row.goodsId)"
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
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="goodsTitle">
          <el-input v-model="form.goodsTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="goodsImg">
          <el-tooltip placement="top">
            <div slot="content">点击上传</div>
            <el-upload style="text-align: center; padding: 10px;border: 2px solid gray;border-radius: 10px;"
              class="img-uploader" name="file" :headers="headers" :action="uploadUrl" :show-file-list="false"
              :on-success="handleUploadSuccess">
              <img v-if="form.goodsImg" :src="form.goodsImg" class="form-img" />
              <i v-else class="el-icon-plus img-uploader-icon"></i> </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDetails">
          <el-input v-model="form.goodsDetails" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="form.goodsPrice" placeholder="请输入商品价格" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="form.stock" placeholder="请输入库存" />
            </el-form-item></el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <!-- <el-dialog :title="goodsDetails.goodsTitle" :data="goodsDetails" :visible.sync="openDetails" width="80%"
      append-to-body>
      <div class="goods-details">
        <hr />
        <div style="color: gold;text-align: end;">来源 ------ {{ goodsDetails.goodsTitle }}</div>
        <div style="overflow:auto;" v-viewer v-html="goodsDetails.goodsPrice"></div>
      </div>
    </el-dialog> -->
    <!-- 详情（抽屉样式） -->
    <el-drawer title="商品详情" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <div class="goods-details">
        <div class="pd-tb-10" style="font-size: 1.5em;font-weight: bold;">{{ goodsDetails.goodsTitle }}
        </div>
        <div class="pd-tb-10" style="text-align: center;" v-viewer><img
            style="width:auto;max-height: 300px;border-radius: 10px;" :src="goodsDetails.goodsImg"></div>
        <div class="pd-tb-10">{{ goodsDetails.goodsDetails }}</div>
        <div class="pd-tb-10" style="color: red;font-size: 1.2em;font-weight: bold;"> 价格：{{ '￥' + goodsDetails.goodsPrice
        }}</div>
        <div class="pd-tb-10">库存：{{ goodsDetails.stock }}</div>
        <div class="pd-tb-10">浏览量：{{ goodsDetails.viewNum }}</div>
        <!-- 商家 -->
        <div class="pd-tb-10">卖家：</div>
        <div class="pd-tb-10"
          style="text-align: center;display: flex;background: gray;padding: 20px;border-radius: 10px;">
          <img style="width: 64px;height:  64px;border-radius: 32px;" :src="goodsDetails.avatar">
          <span style="line-height: 64px;padding:0 10px;">{{ goodsDetails.nickName }}</span>
        </div>
      </div>

    </el-drawer>

  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { listGoods, addGoods, goodsDetails, updateGoods, delGoods, changeGoodsStatus } from "@/api/mall/goods";

export default {
  name: "Goods",
  dicts: ['sys_normal_disable', 'mall_goods_status'],
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/app/mallGoods/uploadImg",
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
      // 表格数据
      goodsList: [],
      goodsDetails: {},
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
      // 表单校验
      rules: {
        goodsTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        goodsImg: [
          { required: true, message: "封面不能为空", trigger: "blur" }
        ],
        goodsPrice: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ]
        ,
        stock: [
          { required: true, message: "库存不能为空", trigger: "blur" }
        ]
      },
      goodsImg: "",
      // 抽屉
      drawer: false,
      // 从右往左开，ltr>从左往右开，ttb>从上往下开，btt>从下往上开
      direction: 'rtl',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品";
    },
    // 详情
    handleDetails(goodsId) {
      goodsDetails(goodsId).then(res => {
        this.drawer = true
        this.goodsDetails = res.data;
        // this.openDetails = true
      }
      );
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
        goodsTitle: null,
        goodsImg: null,
        goodsDetails: null,
        goodsPrice: null,
        stock: null,
        status: null,
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
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      goodsDetails(row.goodsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const goodsIds = row.goodsId || this.ids;
      this.$modal.confirm('是否永久删除编号为【' + goodsIds + '】的商品？').then(function () {
        return delGoods(goodsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 状态修改
    handleShowInAppChange(row) {
      let text = row.status === "0" ? "上架" : "下架";
      this.$modal.confirm('确认要"' + text + '""' + row.goodsId + '"吗？').then(function () {
        return changeGoodsStatus(row.goodsId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
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
        this.form.goodsImg = res.imgUrl;
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
          if (this.form.goodsId != null) {
            updateGoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoods(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.form-img {
  width: 100%;
  height: 100%;
  max-height: 300px;
  display: block;
  border-radius: 10px;
}
</style>
