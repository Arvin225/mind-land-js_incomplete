import { useParams } from "react-router-dom"
import ToDoItem from "./components/ToDoItem/toDoItem"
import { useEffect } from "react"
import { fetchToDoList } from "@/store/modules/toDoListStore"
import { useDispatch, useSelector } from "react-redux"
import { Card } from "antd"

function ToDo() {
    const params = useParams()

    const listName = params.listName

    const dispatch = useDispatch()
    // 异步请求当前列表数据
    useEffect(() => {
        dispatch(fetchToDoList(listName))
    }, []) // 依赖于新增或删除待办引起的查询状态的改变
    // 获取当前列表数据
    const { toDoList } = useSelector(state => state.toDoList)

    return (
        <Card title={listName ? listName : '全部'} bordered={false}>
            {/* 渲染to-do项组件 */}
            {/* 条件渲染：当listName存在时正常渲染，不存在时（在全部中）加上tag属性（给列表名） */}
            {listName ? toDoList.map(item => <ToDoItem item={item} key={item.id} />) : toDoList.map(item => <ToDoItem item={item} tag={item.list} key={item.id} />)}


            {/* to-do input表单 */}
        </Card>
    )
}

export default ToDo