<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getDetail } from '@/apis/detail'
import DetailHot from './components/DetailHot.vue'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cartStore.js'

const route = useRoute()
const cartStore = useCartStore()
const goods = ref({})
const skuObj = ref({})
let requestId = 0
const count = ref(1)
const adding = ref(false)
const loading = ref(true)
const loadError = ref(false)

const getGoods = async (id) => {
  const currentRequest = ++requestId
  goods.value = {}
  skuObj.value = {}
  count.value = 1
  loading.value = true
  loadError.value = false
  try {
    const res = await getDetail(id)
    if (currentRequest === requestId) goods.value = res.result
  } catch (error) {
    if (currentRequest === requestId) loadError.value = String(error.response?.data?.code) !== '10004'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
watch(() => route.params.id, getGoods, { immediate: true })

const skuChange = (sku) => {
  skuObj.value = sku
  if (sku.inventory && count.value > sku.inventory) count.value = sku.inventory
}

const currentPrice = computed(() => skuObj.value.price ?? goods.value.price)
const originalPrice = computed(() => skuObj.value.oldPrice ?? goods.value.oldPrice)
const addCart = async () => {
  if (!skuObj.value.skuId) {
    ElMessage.warning('请选规格')
    return
  }
  if (adding.value) return
  adding.value = true
  try {
    await cartStore.addCart({
      id: goods.value.id,
      name: goods.value.name,
      picture: goods.value.mainPictures[0],
      price: currentPrice.value,
      stock: skuObj.value.inventory,
      count: count.value,
      skuId: skuObj.value.skuId,
      attrsText: skuObj.value.specsText,
      selected: true,
    })
    ElMessage.success('加入成功')
  } catch (error) {
    if (error instanceof RangeError) ElMessage.warning(error.message)
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div class="xtx-goods-page">
    <div class="container page-state" v-if="loading" role="status">商品加载中...</div>
    <div class="container page-state" v-else-if="loadError" role="alert">
      商品加载失败 <el-button @click="getGoods(route.params.id)">重试</el-button>
    </div>
    <div class="container" v-else-if="goods.details">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <!--
                错误原因：goods一开始{}  {}.categories -> undefined  -> undefined[1]
                1. 可选链的语法?.
                2. v-if手动控制渲染时机 保证只有数据存在才渲染
            -->
          <el-breadcrumb-item v-if="goods.categories?.[1]" :to="{ path: `/category/${goods.categories[1].id}` }">{{ goods.categories[1].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="goods.categories?.[0]" :to="{ path: `/category/sub/${goods.categories[0].id}` }">{{
            goods.categories[0].name
          }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ goods.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息 -->
      <div class="info-container">
        <div>
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
              <XtxImgView :image-list="goods.mainPictures"/>
              <!-- 统计数量 -->
              <ul class="goods-sales">
                <li>
                  <p>销量</p>
                  <p>{{ goods.salesCount ?? 0 }}</p>
                </li>
                <li>
                  <p>商品评价</p>
                  <p>{{ goods.commentCount ?? 0 }}</p>
                </li>
                <li>
                  <p>收藏人数</p>
                  <p>{{ goods.collectCount ?? 0 }}</p>
                </li>
                <li>
                  <p>品牌</p>
                  <p>{{ goods.brand?.name || '暂无' }}</p>
                </li>
              </ul>
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name"> {{ goods.name }} </p>
              <p class="g-desc">{{ goods.desc }} </p>
              <p class="g-price">
                <span class="current">{{ currentPrice }}</span>
                <span class="original" v-if="Number(originalPrice) > Number(currentPrice)">{{ originalPrice }}</span>
              </p>
              <!-- sku组件 -->
              <XtxSku :goods="goods" @change="skuChange"/>
              <!-- 数据组件 -->
              <el-input-number v-model="count" :min="1" :max="skuObj.inventory || 999"></el-input-number>
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" :loading="adding" @click="addCart">
                  加入购物车
                </el-button>
              </div>

            </div>
          </div>
          <div class="goods-footer">
            <div class="goods-article">
              <!-- 商品详情 -->
              <div class="goods-tabs">
                <nav>
                  <h2>商品详情</h2>
                </nav>
                <div class="goods-detail">
                  <!-- 属性 -->
                  <ul class="attrs">
                    <li v-for="item in goods.details.properties" :key="item.value">
                      <span class="dt">{{ item.name }}</span>
                      <span class="dd">{{ item.value }}</span>
                    </li>
                  </ul>
                  <!-- 图片 -->
                  <img v-for="(img, index) in goods.details.pictures" :key="img" :src="img" :alt="`${goods.name}详情图${index + 1}`" />
                </div>
              </div>
            </div>
            <!-- 24热榜+专题推荐 -->
            <div class="goods-aside">
              <!-- 24小时 -->
              <DetailHot :hot-type="1"/>
              <!-- 周 -->
              <DetailHot :hot-type="2"/>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container page-state" v-else>
      <el-empty description="商品不存在"><RouterLink to="/">返回首页</RouterLink></el-empty>
    </div>
  </div>
</template>


<style scoped lang='scss'>
.page-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
}

.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;

    span {
      &::before {
        content: "¥";
        font-size: 14px;
      }

      &.current {
        color: $priceColor;
        margin-right: 10px;
        font-size: 22px;
      }

      &.original {
        color: #999;
        text-decoration: line-through;
        font-size: 16px;
      }
    }
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 100px;

    li {
      flex: 1;
      position: relative;

      ~li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    h2 {
      padding: 0 40px;
      font-size: 18px;
      font-weight: normal;
      position: relative;

      >span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  >img {
    width: 100%;
  }
}

.btn {
  margin-top: 20px;

}

.bread-container {
  padding: 25px 0;
}
</style>
