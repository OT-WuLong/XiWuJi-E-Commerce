<script setup>
import { onMounted } from 'vue'
import HomePanel from "./HomePanel.vue"
import { getNewAPI } from "@/apis/home"
import { useApiData } from '@/composables/useApiData'

const { data: newList, loading, error, load: getNew } = useApiData(getNewAPI)

onMounted(() => { getNew() })

</script>

<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质保障">
      <ul class="goods-list" v-if="newList.length">
        <li v-for="item in newList" :key="item.id">
          <RouterLink :to="`/detail/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <div class="goods-state" v-else :role="error ? 'alert' : 'status'">
        <span v-if="loading">好物加载中...</span>
        <template v-else-if="error">好物加载失败 <el-button @click="getNew">重试</el-button></template>
        <span v-else>暂无好物推荐</span>
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
    transition: all .5s;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

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
