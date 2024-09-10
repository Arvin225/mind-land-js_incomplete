import request from "@/utils/request";

export function getToDoListNamesAPI() {
    return request.get('/toDoListNames') //得到的是一个promise对象，后续可以进行then和catch
}