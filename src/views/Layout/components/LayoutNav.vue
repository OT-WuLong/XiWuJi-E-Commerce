<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter()
const userStore = useUserStore()

const confirm = () => {
  userStore.clearuserInfo()
  router.replace('/login')
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="userStore.userInfo.token">
          <li><RouterLink to="/member/user"><i class="iconfont icon-user"></i>{{ userStore.userInfo.account }}</RouterLink></li>
          <li>
            <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <button type="button">退出登录</button>
              </template>
            </el-popconfirm>
          </li>
          <li><RouterLink to="/member/order">我的订单</RouterLink></li>
          <li><RouterLink to="/member/user">会员中心</RouterLink></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #333;

  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;

    li {
      a,
      button {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        background: none;
        border: 0;
        font: inherit;
        cursor: pointer;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $xtxColor;
        }
      }

      ~li {
        a,
        button {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
