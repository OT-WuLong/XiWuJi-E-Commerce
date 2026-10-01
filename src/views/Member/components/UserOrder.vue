<script setup>
import { getUserOrder } from '@/apis/order'
import { onMounted, ref } from 'vue'
import { formatMoney } from '@/utils/money'
// tab列表
const tabTypes = [
  { name: '0', label: '全部订单' },
  { name: '1', label: '待付款' },
  { name: '2', label: '待发货' },
  { name: '3', label: '待收货' },
  { name: '4', label: '待评价' },
  { name: '5', label: '已完成' },
  { name: '6', label: '已取消' }
]
// 获取订单列表
const orderList = ref([])
const total = ref(0)
const loading = ref(false)
const loadError = ref(false)
const params = ref({
  orderState: 0,
  page: 1,
  pageSize: 10
})
let requestId = 0
const getOrderList = async () => {
  const currentRequest = ++requestId
  loading.value = true
  loadError.value = false
  try {
    const res = await getUserOrder(params.value)
    if (currentRequest !== requestId) return
    orderList.value = res.result.items
    total.value = res.result.counts
  } catch {
    if (currentRequest === requestId) {
      orderList.value = []
      total.value = 0
      loadError.value = true
    }
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

onMounted(() => getOrderList())

// tab切换
const tabChange = (type) => {
  params.value.orderState = Number(type)
  params.value.page = 1
  orderList.value = []
  total.value = 0
  getOrderList()
}

// 页数切换
const pageChange = (page) => {
  params.value.page = page
  getOrderList()
}


const stateMap = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
}
const formatPayState = (payState) => stateMap[payState] ?? '未知状态'
</script>

<template>
  <div class="order-container">
    <el-tabs @tab-change="tabChange">
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :name="item.name" :label="item.label" />

      <div class="main-container">
        <div class="holder-container" v-if="loading">正在加载订单...</div>
        <div class="holder-container" v-else-if="loadError">
          <el-empty description="订单加载失败">
            <el-button @click="getOrderList">重试</el-button>
          </el-empty>
        </div>
        <div class="holder-container" v-else-if="orderList.length === 0">
          <el-empty description="暂无订单数据" />
        </div>
        <div v-else>
          <!-- 订单列表 -->
          <div class="order-item" v-for="order in orderList" :key="order.id">
            <div class="head">
              <span>下单时间：{{ order.createTime }}</span>
              <span>订单编号：{{ order.id }}</span>
            </div>
            <div class="body">
              <div class="column goods">
                <ul>
                  <li v-for="item in order.skus" :key="item.id">
                    <div class="image">
                      <img :src="item.image" alt="" />
                    </div>
                    <div class="info">
                      <p class="name ellipsis-2">
                        {{ item.name }}
                      </p>
                      <p class="attr ellipsis">
                        <span>{{ item.attrsText }}</span>
                      </p>
                    </div>
                    <div class="price">¥{{ formatMoney(item.realPay) }}</div>
                    <div class="count">x{{ item.quantity }}</div>
                  </li>
                </ul>
              </div>
              <div class="column state">
                <p>{{ formatPayState(order.orderState) }}</p>
              </div>
              <div class="column amount">
                <p class="red">¥{{ formatMoney(order.payMoney) }}</p>
                <p>（含运费：¥{{ formatMoney(order.postFee) }}）</p>
                <p>在线支付</p>
              </div>
              <div class="column action">
                <el-button v-if="order.orderState === 1" type="primary" size="small" @click="$router.push({ path: '/pay', query: { id: order.id } })">
                  立即付款
                </el-button>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <div class="pagination-container" v-if="total > params.pageSize">
            <el-pagination :total="total" :current-page="params.page" @current-change="pageChange" :page-size="params.pageSize" background
              layout="prev, pager, next" />
          </div>
        </div>
      </div>

    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: $brandPrimary;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: $priceColor;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: $brandPrimary;
          }
        }
      }
    }
  }
}
</style>
