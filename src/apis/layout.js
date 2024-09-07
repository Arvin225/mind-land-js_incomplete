import request from "@/utils/request";

export function getCustomToDoListAPI() {
    return request.get('http://localhost:3300/customToDoList')
}