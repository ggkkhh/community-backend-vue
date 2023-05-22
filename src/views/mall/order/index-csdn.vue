<template>
  <div class="order-container">
    <el-table v-loading="loading" :data="list" :show-header="false" class="order-table">
      <el-table-column>
        <template v-slot="{ row }">
          <el-row type="flex" align="middle">
            <el-col :span="5">
              订单号：{{ row.no }}
              <el-popover title="支付单号：" :content="row.payOrderId + ''" placement="right" width="200" trigger="click">
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>
            </el-col>
            <el-col :span="5">下单时间：{{ parseTime(row.createTime) }}</el-col>
            <el-col :span="4">订单来源：
              <dict-tag :type="DICT_TYPE.TERMINAL" :value="row.terminal" />
            </el-col>
            <el-col :span="4">支付方式：
              <dict-tag v-if="row.payChannelCode" :type="DICT_TYPE.PAY_CHANNEL_CODE_TYPE" :value="row.payChannelCode" />
              <span v-else>未支付</span>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" @click="goToDetail(row)">详情</el-button>
            </el-col>
          </el-row>
          <!-- 订单下的商品 -->
          <el-table :data="row.items" border :show-header="true">
            <el-table-column label="商品" prop="goods" header-align="center" width="auto" min-width="300">
              <template v-slot="{ row, $index }">
                <div class="goods-info">
                  <img :src="row.picUrl" />
                  <span class="ellipsis-2" :title="row.spuName">{{ row.spuName }}</span>
                  <!-- TODO @小程：下面是商品属性，想当度一行，放在商品名下面 -->
                  <el-tag size="medium" v-for="property in row.properties" :key="property.propertyId">
                    {{ property.propertyName }}：{{ property.valueName }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价(元)/数量" prop="fee" align="center" width="115">
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

    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize"
      layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</template>

<script>
import OrderGoods from "@/components/Order/OrderGoods"
export default {
  name: 'Order',
  components: { OrderGoods },
  data() {
    return {
      tableNewData: [],
      hoverOrderArr: [],
      OrderIndexArr: [],
      tableData: [
        {
          id: '16117282260421',
          total_payment: 2999.0,
          name: '王某某',
          phone: '18523652142',
          address: '黑龙江省 大庆市 萨尔图区 富强街道 大街13号',
          create_time: '2021-01-27 14:17:06',
          status: 1,
          list: [
            {
              price: 999.0,
              num: 1,
              img: 'https://img-tmdetail.alicdn.com/bao/uploaded///img.alicdn.com/bao/uploaded/O1CN01JmWCdR1k3fd9AWtmD_!!0-item_pic.jpg_160x160q90.jpg',
              title: '华为mate40pro 5G手机 亮黑色 8+256G全网通（碎屏险套餐）',
            },
            {
              price: 1000,
              num: 2,
              img: 'https://img-tmdetail.alicdn.com/bao/uploaded///img.alicdn.com/bao/uploaded/O1CN01wfnm311k3fd483OAU_!!0-item_pic.jpg_160x160q90.jpg',
              title: '三星Galaxy Note20 Ultra 5G(SM-N9860)S Pen&三星笔记 120Hz自适应屏幕 5G手机游戏手机 12GB+256GB 初露白',
            }
          ]
        },
        {
          id: '12987123',
          name: '里某某',
          total_payment: 100.0,
          phone: '18523652182',
          address: '海南省 三沙市 中沙群岛 中沙群岛 第一座岛屿',
          create_time: '2020-04-11',
          status: 2,
          list: [
            {
              price: 100.0,
              num: 1,
              img: 'https://img.alicdn.com/imgextra/i2/2502349528/O1CN010GNAOc2KFsLn58vTM_!!2502349528.png',
              title: '2020新款复古小个子温柔风衣中款150cm外套显高显瘦学生中长款秋',
            }
          ]
        }
      ],
      total: 0,
      currentPage: 1, //初始页
      pagesize: 10 //每页的数据
    }
  },
  mounted() {
    this.getNewTableData()
    this.getOrderNumber()
  },

  methods: {
    // 初始页currentPage
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    //表格内容居中显示
    isCenter({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    // 获取相同编号的数组
    getOrderNumber() {
      let OrderObj = {}
      this.tableNewData.forEach((element, index) => {
        element.rowIndex = index
        if (OrderObj[element.id]) {
          OrderObj[element.id].push(index)
        } else {
          OrderObj[element.id] = []
          OrderObj[element.id].push(index)
        }
      })
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k])
        }
      }
      console.log(this.OrderIndexArr, 'OrderIndexArr')
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i]
          for (let j = 0; j < element.length; j++) {
            let item = element[j]
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let arr = this.hoverOrderArr
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return 'hovered-row'
        }
      }
    },
    getNewTableData() {
      this.tableData.map((res) => {
        res.list.map((item) => {
          item.id = res.id
          item.total_payment = res.total_payment
          item.create_time = res.create_time
          item.status = res.status
          item.name = res.name
          item.phone = res.phone
          item.address = res.address
        })
        this.tableNewData.push(res.list)
      })
      this.tableNewData = this.tableNewData.flat()
    }
  },
  created() { }
}
</script>
<style lang="scss" scoped>
.order-container {
  background: #fff;
  width: 100%;
  left: 40px;
  right: 40px;
  padding: 20px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  .info_box {
    display: flex;
    align-items: center;
    margin: 0 10px;

    .info_box_img {
      cursor: pointer;
      width: 50px;
      flex: 0 0 50px;
      margin-right: 6px;

      img {
        width: 50px;
        height: 50px;
      }
    }

    .info_describe {
      .text {
        margin-bottom: 6px;
      }

      .attr {
        color: #9e9e9e;

        span {
          margin-right: 6px;
        }
      }
    }
  }
}

.el-tag {
  width: 100%;
  height: 36px;
  line-height: 36px;
}

.tip-tag {
  .el-tag {
    text-align: center;
  }
}
</style>

