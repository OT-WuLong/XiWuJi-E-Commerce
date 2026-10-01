<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCheckInfoAPI, creatOrderAPI } from '@/apis/checkout'
import { useCartStore } from '@/stores/cartStore';
import { ElMessage } from 'element-plus'
import { formatMoney } from '@/utils/money'

const router = useRouter()
const useCart = useCartStore()
const checkInfo = ref({})
const curAddress = ref(null)
const loading = ref(true)
const loadError = ref(false)

const getCheckInfo = async () => {
  loading.value = true
  loadError.value = false
  try {
    const res = await getCheckInfoAPI()
    if (!Array.isArray(res.result?.goods) || !res.result?.summary) throw new Error('结算数据不完整')
    checkInfo.value = res.result
    const addresses = checkInfo.value.userAddresses ?? []
    curAddress.value = addresses.find(item => item.isDefault === 1) ?? addresses[0] ?? null
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

const showDialog = ref(false)
const activeAddress = ref(null)
const switchAddress = (item) => {
  activeAddress.value = item
}
const confirm = () => {
  if (!activeAddress.value) return
  curAddress.value = activeAddress.value
  showDialog.value = false
  activeAddress.value = null
}

const submitting = ref(false)
const creatOrder = async () => {
  if (submitting.value) return
  if (!curAddress.value?.id) {
    ElMessage.warning('请选择收货地址')
    return
  }
  if (!checkInfo.value.goods?.length) {
    ElMessage.warning('没有可结算的商品')
    return
  }
  submitting.value = true
  try {
    const res = await creatOrderAPI({
      deliveryTimeType: 1,
      payType: 1,
      payChannel: 1,
      buyerMessage: '',
      goods: checkInfo.value.goods.map(item => ({
        skuId: item.skuId,
        count: item.count
      })),
      addressId: curAddress.value.id
    })
    await router.push({ path: '/pay', query: { id: res.result.id } })
    useCart.updateNewList().catch(() => {})
  } catch {
    // 请求错误已由 HTTP 拦截器提示
  } finally {
    submitting.value = false
  }
}


onMounted(() => getCheckInfo())
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <div class="checkout-state" v-if="loading" role="status">结算信息加载中...</div>
        <div class="checkout-state" v-else-if="loadError" role="alert">
          结算信息加载失败 <el-button @click="getCheckInfo">重试</el-button>
        </div>
        <template v-else>
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">暂无收货地址，暂时无法提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" :disabled="!checkInfo.userAddresses?.length" @click="activeAddress = curAddress; showDialog = true">切换地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!checkInfo.goods?.length">
                <td colspan="5">
                  <el-empty description="没有可结算的商品，请检查购物车中的勾选及商品状态">
                    <RouterLink to="/cartlist">返回购物车</RouterLink>
                  </el-empty>
                </td>
              </tr>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <div class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </div>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.count }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <span class="my-btn active">不限送货时间：周一至周日</span>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <span class="my-btn active">在线支付</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ formatMoney(checkInfo.summary.totalPrice) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ formatMoney(checkInfo.summary.postFee) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ formatMoney(checkInfo.summary.totalPayPrice) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button @click="creatOrder" :loading="submitting" :disabled="!checkInfo.goods?.length || !curAddress?.id" type="primary" size="large">提交订单</el-button>
        </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showDialog" title="切换收货地址" width="min(560px, 90vw)" center>
    <div class="addressWrapper" role="group" aria-label="收货地址">
      <button type="button" class="text item" :class="{ active: activeAddress?.id === item.id }"
        :aria-pressed="activeAddress?.id === item.id" @click="switchAddress(item)"
        v-for="item in checkInfo.userAddresses" :key="item.id">
        <span class="address-lines">
          <span><span>收<i />货<i />人：</span>{{ item.receiver }}</span>
          <span><span>联系方式：</span>{{ item.contact }}</span>
          <span><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</span>
        </span>
      </button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use 'sass:color';

.checkout-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $brandPrimary;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active {
    border-color: $brandPrimary;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;
    width: 100%;
    background: #fff;
    color: inherit;
    font: inherit;
    text-align: left;

    &:focus-visible {
      outline: 2px solid $brandPrimary;
      outline-offset: 2px;
    }

    &.active,
    &:hover {
      border-color: $brandPrimary;
      background: color.adjust($brandPrimary, $lightness: 50%);
    }

    .address-lines {
      display: block;
      padding: 10px;
      font-size: 14px;
      line-height: 30px;

      >span {
        display: block;
      }
    }
  }
}
</style>
