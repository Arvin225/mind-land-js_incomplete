import request from "@/utils/request";

// 获取卡片们
export function getCardsAPI(tagId) {
    /* let tid
    tagId && (tid = '<p>'.concat(tagId.concat('<p>')))
    return request.get('/cards', { params: { tags_like: tid } }) */
    return request.get('/cards', { params: { tagId: tagId } })
}

// 获取卡片
export function getCardAPI(id) {
    return request.get(`/cards/${id}`)
}

// 获取标签们
export function getTagsAPI() {
    return request.get('/tags')
}

// 获取标签
export function getTagAPI(id) {
    return request.get(`/tags/${id}`)
}

// 新增卡片
export function postCardAPI(card) { // 由于json-server不支持数组元素的精确匹配，暂时将tags处理成字符串
    // const tags = card.tags.length ? '<p>'.concat((card.tags.join('<p>')).concat('<p>')) : []
    return request.post('/cards', card)
}

// 新增标签
export function postTagAPI(tag) {
    return request.post('/tags', tag)
}

// 获取标签 by标签名 // todo 暂时
export function getTagByTagNameAPI(tagName) {
    return request.get('/tags', { params: { tagName } })
}

// 修改标签
export function patchTagAPI({ id, tagName, parent, children, cardCount, cards }) {
    return request.patch(`/tags/${id}`, { id, tagName, parent, children, cardCount, cards })
}