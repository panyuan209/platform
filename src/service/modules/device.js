import axios from '@/util/request'

// 获取设备列表
export const getDeviceList = {
    tag: 'devices/get',
    done () {
        return axios({
            url: '/deviceList/',
            method: 'post',
            data: {},
        })
    },
}
