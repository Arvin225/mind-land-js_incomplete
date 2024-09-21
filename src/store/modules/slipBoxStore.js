import { createSlice } from "@reduxjs/toolkit";

const slipBoxStore = createSlice({
    name: 'slipBox',

    initialState: {
        cards: [],
        tags: []
    },

    reducers: {
        setCards(state, action) {
            state.cards = action.payload
        },
        setTags(state, action) {
            state.tags = action.payload
        }
    }
})

// 解构出actionCreater
const { setCards, setTags } = slipBoxStore.actions


// 导出actionCreater
export { setCards, setTags }

// 默认导出reducer
export default slipBoxStore.reducer