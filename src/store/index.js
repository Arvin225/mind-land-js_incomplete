import { configureStore } from "@reduxjs/toolkit";
import customToDoListReducer from "./modules/customToDoListStore";

export default configureStore({
    reducer: {
        // 配置到根store中
        customToDoList: customToDoListReducer
    }
})