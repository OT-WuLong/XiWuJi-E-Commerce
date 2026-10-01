<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getHotGoodsAPI } from '@/apis/detail'

const hotList = ref([])
const loading = ref(true)
const loadError = ref(false)
const route = useRoute()
let requestId = 0

const props = defineProps({
  hotType: {
    type: Number
  }
})

const TYPEMAP = {
  1: '24小时热榜',
  2: '周榜单'
}

const title = computed(() => TYPEMAP[props.hotType])

const getHotList = async () => {
  const currentRequest = ++requestId
  hotList.value = []
  loading.value = true
  loadError.value = false
  try {
    const res = await getHotGoodsAPI({
      id: route.params.id,
      type: props.hotType,
      limit: 3
    })
    if (currentRequest === requestId) hotList.value = res.result
  } catch {
    if (currentRequest === requestId) loadError.value = true
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
watch(() => route.params.id, getHotList, { immediate: true })
</script>


<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品区块 -->
    <RouterLink :to="`/detail/${item.id}`" class="goods-item" v-for="item in hotList" :key="item.id">
      <img :src="item.picture" alt="" />
      <p class="name ellipsis">{{ item.name }}</p>
      <p class="desc ellipsis">{{ item.desc }}</p>
      <p class="price">&yen;{{ item.price }}</p>
    </RouterLink>
    <div class="hot-state" v-if="!hotList.length" :role="loadError ? 'alert' : 'status'">
      <span v-if="loading">热榜加载中...</span>
      <template v-else-if="loadError">热榜加载失败 <el-button @click="getHotList">重试</el-button></template>
      <span v-else>暂无热榜商品</span>
    </div>
  </div>
</template>


<style scoped lang="scss">
.goods-hot {
  .hot-state {
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #fff;
  }

  h3 {
    height: 70px;
    background: $helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .goods-item {
    display: block;
    padding: 20px 30px;
    text-align: center;
    background: #fff;

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
}
</style>
