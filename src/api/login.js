/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 14:56:21
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-22 22:21:30
 * @FilePath: /manage-fe/src/api/login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/utils/request";

// 登录
export function userLogin(data) {
  return request({
    url: "/users/login",
    method: "post",
    data,
  });
}
