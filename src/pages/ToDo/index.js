import { useSearchParams } from "react-router-dom"

function ToDo() {
    const [params] = useSearchParams()

    const listName = params.get('listName')



    if (listName === '全部') {
        // 展示 列表名 在todo项上
    } else {
        // 不展示列表名
    }

    return (
        <>
            <h1>{listName ? listName : '全部'}</h1>
            {/* 渲染to-do项组件 */}

            This is ToDo page
            {/* to-do input表单 */}
        </>
    )
}

export default ToDo