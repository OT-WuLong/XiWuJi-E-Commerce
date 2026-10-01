<script setup>
import { getOrderAPI } from '@/apis/pay'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isPaidOrderState } from '@/utils/order'
import { formatMoney } from '@/utils/money'

const route = useRoute()
const orderInfo = ref(null)
const loading = ref(true)
let requestId = 0

const getOrderInfo = async (id) => {
  const currentRequest = ++requestId
  orderInfo.value = null
  loading.value = true
  if (typeof id !== 'string' || !id) {
    loading.value = false
    return
  }
  try {
    const res = await getOrderAPI(id)
    if (currentRequest === requestId) orderInfo.value = res.result
  } catch {
    // 请求错误已由 HTTP 拦截器提示
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
watch(() => route.query.orderId, getOrderInfo, { immediate: true })

const paid = computed(() => isPaidOrderState(orderInfo.value?.orderState))
const resultText = computed(() => {
  if (loading.value) return '正在核对支付结果'
  if (!orderInfo.value) return '暂时无法确认支付结果'
  if (paid.value) return '支付成功'
  if (orderInfo.value.orderState === 1) return '订单待付款'
  if (orderInfo.value.orderState === 6) return '订单已取消'
  return '订单状态未知'
})

</script>


<template>
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 支付结果 -->
      <div class="pay-result">
        <span class="iconfont icon-queren2 green" v-if="paid"></span>
        <span class="iconfont icon-shanchu red" v-else-if="orderInfo?.orderState === 6"></span>
        <span class="iconfont icon-tip muted" v-else-if="!loading"></span>
        <p class="tit">{{ resultText }}</p>
        <p class="tip" v-if="paid">订单支付状态已确认，请到订单页查看最新进度</p>
        <p v-if="orderInfo">订单金额：<span>¥{{ formatMoney(orderInfo.payMoney) }}</span></p>
        <div class="btn">
          <el-button type="primary" style="margin-right:20px" @click="$router.push('/member/order')">查看订单</el-button>
          <el-button @click="$router.push('/')">进入首页</el-button>
          <el-button v-if="!loading && !paid && route.query.orderId" @click="getOrderInfo(route.query.orderId)">刷新支付状态</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pay-result {
  padding: 100px 0;
  background: #fff;
  text-align: center;
  margin-top: 20px;

  >.iconfont {
    font-size: 100px;
  }

  .green {
    color: #1dc779;
  }

  .red {
    color: $priceColor;
  }

  .muted {
    color: #999;
  }

  .tit {
    font-size: 24px;
  }

  .tip {
    color: #999;
  }

  p {
    line-height: 40px;
    font-size: 16px;
  }

  .btn {
    margin-top: 50px;
  }

}
</style>
