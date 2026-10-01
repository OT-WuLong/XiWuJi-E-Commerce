<template>
  <footer class="app_footer">
    <div class="extra">
      <div class="container">
        <div class="slogan">
          <div>
            <i class="iconfont icon-footer01"></i>
            <span>精选好物</span>
          </div>
          <div>
            <i class="iconfont icon-footer02"></i>
            <span>轻松选购</span>
          </div>
          <div>
            <i class="iconfont icon-footer03"></i>
            <span>用心生活</span>
          </div>
        </div>
        <!-- 版权信息 -->
        <div class="copyright">
          <p>栖物集前端练习项目，仅供学习交流</p>
          <p>商品与订单数据来自测试接口</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang='scss'>
.app_footer {
  overflow: hidden;
  background-color: $pageCanvas;
  padding-top: 0;

  .extra {
    background-color: $navDark;
  }

  .slogan {
    height: 178px;
    line-height: 58px;
    padding: 60px 100px;
    border-bottom: 1px solid #45566c;
    display: flex;
    justify-content: space-between;

    >div {
      height: 58px;
      line-height: 58px;
      color: #fff;
      font-size: 28px;

      i {
        font-size: 50px;
        vertical-align: middle;
        margin-right: 10px;
        font-weight: 100;
      }

      span {
        vertical-align: middle;
        text-shadow: 0 0 1px $navDark;
      }
    }
  }

  .copyright {
    height: 170px;
    padding-top: 40px;
    text-align: center;
    color: #999;
    font-size: 15px;

    p {
      line-height: 1;
      margin-bottom: 20px;
    }

  }
}
</style>
