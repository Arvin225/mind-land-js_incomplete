import request from "@/utils/request";

// 获取toDo列表
export function getToDoListAPI({ list, star, done, del = false }) {
    return request.get('/toDoList', { params: { list, star, done, del } })
}


// 新增toDo项
export function postToDoItemAPI({ content, done = false, star = false, del = false, list }) {
    return request.post('/toDoList', { content, done, star, del, list })
}

// 删除toDo项
export function deleteToDoItemAPI(id) {
    return request.patch(`/toDoList/${id}`, { del: true })
}

// 修改toDo项
export function patchToDoItemAPI({ id, content, done, star, del, list }) {
    return request.patch(`/toDoList/${id}`, { content, list, star, done, del })
}

// 获取toDo项
export function getToDoItemAPI(id) {
    return request.get(`/toDoList/${id}`)
}

