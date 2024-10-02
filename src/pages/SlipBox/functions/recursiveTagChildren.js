import { getTagAPI } from "@/apis/slipBox"

const recursiveTagChildren = async (tagId, task) => {
    // 递归终止条件
    if (!tagId) return

    const res = await getTagAPI(tagId)
    const tag = res.data
    const children = tag.children

    for (let i = 0; i < children.length; i++) {
        const cid = children[i];
        // 递归
        await recursiveTagChildren(cid, task)
    }

    // 业务
    await task(tag)
}

export default recursiveTagChildren