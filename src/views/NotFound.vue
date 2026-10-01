<template>
  <main class="container not-found">
    <el-empty description="页面不存在">
      <RouterLink class="back-home" to="/">返回首页</RouterLink>
    </el-empty>
  </main>
</template>

<style scoped lang="scss">
.not-found {
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.back-home {
  color: $xtxColor;
}
</style>
