/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 21:26:10
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-18 23:24:58
 * @FilePath: /manage-fe/src/store/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 引入vuex
import { userInfo } from './userInfo'
import { createStore } from 'vuex'
const store = createStore({
  modules: {
    userInfo,
  },
})

export default store
