<script setup>
defineProps({
  compact: { type: Boolean, default: false }
})

const markUrl = `${import.meta.env.BASE_URL}brand-mark.svg`
</script>

<template>
  <RouterLink to="/" class="brand-logo" :class="{ compact }" aria-label="栖物集首页">
    <img class="brand-mark" :src="markUrl" alt="" width="48" height="48" />
    <span class="brand-copy">
      <strong>栖物集</strong>
      <small>QIWU MARKET</small>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 200px;
  height: 132px;
  color: $navDark;

  &:focus-visible {
    outline: 2px solid $brandPrimary;
    outline-offset: 4px;
  }

  .brand-mark {
    flex: none;
    width: 48px;
    height: 48px;
    background: none;
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    white-space: nowrap;

    strong {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    small {
      margin-top: 6px;
      color: #7c8796;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.17em;
    }
  }

  &.compact {
    height: 80px;

    .brand-mark {
      width: 40px;
      height: 40px;
    }

    .brand-copy strong {
      font-size: 25px;
    }
  }
}
</style>
