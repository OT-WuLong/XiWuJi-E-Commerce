<script setup>
import { getLikeListAPI } from '@/apis/user'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
import { useApiData } from '@/composables/useApiData'
const userStore = useUserStore()
const { data: likeList, loading, error, load: getLikeList } = useApiData(() => getLikeListAPI({ limit: 4 }))
onMounted(() => getLikeList())

</script>

<template>
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img :src="userStore.userInfo?.avatar" alt="" />
      </div>
      <h4>{{ userStore.userInfo?.account }}</h4>
    </div>
    <div class="item">
      <RouterLink to="/member/order">
        <span class="iconfont icon-hy"></span>
        <p>我的订单</p>
      </RouterLink>
      <RouterLink to="/cartlist">
        <span class="iconfont icon-cart"></span>
        <p>我的购物车</p>
      </RouterLink>
    </div>
  </div>
  <div class="like-container">
    <div class="home-panel">
      <div class="header">
        <h4>猜你喜欢</h4>
      </div>
      <div class="goods-list" v-if="likeList.length">
        <GoodsItem v-for="good in likeList" :key="good.id" :goods="good" />
      </div>
      <div class="like-state" v-else :role="error ? 'alert' : 'status'">
        <span v-if="loading">推荐加载中...</span>
        <template v-else-if="error">推荐加载失败 <el-button @click="getLikeList">重试</el-button></template>
        <span v-else>暂无推荐商品</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-overview {
  height: 132px;
  background: url(@/assets/images/center-bg.webp) no-repeat center / cover;
  display: flex;

  .user-meta {
    flex: 1;
    display: flex;
    align-items: center;

    .avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 60px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    h4 {
      padding-left: 26px;
      font-size: 18px;
      font-weight: normal;
      color: white;
    }
  }

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:first-child {
      border-right: 1px solid #f4f4f4;
    }

    a {
      color: white;
      font-size: 16px;
      text-align: center;

      .iconfont {
        font-size: 32px;
      }

      p {
        line-height: 32px;
      }
    }
  }
}

.like-container {
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
}

.home-panel {
  background-color: #fff;
  padding: 0 20px;
  margin-top: 20px;
  height: 400px;

  .header {
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 18px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    h4 {
      font-size: 22px;
      font-weight: 400;
    }

  }

  .goods-list {
    display: flex;
    justify-content: space-around;
  }

  .like-state {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
