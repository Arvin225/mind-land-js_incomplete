import request from "@/utils/request";

// 获取卡片们
export function getCardsAPI(tagId) {
    return request.get('/cards', { params: { tags: { tagId } } })

}

// 获取标签们
export function getTagsAPI() {
    return request.get('/tags')
}

// 新增卡片
export function postCardAPI(card) {
    return request.post('/cards', card)
}

// 新增标签
export function postTagAPI(tag) {
    return request.post('/tags', tag)
}

// 获取标签 by标签名
export function getTagByTagNameAPI(tagName) {
    return request.get('/tags', { params: { tagName } })
}

// 修改标签
export function patchTagAPI({ id, tagName, cardCount, children }) {
    return request.patch(`/tags/${id}`, { id, tagName, cardCount, children })
}