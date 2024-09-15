import { useParams } from "react-router-dom"
import ToDoItem from "./components/ToDoItem/toDoItem"
import { useEffect, useState } from "react"
import { fetchGetToDoList } from "@/store/modules/toDoListStore"
import { useDispatch, useSelector } from "react-redux"
import { Card, Input, Affix } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { postToDoItemAPI } from "@/apis/toDo"
import { Bounce, ToastContainer, toast } from "react-toastify"

function ToDo() {

    const params = useParams()

    const listName = params.listName

    const dispatch = useDispatch()

    // 获取当前列表数据
    const { toDoList } = useSelector(state => state.toDoList)
    // 异步请求当前列表数据
    useEffect(() => {
        dispatch(fetchGetToDoList(listName))
    }, [listName])

    // 新增todo
    const [inputValue, setInputValue] = useState('')
    const star = (listName === '星标') && true //如果是在星标列表，star为true
    const list = (listName && listName !== '星标') ? listName : undefined //如果是在自定义列表中，则设置所属列表
    const addToDo = () => {
        if (inputValue.trim()) //非空判断
            // todo 禁用输入框
            // 提交到数据库
            postToDoItemAPI({ content: inputValue, star: star, list: list }).then(res => {
                // 成功，重新请求列表更新store渲染列表，取消禁用输入框
                dispatch(fetchGetToDoList(listName))
                // 清空输入框
                setInputValue('')
            }).catch(err => {
                // 失败，提示用户，取消禁用输入框
                toast.error('操作失败，请稍后再试')
            })
    }

    return (
        <>
            <ToastContainer position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <Card title={listName ? listName : '全部'} bordered={false}>
                {/* 渲染to-do项组件 */}
                {/* 条件渲染：当listName存在时正常渲染，不存在时（在全部中）加上tag属性（给列表名） */}
                {listName ? toDoList.map(item => <ToDoItem item={item} key={item.id} />) : toDoList.map(item => <ToDoItem item={item} tag={item.list} key={item.id} />)}

                {/* to-do input表单 */}
                <Affix offsetTop={830}>
                    <Card type="inner">
                        <PlusOutlined style={{ marginLeft: 6 }} />
                        <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="添加任务" variant="borderless" style={{ marginLeft: 12, minWidth: '50%', maxWidth: '86%' }} onPressEnter={addToDo} />
                    </Card>
                </Affix>
            </Card>
        </>

    )
}

export default ToDo