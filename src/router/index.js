import { createBrowserRouter } from "react-router-dom"
import Container from "@/pages/Container"

import { lazy, Suspense } from "react"

const AI = lazy(() => import("@/pages/AI"))
const Home = lazy(() => import("@/pages/Home"))
const ToDo = lazy(() => import("@/pages/ToDo"))
const Draft = lazy(() => import("@/pages/Draft"))
const MindMap = lazy(() => import("@/pages/MindMap"))
const SlipBox = lazy(() => import("@/pages/SlipBox"))
const MarkList = lazy(() => import("@/pages/MarkList"))
const Diary = lazy(() => import("@/pages/Diary"))
const Note = lazy(() => import("@/pages/Note"))

/* import AI from "@/pages/AI"
import Home from "@/pages/Home"
import ToDo from "@/pages/ToDo"
import Draft from "@/pages/Draft"
import MindMap from "@/pages/MindMap"
import SlipBox from "@/pages/SlipBox"
import MarkList from "@/pages/MarkList"
import Diary from "@/pages/Diary"
import Note from "@/pages/Note" */


const router = createBrowserRouter([
    {
        path: '/',
        element: <Container />,
        children: [
            {
                path: "/ai",
                element: (<Suspense fallback={'加载中'}><AI /></Suspense>) //配置路由懒加载
            },
            {
                index: true,
                path: "/",
                element: (<Suspense fallback={'加载中'}><Home /></Suspense>)
            },
            {
                path: "/todo",
                element: (<Suspense fallback={'加载中'}><ToDo /></Suspense>)
            },
            {
                path: "/draft",
                element: (<Suspense fallback={'加载中'}><Draft /></Suspense>)
            },
            {
                path: "/mindmap",
                element: (<Suspense fallback={'加载中'}><MindMap /></Suspense>)
            },
            {
                path: "/slipbox",
                element: (<Suspense fallback={'加载中'}><SlipBox /></Suspense>)
            },
            {
                path: "/marklist",
                element: (<Suspense fallback={'加载中'}><MarkList /></Suspense>)
            },
            {
                path: "/diary",
                element: (<Suspense fallback={'加载中'}><Diary /></Suspense>)
            },
            {
                path: "/note",
                element: (<Suspense fallback={'加载中'}><Note /></Suspense>)
            },
        ]
    },
])

export default router