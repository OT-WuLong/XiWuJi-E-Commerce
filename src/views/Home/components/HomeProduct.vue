<script setup>
import { onMounted } from 'vue';
import { getGoodsAPI } from '@/apis/home';
import HomePanel from './HomePanel.vue';
import GoodsItem from './GoodsItem.vue';
import { useApiData } from '@/composables/useApiData'

const { data: goodsProduct, loading, error, load: getGoods } = useApiData(getGoodsAPI)

onMounted(() => {getGoods()})

</script>
<template>
  <div class="home-product">
    <div class="goods-state container" v-if="!goodsProduct.length" :role="error ? 'alert' : 'status'">
      <span v-if="loading">商品加载中...</span>
      <template v-else-if="error">商品加载失败 <el-button @click="getGoods">重试</el-button></template>
      <span v-else>暂无分类商品</span>
    </div>
    <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
      <div class="box">
        <RouterLink class="cover" :to="`/category/${cate.id}`">
          <img v-img-lazy="cate.picture" alt="" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="good in cate.goods" :key="good.id">
            <GoodsItem :goods="good" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<style scoped lang='scss'>
.goods-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.home-product {
  background: #fff;
  margin-top: 20px;

  .sub {
    margin-bottom: 2px;

    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;

      &:hover {
        background: $xtxColor;
        color: #fff;
      }

      &:last-child {
        margin-right: 80px;
      }
    }
  }

  .box {
    display: flex;

    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }

    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
