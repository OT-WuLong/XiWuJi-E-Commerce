<script setup>
import { onMounted } from 'vue'
import HomePanel from "./HomePanel.vue"
import { getHotAPI } from "@/apis/home"
import { useApiData } from '@/composables/useApiData'

const { data: hotList, loading, error, load: getHot } = useApiData(getHotAPI)

onMounted(() => { getHot() })
</script>

<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 精选推荐">
      <ul class="goods-list" v-if="hotList.length">
        <li v-for="item in hotList" :key="item.id">
          <div>
            <img v-img-lazy="item.picture" :alt="item.alt" />
            <p class="name">{{ item.title }}</p>
            <p class="desc">{{ item.alt }}</p>
          </div>
        </li>
      </ul>
      <div class="goods-state" v-else :role="error ? 'alert' : 'status'">
        <span v-if="loading">推荐加载中...</span>
        <template v-else-if="error">推荐加载失败 <el-button @click="getHot">重试</el-button></template>
        <span v-else>暂无人气推荐</span>
      </div>
  </HomePanel>
</template>


<style scoped lang='scss'>
.goods-state {
  height: 406px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;

    background: #f0f9f4;
    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      color: $priceColor;
    }
  }
}
</style>
