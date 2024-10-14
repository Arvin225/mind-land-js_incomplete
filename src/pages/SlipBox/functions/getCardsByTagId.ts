import { getCardAPI, getTagAPI } from "@/apis/slipBox"
import _ from "lodash"

const getCardsByTagId = async (tagId) => {

    // 获取标签及其后代标签的卡片id，返回卡片id数组
    async function getCardIdsByTagAndOffspring(tagId) {
        const res = await getTagAPI(tagId)
        const tag = res.data
        if (!tag) {
            console.warn('找不到该标签：', tagId)
            return []
        }

        // 初始化数组
        const tagAndOffspringCards = [...tag.cards]

        // 获取children
        const children = tag.children
        // 递归终止条件：children为空
        for (let i = 0; i < children.length; i++) {
            const cid = children[i];
            // 业务逻辑：收集后代标签的card
            tagAndOffspringCards.push(... await getCardIdsByTagAndOffspring(cid)) // 递归
        }

        return tagAndOffspringCards
    }

    // 获取该标签及其后代标签下的所有卡片id并去重
    const allCardIds = _.uniq(await getCardIdsByTagAndOffspring(tagId))

    // 获取卡片
    const promiseList = []
    for (let i = 0; i < allCardIds.length; i++) {
        const cardId = allCardIds[i];
        promiseList.push(await getCardAPI(cardId))
    }

    try {
        const resList = await Promise.all(promiseList)
        const allCards = []
        resList.forEach(res => {
            allCards.push(res.data)
        })
        return allCards
    } catch (error) {
        console.error('Error: ', error);
    }

}

export default getCardsByTagId