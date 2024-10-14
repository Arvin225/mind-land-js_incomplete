import request from "@/utils/request";

// 获取toDo列表
export function getToDoListAPI({ listId, star, done, del = false }) {
    return request.get('/toDoList', { params: { listId, star, done, del } })
}

// 新增toDo项
export function postToDoItemAPI({ content, done = false, star = false, del = false, listId, listName }) {
    return request.post('/toDoList', { content, done, star, del, listId, listName })
}

// 永久删除toDo项
export function deleteToDoItemAPI(id) {
    return request.patch(`/toDoList/${id}`)
}

// 修改toDo项（删除、编辑内容、修改状态、修改分组）
export function patchToDoItemAPI({ id, content, star, done, del, listId, listName }) {
    return request.patch(`/toDoList/${id}`, { content, star, done, del, listId, listName })
}

// todo 后端实现通过列表id删除toDo项
export function patchToDoItemByListIdAPI(listId) {
    return request.patch(`/toDoList/${listId}`, { del: true })
}

// 获取toDo项
export function getToDoItemAPI(id) {
    return request.get(`/toDoList/${id}`)
}

