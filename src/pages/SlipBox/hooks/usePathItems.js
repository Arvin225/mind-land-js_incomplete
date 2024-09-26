import _ from "lodash";
import { useState } from "react";

function usePathItems() {
    const allCard = { title: <a href="">全部卡片</a> }

    const [pathItems, setPathItems] = useState([allCard])
    const buildPathItems = (tagName) => {
        if (!tagName) { // 如果传过来的是空值则为全部卡片，路径为初始状态
            setPathItems([allCard])
            return
        }
        const splitNames = tagName.split('/')
        const pathItems = [allCard]
        if (splitNames.length > 1) {
            // todo 多级标签的根标签加上tagId
            pathItems.push({ title: <a href={`/cards/?tagName=${splitNames[0]}`}>{splitNames[0]}</a> })
            pathItems.push(...((splitNames.slice(1, splitNames.length - 1)).map(name => ({ title: <a href="">{name}</a> }))))
            pathItems.push({ title: _.last(splitNames) })
        } else {
            pathItems.push({ title: tagName })
        }
        setPathItems(pathItems)
    }
    return { pathItems, buildPathItems }
}
export default usePathItems

