import { getCardsAPI, getTagsAPI } from "@/apis/slipBox";
import { createSlice } from "@reduxjs/toolkit";

const slipBoxStore = createSlice({
    name: 'slipBox',

    initialState: {
        cards: [],
        loadingCards: true,
        tags: [],
        loadingTags: true,
    },

    reducers: {
        setCards(state, action) {
            state.cards = action.payload
        },
        setLoadingCards(state, action) {
            state.loadingCards = action.payload
        },
        setTags(state, action) {
            state.tags = action.payload
        },
        setLoadingTags(state, action) {
            state.loadingTags = action.payload
        }
    }
})

// 解构出actionCreater
const { setCards, setLoadingCards, setTags, setLoadingTags } = slipBoxStore.actions

// 异步获取cards
function fetchGetCards(tagId) {
    return async (dispatch) => {
        const res = await getCardsAPI(tagId)
        dispatch(setCards(res.data))
        dispatch(setLoadingCards(false))
    }
}

// 异步获取tags
function fetchGetTags() {
    return async (dispatch) => {
        const res = await getTagsAPI()
        dispatch(setTags(res.data))
        dispatch(setLoadingTags(false))
    }
}

// 导出actionCreater
export { setCards, fetchGetCards, setLoadingCards, setTags, fetchGetTags, setLoadingTags }

// 默认导出reducer
export default slipBoxStore.reducer