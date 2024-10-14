import { getTagAPI, patchTagAPI } from "@/apis/slipBox"

const recursiveTagParent = async (tagId, task) => {
    // 递归终止条件
    if (!tagId) return

    const res = await getTagAPI(tagId)
    const tag = res.data
    const pid = tag.parent

    // 业务
    await task(tag)

    // 递归
    await recursiveTagParent(pid, task)

}

export default recursiveTagParent