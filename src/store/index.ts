import { configureStore } from "@reduxjs/toolkit";
import toDoReducer from "./modules/toDoStore";
import slipBoxReducer from "./modules/slipBoxStore";

export default configureStore({
    reducer: {
        // 配置到根store中
        toDo: toDoReducer,
        slipBox: slipBoxReducer
    }
})