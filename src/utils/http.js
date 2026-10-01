import axios from 'axios'
import { ElMessage } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css'
import router from '@/router';

import { useUserStore } from '@/stores/userStore';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const httpInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
})

//拦截器
httpInstance.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.userInfo.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpInstance.interceptors.response.use(res => res.data, e => {
  const userStore = useUserStore()
  ElMessage({
    type: 'warning',
    message: e.response?.data?.message || (e.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '网络异常，请稍后重试')
  })

  if (e.response?.status === 401 && userStore.userInfo.token && e.config?.url !== '/login') {
    userStore.clearuserInfo()
    router.replace('/login')
  }
  return Promise.reject(e)
})

export default httpInstance
