<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { cartItemPrice, isAvailableCartItem } from '@/utils/cart'
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const syncing = ref(false)
const syncError = ref(false)
const refreshCart = async () => {
  if (!userStore.userInfo.token) return
  syncing.value = true
  syncError.value = false
  try {
    await cartStore.updateNewList()
  } catch {
    syncError.value = true
  } finally {
    syncing.value = false
  }
}
onMounted(refreshCart)
const delCart = (item) => cartStore.delCart(item.skuId).catch(() => {})
const singleCheck = (i, selected) => cartStore.singleCheck(i.skuId, selected).catch(() => {})
const allCheck = (selected) => cartStore.allCheck(selected).catch(() => {})
const changeCount = (i, count) => cartStore.changeCount(i.skuId, count).catch(() => {})

const checkOut = () => {
  if (syncing.value || syncError.value) return
  if (userStore.userInfo.token) {
    router.push('/checkout')
  } else {
    router.push({ path: '/login', query: { redirect: '/checkout' } })
    ElMessage.warning('请先登录')
  }
}
</script>

<template>
  <div class="xtx-cart-page">
    <div class="container m-top-20">
      <div class="sync-state" v-if="syncing" role="status">正在同步购物车...</div>
      <div class="sync-state" v-else-if="syncError" role="alert">
        购物车同步失败，当前显示的是本地记录 <el-button @click="refreshCart">重试</el-button>
      </div>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <el-checkbox :model-value="cartStore.isAll" :disabled="syncing || syncError || !cartStore.availableItems.length" @change="allCheck" />
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 商品列表 -->
          <tbody>
            <tr v-for="i in cartStore.cartList" :key="i.skuId">
              <td>
                <!-- 单选框 -->
                <el-checkbox :model-value="i.selected" :disabled="syncing || syncError || !isAvailableCartItem(i)" @change="(selected) => singleCheck(i, selected)" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/detail/${i.id}`"><img :src="i.picture" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ i.name }}
                    </p>
                    <p v-if="i.isEffective === false" class="red">商品已失效</p>
                    <p v-else-if="i.stock === 0" class="red">暂时缺货</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ cartItemPrice(i).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <el-input-number :model-value="i.count" :min="1" :max="i.stock ?? 999" :disabled="syncing || syncError || !isAvailableCartItem(i)" @change="(count) => changeCount(i, count)" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ (cartItemPrice(i) * i.count).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <p>
                  <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="delCart(i)">
                    <template #reference>
                      <button class="delete-link" type="button" :disabled="syncing || syncError">删除</button>
                    </template>
                  </el-popconfirm>
                </p>
              </td>
            </tr>
            <tr v-if="cartStore.cartList.length === 0 && !syncing">
              <td colspan="6">
                <div class="cart-none">
                  <el-empty description="购物车列表为空">
                    <el-button type="primary" @click="router.push('/')" >随便逛逛</el-button>
                  </el-empty>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          共 {{ cartStore.allCount }} 件商品，已选择{{ cartStore.selectedCount }}件，商品合计：
          <span class="red">¥ {{ cartStore.selectedPrice.toFixed(2) }} </span>
        </div>
        <div class="total">
          <el-button size="large" type="primary" :disabled="syncing || syncError || cartStore.selectedCount === 0" @click="checkOut">下单结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sync-state {
  min-height: 60px;
  margin-bottom: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
}

.xtx-cart-page {
  margin-top: 20px;

  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }

  .cart-none {
    text-align: center;
    padding: 120px 0;
    background: #fff;

    p {
      color: #999;
      padding: 20px 0;
    }
  }

  .tc {
    text-align: center;

    .delete-link {
      color: $brandPrimary;
      background: none;
      border: 0;
      cursor: pointer;

      &:disabled {
        color: #999;
        cursor: not-allowed;
      }
    }

    .xtx-numbox {
      margin: 0 auto;
      width: 120px;
    }
  }

  .red {
    color: $priceColor;
  }

  .green {
    color: $brandPrimary;
  }

  .f16 {
    font-size: 16px;
  }

  .goods {
    display: flex;
    align-items: center;

    img {
      width: 100px;
      height: 100px;
    }

    >div {
      width: 280px;
      font-size: 16px;
      padding-left: 10px;

      .attr {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;

    .xtx-checkbox {
      color: #999;
    }

    .batch {
      a {
        margin-left: 20px;
      }
    }

    .red {
      font-size: 18px;
      margin-right: 20px;
      font-weight: bold;
    }
  }

  .tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
  }

}
</style>
