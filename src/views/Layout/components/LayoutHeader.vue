<script setup>
import { useCategoryStore } from '@/stores/categoryStore.js';
import HeaderCart from './HeaderCart.vue';
import BrandLogo from '@/components/BrandLogo.vue';
const categoryStore = useCategoryStore();


</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <BrandLogo />
      </h1>
      <ul class="app-header-nav">
        <li class="home" v-for="item in categoryStore.catagoryList" :key="item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search" aria-hidden="true"></i>
        <input type="text" placeholder="搜索暂未开放" aria-label="搜索暂未开放" disabled>
      </div>
      <!-- 头部购物车 -->
      <HeaderCart></HeaderCart>
    </div>
  </header>
</template>


<style scoped lang='scss'>
.app-header {
  background: #fff;

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;
  }

  .app-header-nav {
    width: 820px;
    display: flex;
    padding-left: 40px;
    position: relative;
    z-index: 998;

    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;

      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;

        &:hover {
          color: $brandPrimary;
          border-bottom: 1px solid $brandPrimary;
        }
      }

      .active {
        color: $brandPrimary;
        border-bottom: 1px solid $brandPrimary;
      }
    }
  }

  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $brandAccent;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
