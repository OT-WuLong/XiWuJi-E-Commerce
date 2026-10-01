<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getOrderAPI } from '@/apis/pay'
import { useCountDown } from '@/composables/useCountDown'
import { API_BASE_URL } from '@/utils/http'
import { formatMoney } from '@/utils/money'
// 获取订单数据
const route = useRoute()
const router = useRouter()
const payInfo = ref(null)
const loading = ref(true)
const loadError = ref(false)
const missingOrder = ref(false)
const { start, formatTime, remaining } = useCountDown()
let requestId = 0
const getPayInfo = async (id) => {
  const currentRequest = ++requestId
  payInfo.value = null
  loading.value = true
  loadError.value = false
  missingOrder.value = false
  start(0)
  if (typeof id !== 'string' || !id) {
    loading.value = false
    return
  }
  try {
    const res = await getOrderAPI(id)
    if (currentRequest !== requestId) return
    payInfo.value = res.result
    start(res.result.countdown)
  } catch (error) {
    if (currentRequest === requestId) {
      missingOrder.value = String(error.response?.data?.code) === '10004'
      loadError.value = !missingOrder.value
    }
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
watch(() => route.query.id, getPayInfo, { immediate: true })
const canPay = computed(() => payInfo.value?.orderState === 1 && remaining.value > 0)
// 跳转支付
// 携带订单id以及回调地址跳转到支付地址（get）
// 支付地址
const payUrl = computed(() => {
  const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/pay/aliPay`, window.location.origin)
  url.searchParams.set('orderId', route.query.id ?? '')
  url.searchParams.set('redirect', new URL(router.resolve('/payback').href, window.location.origin).href)
  return url.href
})
</script>


<template>
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p v-if="loading" role="status">订单加载中...</p>
          <p v-else-if="loadError" role="alert">订单加载失败 <el-button @click="getPayInfo(route.query.id)">重试</el-button></p>
          <p v-else-if="missingOrder">订单不存在，请到订单页查看</p>
          <p v-else-if="!payInfo">请从订单页选择待付款订单</p>
          <template v-else-if="payInfo">
            <p>{{ canPay ? '订单提交成功！请尽快完成支付。' : '当前订单无法继续支付' }}</p>
            <p v-if="canPay">支付还剩 <span>{{ formatTime }}</span>, 超时后将取消订单</p>
          </template>
        </div>
        <div class="amount" v-if="payInfo">
          <span>应付总额：</span>
          <span>¥{{ formatMoney(payInfo.payMoney) }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type" v-if="canPay">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn alipay" :href="payUrl" aria-label="支付宝支付"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xtx-pay-page {
  margin-top: 20px;
}

.pay-info {

  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;

  .icon {
    font-size: 80px;
    color: $successColor;
  }

  .tip {
    padding-left: 10px;
    flex: 1;

    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }

      &:last-child {
        color: $priceColor;
        font-size: 20px;
      }
    }
  }
}

.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: $brandPrimary;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }

  }
}
</style>
