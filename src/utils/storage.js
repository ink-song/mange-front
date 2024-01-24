/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 20:40:29
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-18 20:49:31
 * @FilePath: /manage-fe/src/utils/storage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const setStorage = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const removeStorage = (key) => {
  window.localStorage.removeItem(key)
}

export const clearStorage = () => {
  window.localStorage.clear()
}
