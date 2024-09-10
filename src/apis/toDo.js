import request from "@/utils/request";

// 获取toDo列表
export function getToDoListAPI({ list, star, done, del = false }) {
    return request.get('/toDoList', { params: { list, star, done, del } })
} 