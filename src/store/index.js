import { configureStore } from "@reduxjs/toolkit";
import toDoListReducer from "./modules/toDoListStore";

export default configureStore({
    reducer: {
        // 配置到根store中
        toDoList: toDoListReducer
    }
})