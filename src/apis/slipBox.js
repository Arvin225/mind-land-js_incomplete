import request from "@/utils/request";

// 获取卡片们
export function getCardsAPI(tagId) {
    return request.get('/cards', { params: { tagId } })

}
// 获取标签们
export function getTagsAPI() {
    return request.get('/tags')
}
