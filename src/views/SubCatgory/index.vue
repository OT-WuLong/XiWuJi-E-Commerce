<script setup>
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '@/views/Home/components/GoodsItem.vue'

const route = useRoute()
const categoryData = ref({})
const categoryError = ref(false)
const goodList = ref([])
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime',
})
const loading = ref(false)
const disableLoad = ref(false)
const loadError = ref(false)
let requestVersion = 0
let categoryRequest = 0
const load = async () => {
  if (loading.value || disableLoad.value || loadError.value) return
  const version = requestVersion
  const page = reqData.value.page + 1
  loading.value = true
  try {
    const res = await getSubCategoryAPI({ ...reqData.value, page })
    if (version !== requestVersion) return
    reqData.value.page = page
    goodList.value = [...goodList.value, ...res.result.items]
    disableLoad.value = res.result.items.length < reqData.value.pageSize
  } catch {
    if (version === requestVersion) loadError.value = true
  } finally {
    if (version === requestVersion) loading.value = false
  }
}

const resetGoods = () => {
  requestVersion++
  reqData.value.page = 0
  goodList.value = []
  loading.value = false
  disableLoad.value = false
  loadError.value = false
  load()
}

const retryLoad = () => {
  loadError.value = false
  load()
}

const getCategoryData = async (id) => {
  const currentRequest = ++categoryRequest
  categoryData.value = {}
  categoryError.value = false
  try {
    const res = await getCategoryFilterAPI(id)
    if (currentRequest === categoryRequest) categoryData.value = res.result
  } catch {
    if (currentRequest === categoryRequest) categoryError.value = true
  }
}

watch(() => route.params.id, (id) => {
  reqData.value.categoryId = id
  resetGoods()
  getCategoryData(id)
}, { immediate: true })
</script>
<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <div v-if="categoryError" class="category-error" role="alert">
        分类信息加载失败 <el-button @click="getCategoryData(route.params.id)">重试</el-button>
      </div>
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="categoryData.parentId" :to="{ path: `/category/${categoryData.parentId}` }">
          {{ categoryData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name || '商品分类' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="reqData.sortField" @tab-change="resetGoods">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="loading || disableLoad || loadError">
        <!-- 商品列表-->
        <goods-item v-for="goods in goodList" :goods="goods" :key="goods.id" />
        <div class="list-status" v-if="loading" role="status">商品加载中...</div>
        <div class="list-status" v-else-if="loadError" role="alert">
          商品加载失败 <el-button @click="retryLoad">重试</el-button>
        </div>
        <el-empty v-else-if="!goodList.length && disableLoad" description="暂无商品" />
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;

  .category-error {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .list-status {
    width: 100%;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>
