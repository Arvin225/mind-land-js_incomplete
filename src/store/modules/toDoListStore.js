import { getToDoListNamesAPI } from "@/apis/layout";
import { getToDoListAPI, postToDoItemAPI } from "@/apis/toDo";

import { createSlice } from "@reduxjs/toolkit";

const toDoListStore = createSlice({

    name: 'toDoList',

    // 初始化数据
    initialState: {
        toDoListNames: [],
        toDoList: []
    },
    // 配置修改方法（同步）
    reducers: {
        setToDoListNames(state, action) {
            state.toDoListNames = action.payload
        },
        setToDoList(state, action) {
            state.toDoList = action.payload
        }
    }
})


/* ------------------------------------------------解构出actionCreater------------------------------------------------ */
const { setToDoListNames, setToDoList } = toDoListStore.actions


/* ------------------------------------------------异步方法------------------------------------------------ */
// 获取自定义列表名
const fetchToDoListNames = () => {
    return async (dispatch) => {
        const res = await getToDoListNamesAPI()
        dispatch(setToDoListNames(res.data.map(item => ({
            key: `todo/${item.listName}`,
            // icon: <UploadOutlined />,
            label: item.listName,
            style: { fontSize: '12px' }
        }))))
    }
}

// 获取todo列表
const fetchGetToDoList = (listName) => {
    return async (dispatch) => {
        let res
        switch (listName) {
            case '星标':
                res = await getToDoListAPI({ star: true, done: false })
                break;
            case '已完成':
                res = await getToDoListAPI({ done: true })
                break;
            case '回收站':
                res = await getToDoListAPI({ del: true })
                break;
            default:
                res = await getToDoListAPI({ list: listName, done: false })
                break;
        }

        dispatch(setToDoList(res.data))
    }
}


/* ------------------------------------------------导出------------------------------------------------ */
// 按需导出actionCreater
export { setToDoListNames, fetchToDoListNames, setToDoList, fetchGetToDoList }

// 默认导出reducer
export default toDoListStore.reducer