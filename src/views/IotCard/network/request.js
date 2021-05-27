import axios from 'axios'

export function request (config) {
  const instance = axios.create({
    method: 'post',
    baseURL: 'https://bird.ioliu.cn/v1/?url=http://121.204.204.8:8082',
    timeout: 5000,
  })
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err)
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })
  return instance(config)
}
