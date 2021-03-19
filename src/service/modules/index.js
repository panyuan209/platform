import axios from '@/util/request'

// 登录获取设备列表
export const loginFetch = {
    tag: 'login/put',
    done (data) {
        return axios({
            url: '/login',
            method: 'post',
            data,
        })
    },
}
