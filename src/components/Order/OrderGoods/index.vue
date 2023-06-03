<template>
  <div class="order-goods" style="box-sizing: border-box">
    <!-- 待渲染商品数据 -->
    <el-table :data="orderGoodsList" border>
      <el-table-column prop="price" label="订单号" width="140" align="center" fixed> </el-table-column>
      <el-table-column label="商品信息" width="350" fixed>
        <template slot-scope="scope">
          <div class="info_box">
            <div class="info_box_img">
              <img :src="scope.row.img" alt="" />
            </div>
            <div class="info_describe">
              <p class="text">
                <span>{{ scope.row.title }}</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价(元)" align="center" width="90"> </el-table-column>
      <el-table-column prop="num" label="购买数量" align="center" width="80"> </el-table-column>
      <el-table-column prop="total_payment" label="支付金额(元)" align="center" width="140"> </el-table-column>
      <el-table-column prop="name" label="用户名称" align="center" width="110"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center" width="115"> </el-table-column>
      <el-table-column prop="address" label="用户地址" width="160"> </el-table-column>
      <el-table-column prop="create_time" label="下单时间" align="center" width="160"></el-table-column>
      <el-table-column label="订单状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.receive === '0'">已取消</el-tag>
          <el-tag v-if="scope.row.receive === '1'">待付款</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "OrderGoods",
  props: {
    orderGoodsList: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      // pageNum: 1,
      // pageSize: 12,
      // total: 0,
      // title: "",
      // goodsData: {},
    };
  },
  created() {

  },
  methods: {

  },

};
</script>

<style scoped></style>
