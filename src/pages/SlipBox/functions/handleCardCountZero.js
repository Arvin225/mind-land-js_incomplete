import { deleteTagAPI } from "@/apis/slipBox"

const handleCardCountZero = (tagId) => {
    return deleteTagAPI(tagId)
}

export default handleCardCountZero