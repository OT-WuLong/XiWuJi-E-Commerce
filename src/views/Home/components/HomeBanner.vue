<script setup>
import { getBannerAPI } from '@/apis/home'
import { onMounted } from 'vue'
import { useApiData } from '@/composables/useApiData'

const { data: bannerList, loading, error, load: getBanner } = useApiData(getBannerAPI)

onMounted(() => {
  getBanner()
})
</script>

<template>
  <div class="home-banner">
    <el-carousel v-if="bannerList.length" height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <div class="banner-state" v-else :role="error ? 'alert' : 'status'">
      <span v-if="loading">轮播加载中...</span>
      <template v-else-if="error">轮播加载失败 <el-button @click="getBanner">重试</el-button></template>
      <span v-else>暂无轮播内容</span>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  .banner-state {
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #f5f5f5;
  }

  img {
    width: 100%;
    height: 500px;
  }
}
</style>
