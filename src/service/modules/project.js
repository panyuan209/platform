import axios from '@/util/request'

// 获取项目列表
export const getProjectList = {
    tag: 'project/get',
    done () {
        return axios({
            url: '/projectList/',
            method: 'post',
            data: {},
        })
    },
}
