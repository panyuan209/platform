/**
* 角色权限处理
*
*/

import store from '@/store'

export default {
    inserted (el, { value }, vnode) {
        if (!hasRole) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    },
}
