<script setup>
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
import { useCategory } from '@/views/Category/composables/useCategory'

const { categoryData, loading, loadError, retry } = useCategory()
</script>

<template>
  <div class="top-category">
    <div class="container m-top-20 page-state" v-if="loading" role="status">分类加载中...</div>
    <div class="container m-top-20 page-state" v-else-if="loadError" role="alert">
      分类加载失败 <el-button @click="retry">重试</el-button>
    </div>
    <div class="container m-top-20 page-state" v-else-if="!categoryData?.children?.length">
      <el-empty description="暂无分类商品"><RouterLink to="/">返回首页</RouterLink></el-empty>
    </div>
    <div class="container m-top-20" v-else>
      <!-- 面包屑 -->
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <section class="category-intro" :aria-label="`${categoryData.name}精选分类`">
        <div class="intro-copy">
          <span>QIWU MARKET / COLLECTION</span>
          <h2>{{ categoryData.name }}好物</h2>
          <p>从日常里发现值得喜欢的选择。</p>
        </div>
        <div class="intro-cards">
          <RouterLink v-for="item in categoryData.children.slice(0, 3)" :key="item.id" :to="`/category/sub/${item.id}`">
            <img :src="item.picture" alt="" />
            <strong>{{ item.name }}</strong>
            <span aria-hidden="true">↗</span>
          </RouterLink>
        </div>
      </section>
      <!-- 分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="i in categoryData.children" :key="i.id">
            <RouterLink :to="`/category/sub/${i.id}`"> <!-- 点击跳转到二级路由页面 -->
              <img :src="i.picture" alt="" />
              <p>{{ i.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="ref-goods" v-for="item in categoryData.children" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }}-</h3>
        </div>
        <div class="body">
          <GoodsItem v-for="good in item.goods" :goods="good" :key="good.id" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.page-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
}

.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;


        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: $brandPrimary;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: space-around;
      padding: 0 40px 30px;
    }
  }

  .bread-container {
    padding: 25px 0;
  }

}

.category-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 300px;
  padding: 38px 54px;
  background:
    radial-gradient(circle at 88% 18%, #e6d8cd 0 12%, transparent 12.2%),
    linear-gradient(105deg, #e9eef5, #f7f4ef);

  .intro-copy {
    span {
      color: $brandAccent;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
    }

    h2 {
      margin: 16px 0 12px;
      color: $navDark;
      font-size: 42px;
      font-weight: 700;
    }

    p {
      color: #617083;
      font-size: 16px;
    }
  }

  .intro-cards {
    display: flex;
    gap: 14px;

    a {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 174px;
      height: 208px;
      padding: 18px 10px;
      border: 1px solid #e1e4e7;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 10px 22px rgba(29, 44, 65, 0.06);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover,
      &:focus-visible {
        transform: translateY(-5px);
        box-shadow: 0 15px 28px rgba(29, 44, 65, 0.12);
      }

      img {
        width: 125px;
        height: 125px;
        object-fit: contain;
      }

      strong {
        margin-top: 9px;
        color: $navDark;
        font-size: 15px;
        font-weight: 600;
      }

      span {
        position: absolute;
        right: 13px;
        bottom: 10px;
        color: $brandAccent;
        font-size: 18px;
      }
    }
  }
}
</style>
