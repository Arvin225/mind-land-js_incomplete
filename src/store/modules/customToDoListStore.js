import { getCustomToDoListAPI } from "@/apis/layout";

import { createSlice } from "@reduxjs/toolkit";

const customToDoListStore = createSlice({

    name: 'customToDoList',

    // 初始化数据
    initialState: {
        customToDoList: []
    },
    // 配置修改方法（同步）
    reducers: {
        setCustomToDoList(state, action) {
            state.customToDoList = action.payload
        }
    }
})

// 解构出actionCreater
const { setCustomToDoList } = customToDoListStore.actions

// 异步方法
const fetchCustomToDoList = () => {
    return async (dispatch) => {
        const res = await getCustomToDoListAPI()
        dispatch(setCustomToDoList(res.data.map(item => ({
            key: `todo/${item.listName}`,
            // icon: <UploadOutlined />,
            label: item.listName,
            style: { fontSize: '12px' }
        }))))
    }
}


// 得到reducer
const customToDoListReducer = customToDoListStore.reducer

// 按需导出actionCreater
export { setCustomToDoList, fetchCustomToDoList }
// 默认导出reducer
export default customToDoListReducer