<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
const featuredCategories = computed(() => categoryStore.catagoryList.slice(0, 3))
const markUrl = `${import.meta.env.BASE_URL}brand-mark.svg`
</script>

<template>
  <section class="home-banner" aria-label="栖物集精选日常">
    <div class="hero-copy">
      <span class="eyebrow">QIWU MARKET · DAILY SELECTION</span>
      <h2>让喜欢的生活<br /><em>从这里开始</em></h2>
      <p>为每一天，认真挑选刚刚好的好物。</p>
      <div class="hero-links" v-if="featuredCategories.length">
        <RouterLink v-for="item in featuredCategories" :key="item.id" :to="`/category/${item.id}`">
          探索{{ item.name }} <span aria-hidden="true">↗</span>
        </RouterLink>
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="art-circle"></div>
      <div class="art-card art-card-back"></div>
      <div class="art-card art-card-front">
        <img :src="markUrl" alt="" />
        <span>栖物集</span>
        <small>GOOD THINGS, EVERY DAY.</small>
      </div>
      <div class="art-stamp">DAILY<br />PICKS</div>
    </div>
    <span class="hero-footnote">把日常，过成喜欢的样子</span>
  </section>
</template>

<style scoped lang="scss">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
  overflow: hidden;
  background:
    radial-gradient(circle at 81% 50%, #f3d9c5 0 17%, transparent 17.2%),
    linear-gradient(110deg, #f7f4ef 20%, #ebeaf0 100%);
  color: $navDark;

  .hero-copy {
    position: absolute;
    top: 90px;
    left: 325px;
    z-index: 2;

    .eyebrow {
      color: $brandAccent;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.15em;
    }

    h2 {
      margin: 22px 0 18px;
      font-size: 42px;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: 0.05em;

      em {
        color: $brandPrimary;
        font-style: normal;
      }
    }

    p {
      color: #596778;
      font-size: 16px;
    }
  }

  .hero-links {
    display: flex;
    gap: 9px;
    margin-top: 36px;

    a {
      padding: 11px 14px;
      border: 1px solid #cdd5de;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.8);
      color: $brandPrimary;
      font-size: 14px;
      transition: background-color 0.2s, border-color 0.2s;

      &:hover,
      &:focus-visible {
        border-color: $brandPrimary;
        background: #fff;
      }

      span {
        margin-left: 7px;
      }
    }
  }

  .hero-art {
    position: absolute;
    inset: 0;

    .art-circle {
      position: absolute;
      top: 48px;
      right: 65px;
      width: 380px;
      height: 380px;
      border: 1px solid rgba(51, 75, 104, 0.16);
      border-radius: 50%;
    }

    .art-card {
      position: absolute;
      width: 238px;
      height: 286px;
      border-radius: 15px;
    }

    .art-card-back {
      top: 113px;
      right: 107px;
      transform: rotate(12deg);
      background: #c6ced7;
    }

    .art-card-front {
      top: 104px;
      right: 156px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: rotate(-8deg);
      background: #fff;
      box-shadow: 0 25px 45px rgba(29, 44, 65, 0.15);

      img {
        width: 76px;
        height: 76px;
        background: none;
      }

      span {
        margin-top: 14px;
        font-size: 27px;
        font-weight: 700;
        letter-spacing: 0.1em;
      }

      small {
        margin-top: 8px;
        color: #8a96a4;
        font-size: 9px;
        letter-spacing: 0.12em;
      }
    }

    .art-stamp {
      position: absolute;
      top: 318px;
      right: 70px;
      display: grid;
      place-content: center;
      width: 90px;
      height: 90px;
      transform: rotate(13deg);
      border-radius: 50%;
      background: $brandAccent;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: 0.08em;
      text-align: center;
    }
  }

  .hero-footnote {
    position: absolute;
    right: 36px;
    bottom: 24px;
    color: #6e7b89;
    font-size: 12px;
    letter-spacing: 0.18em;
  }
}
</style>
